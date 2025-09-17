import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const ExpenseContext = createContext();

const ADD_EXPENSE_URL = import.meta.env.VITE_ADD_EXPENSE_URL;
const GET_EXPENSES_URL = import.meta.env.VITE_GET_EXPENSES_URL;

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // FETCH EXPENSE

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
    const quantity = Number(expense.quantity) || 1;
    const unitAmount = Number(expense.amount) || 0;

    const totalAmount = quantity * unitAmount;

    const newExpensePayload = {
      receipt_id: expense.receipt_id,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      currency: "$",
      quantity: quantity,
      unit_amount: unitAmount,
      total_amount: Math.round(totalAmount * 100) / 100,
    };

    try {
      await axios.post(ADD_EXPENSE_URL, newExpensePayload);
      fetchExpenses();
    } catch (error) {
      console.error("error adding ", error);
    }
  }

  async function processReceipt(file) {
    // --- Step 1: Call Vision API to get raw text ---
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const rawText = await new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result.split(",")[1];
          const visionApiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
          const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;
          const body = {
            requests: [
              {
                image: { content: base64Image },
                features: [{ type: "TEXT_DETECTION" }],
              },
            ],
          };

          const res = await fetch(visionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          const annotations = data.responses[0].textAnnotations;

          if (annotations && annotations.length > 0) {
            resolve(annotations[0].description);
          } else {
            reject("No text detected");
          }
        } catch (err) {
          reject(err);
        }
      };
    });
    console.log(rawText, "response");
    await summarizeReceipt(rawText);
  }

  async function summarizeReceipt(rawText) {
    if (!rawText) {
      return "There's no text to summarize";
    }

    const categoryList = categories.join(", ");
    const prompt = `
      Extract all purchased items from the following receipt text and summarize them in a single JSON object.
      The object must have two keys:
      1. "items": an array of purchased items. Each item object in the array should include:
         - "category": Must be one of the following: [${categoryList}] or "Other" if no other category fits.
         - "description": The name of the item.
         - "quantity": The numeric quantity, default to 1 if not specified.
         - "amount": The numeric unit price for a single item.
      2. "total_amount": The final numeric total amount from the receipt.

      Return only the raw JSON object and nothing else.

      Receipt text:
      "${rawText}"
    `;

    // --- Step 3: Call Gemini API ---
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiBody = { contents: [{ parts: [{ text: prompt }] }] };
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) throw new Error("Failed to call Gemini API");

    const geminiData = await geminiRes.json();
    console.log(geminiData, "logged");

    // --- Step 4: Clean and Parse Gemini's Response ---
    const rawJsonResponse = geminiData.candidates[0].content.parts[0].text;
    const cleanedJson = rawJsonResponse.replace(/```json\n?|```/g, "").trim();
    const structuredReceipt = JSON.parse(cleanedJson);

    // --- Step 5: Update the global 'receipts' state ---
    // This will make the data available to the Summary page
    console.log("Structured data from Gemini:", structuredReceipt);
    setReceipts([structuredReceipt]); // We wrap it in an array for consistency
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        budget,
        categories,
        setBudget,
        loading,
        processReceipt,
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
