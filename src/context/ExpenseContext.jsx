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

  const [budget, setBudget] = useState(50000);
  const [receipts, setReceipts] = useState([]);

  function addExpense(expense) {
    const qty = Number(expense.quantity) || 1;
    const unit = Number(expense.amount) || 0;
    const total = unit * qty;

    console.log("adding expense", { unit, qty, total, incoming: expense });

    const normalized = {
      date: expense.date || new Date().toISOString().slice(0, 10),
      category: expense.category || "TRANSPORT",
      description: expense.description || "—",
      amount: total,
      quantity: qty,
    };

    setExpenses((p) => [...p, normalized]);
  }

  function addCategory(name) {
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
