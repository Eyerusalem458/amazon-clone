import { useContext, useState } from "react";
import classes from "./Payment.module.css";
import Layout from "../../Components/Layout/Layout";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/actiontype";
function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  // total items
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  // total price
  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();
  const handlechange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  // pay now function
  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);
      // backend || function ==> contact to the client secret key
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });
      const clientSecret = response.data.clientSecret;

      //  client side(react side confirmation)
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // after confirmation  ==> order firestore database save, clear basket
      await setDoc(doc(db, "users", user.uid, "orders", paymentIntent.id), {
        basket: basket.map((item) => ({
          id: item.id ?? "",
          title: item.title ?? "",
          price: item.price ?? 0,
          amount: item.amount ?? 0,
          image: item.image ?? "",
        })),

        amount: paymentIntent.amount ?? 0,
        created: paymentIntent.created ?? Date.now(),
      });
      // empty basket
      dispatch({
        type: Type.EMPTY_BASKET,
      });
      setProcessing(false);
      navigate("/orders", { state: { msg: "you have placed new order" } });
    } catch (err) {
      console.log(err);

      setProcessing(false);
    }
  };
  return (
    <Layout>
      {/* header */}
      <div className={classes.payment_header}>checkout ({totalItem}) items</div>
      {/* payment method */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>{user?.email}</div>
          <div>123 React Lane</div>
          <div>Chicago,IL</div>
        </div>
        <hr />
        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                {/* card element */}
                <CardElement onChange={handlechange} />
                {/* price */}
                <div className={classes.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order | </p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit">
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Please wait...</p>
                      </div>
                    ) : (
                      "  Pay Now "
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
