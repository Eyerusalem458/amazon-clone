import React, { createContext, useReducer } from "react";
export const DataContext = createContext(); //used to create global state

//   runs useReducer(reducer,intialState), creates: state, dispatch then it share them  both globaly through DataContext.
export const DataProvider = ({ children, reducer, intialState }) => {
  return (
    <DataContext.Provider value={useReducer(reducer, intialState)}>
        {children}
        </DataContext.Provider>
  );
};
