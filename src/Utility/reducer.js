import { useReducer } from "react";
import { Type } from "./actiontype"; //holds action names

// this is the starting state, the basket is empty when the app loads
export const intialState = {
  basket: [],
  user: null,
};
// a reducer function
export const reducer = (state, action) => {
  switch (action.type) {
    // check if the item exists
    case Type.ADD_TO_BASKET:
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );
      if (!existingItem) {
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }], // if the action  is Add_To_Basket it keeps the old state and it adds new item to the basket and also the maount of same items that are in the cart.
          //  and the reason we use spread operators is it copies all old items, adds new item at the end without it it create nested array [[oldItems],newItems].
        };
      } else {
        const updatedBasket = state.basket.map((item) => {
          return item.id === action.item.id
            ? { ...item, amount: item.amount + 1 }
            : item;
        });
        return {
          ...state,
          basket: updatedBasket,
        };
      }

    case Type.REMOVE_FROM_BASKET:
      const index = state.basket.findIndex((item) => item.id === action.id);
      let newBasket = [...state.basket];
      if (index >= 0) {
        if (newBasket[index].amount > 1) {
          newBasket[index] = {
            ...newBasket[index],
            amount: newBasket[index].amount - 1,
          };
        } else {
          newBasket.splice(index, 1);
        }
      }
      return {
        ...state,
        basket: newBasket,
      };

    case Type.EMPTY_BASKET:
      return {
        ...state,
        basket: [],
      };

    case Type.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};
