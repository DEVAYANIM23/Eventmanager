import React, { createContext, useState, useEffect } from "react";

const myContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [getAllProduct, setGetAllProduct] = useState([]);

  useEffect(() => {
    // Example: Fetch the product list from an API or local data source
    fetch("/api/products") // Replace with your actual data source
      .then((res) => res.json())
      .then((data) => setGetAllProduct(data));
  }, []);

  return (
    <myContext.Provider value={{ getAllProduct }}>
      {children}
    </myContext.Provider>
  );
};

export default myContext;
