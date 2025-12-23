import React, { useContext, useEffect } from "react";
import "./assets/CSS/styles.css";
import Routering from "./Router";
import { Type } from "./Utility/actiontype";
import { auth } from "./Utility/firebase";
import { DataContext } from "./Components/DataProvider/DataProvider";
function App() {
  const [user, dispatch] = useContext(DataContext);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      // user logged in
      if (authUser) {
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      }
      // user logged out
      else {
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });
  }, []);

  return (
    <>
      <Routering />
    </>
  );
}

export default App;
