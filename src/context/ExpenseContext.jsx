import React, { createContext, useState } from "react";
import { expenses as initialExpenses } from "../data";

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(
    initialExpenses.map((e) => ({
      ...e,
      amount: Number(e.amount) || 0,
      quantity: e.quantity === undefined ? 1 : Number(e.quantity),
    }))
  );

  const [budget, setBudget] = useState(120000);

  // receipts temporarily hold uploaded receipts (Summary page will use this)
  const [receipts, setReceipts] = useState([]);

  function addExpense(expense) {
    const normalized = {
      ...expense,
      amount: (Number(expense.amount) || 0) * (Number(expense.quantity) || 1), // Multiply here
      quantity: Number(expense.quantity) || 1,
    };
    setExpenses((p) => [...p, normalized]);
  }

  function addCategory(name) {
    // keep your fakeExpense behaviour (placeholder)
    const fakeExpense = {
      date: "—",
      category: name,
      categoryColor: "bg-(--grey) text-(--black)",
      description: "—",
      amount: 0,
      quantity: 1,
    };
    setExpenses((p) => [...p, fakeExpense]);
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
