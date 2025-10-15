import React, { createContext, useEffect, useState, useCallback } from "react";
import MantaClient from "mantahq-sdk";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line react-refresh/only-export-components
export const ExpenseContext = createContext();




const manta = new MantaClient({
  sdkKey: import.meta.env.VITE_MANTA_SDK_KEY,
})

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(["FOOD", "RENT", "UTILITIES"]);
  const [budget, setBudget] = useState(50000);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await manta.fetchAllRecords ({
        table: 'expenses',
        fields: [
          'id',
          'date',
          'category',
          'currency',
          'unit_amount',
          'total_amount',
          'description',
          'quantity',
        ]
      });

      if(response?.data && Array.isArray(response.data)) {
        const formattedExpenses = response.data.map((e) => ({
          id: e.id,
          date: e.date,
          category: e.category,
          currency: e.currency,
          unit_amount: e.unit_amount,
          total_amount: e.total_amount,
          description: e.description,
          quantity: e.quantity,
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.log("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  });


  useEffect (() => {
    fetchExpenses();
  }, []);

  async function createExpense(expenseInput) {
    const isArray = Array.isArray(expenseInput);
    const expensesToCreate = isArray ? expenseInput : [expenseInput];
    const today = new Date().toISOString().slice(0, 10);


    const payload = expensesToCreate.map((expense) => {
      const quantity = Number(expense.quantity) || 1;
      const unitAmount = Number(expense.unit_amount || expense.amount) || 0;
      const totalAmount = quantity * unitAmount;
      return {
        receipt_id: expense.receipt_id || `receipt-${uuidv4()}`,
        date: expense.date || today,
        category: expense.category || "",
        description: expense.description || "",
        currency: "$",
        quantity: expense.quantity || 1,
        unit_amount: unitAmount,
        total_amount: Math.round(totalAmount * 100) / 100,
      }
    }

    );
    try {
      const response = await manta.createRecords({
        table: 'expenses',
        data: payload,
        options: {
          continueOnError: true,
        }
      });
      console.log("Create expense response:", response);
      fetchExpenses();

      if (isArray && receipts.length && receipts[0]?.items) {
        clearReceipts();
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  }

  async function processReceipt(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const rawText = await new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result.split(",")[1];
          const visionApiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
          console.log(data, "vision response");
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

    console.log(rawText, "raw text from receipt");
    await summarizeReceipt(rawText);
  }

  async function summarizeReceipt(rawText) {
    if (!rawText) {
      return "No text detected";
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

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiBody = { contents: [{ parts: [{ text: prompt }] }] };
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) throw new Error("Failed to call Gemini API");

    const geminiData = await geminiRes.json();
    console.log(geminiData, "logged");

    const rawJsonResponse = geminiData.candidates[0].content.parts[0].text;
    const cleanedJson = rawJsonResponse.replace(/```json\n?|```/g, "").trim();
    const structuredReceipt = JSON.parse(cleanedJson);

    console.log(structuredReceipt, "structured receipt");
    setReceipts([structuredReceipt]);

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
        addCategory,
        createExpense,
        receipts,
        processReceipt,
        addReceipt,
        clearReceipts,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
