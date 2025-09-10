import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ExpenseContext = createContext();

const GET_EXPENSES_URL = import.meta.env.VITE_GET_EXPENSES_URL;
const ADD_EXPENSE_URL = import.meta.env.VITE_ADD_EXPENSE_URL;

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["FOOD", "RENT", "UTILITIES"]);
  const [budget, setBudget] = useState(50000);

  const [receipts, setReceipts] = useState([]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(GET_EXPENSES_URL);
      if (response.data.data && Array.isArray(response.data.data)) {
        const formattedExpenses = response.data.data.map((e) => ({
          id: e.id,
          date: e.date,
          category: e.category.toUpperCase() || "GENERAL",
          description: e.description,
          amount: Number(e.total_amount) || 0,
          quantity: Number(e.quantity) || 1,
        }));

        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function addExpense(expense) {
    const qty = Number(expense.quantity) || 1;
    const unitAmount = Number(expense.amount) || 0;
    const totalAmount = unitAmount * qty;

    const newExpensePayload = {
      date: expense.date || new Date().toISOString().slice(0, 10),
      category: expense.category,
      description: expense.description || "—",
      quantity: qty,
      unit_amount: unitAmount,
      total_amount: totalAmount,
    };

    try {
      await axios.post(ADD_EXPENSE_URL, newExpensePayload);
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  }

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
        loading,
        budget,
        categories,
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
