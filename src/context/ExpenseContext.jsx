import React, { createContext, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const ExpenseContext = createContext();

const ADD_EXPENSE_URL = import.meta.env.VITE_ADD_EXPENSE_URL;

// GET EXPENSE URL
const GET_EXPENSE_URL = import.meta.env.VITE_GET_EXPENSE_URL;

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

  async function fetchAllExpenses() {
    const response = await axios.get(GET_EXPENSE_URL);

    if (response.data.data) {
      const formattedResponse = response.data.data.map((item) => ({
        id: item.id,
        date: item.date,
        category: item.category,
        description: item.description,
        amount: item.total_amount,
        quantity: item.quantity,
      }));

      setExpenses(formattedResponse);
    }
    console.log(response, "response");
    // if(response.)
  }

  async function addExpense(expense) {
    const quantity = Number(expense.quantity) || 1;
    const unitAmount = Number(expense.amount) || 0;

    const totalAmount = quantity * unitAmount;

    const newExpensePayload = {
      date: expense.date,
      category: expense.category,
      description: expense.description,
      currency: "$",
      quantity: quantity,
      unit_amount: unitAmount,
      total_amount: totalAmount,
    };

    try {
      await axios.post(ADD_EXPENSE_URL, newExpensePayload);
      fetchAllExpenses();
    } catch (error) {
      console.error("error adding ", error);
    }
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        budget,
        categories,
        setReceipts,
        setBudget,
        addExpense,
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
