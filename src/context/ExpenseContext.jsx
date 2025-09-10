import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(["FOOD", "RENT", "UTILITIES"]);
  const [budget, setBudget] = useState(50000);
  const [receipts, setReceipts] = useState([]);

  function addCategory(name) {
    const upperCaseName = name.toUpperCase();
    if (!categories.includes(upperCaseName)) {
      setCategories((prevCategories) => [...prevCategories, upperCaseName]);
    }
  }

  function addReceipt(receipt) {
    setReceipts((p) => [...p, receipt]);
  }

  function clearReceipts() {
    setReceipts([]);
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        budget,
        categories,
        setBudget,
        addCategory,
        receipts,
        addReceipt,
        clearReceipts,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
