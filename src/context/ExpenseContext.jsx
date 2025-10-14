import React, { createContext, useCallback, useEffect, useState } from "react";
import MantaClient from "mantahq-sdk";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line react-refresh/only-export-components
export const ExpenseContext = createContext();

// first pass the imported MantaClient to a manta variable
// create a fetch expense function to get the expenses from Manta - it will return nothing at first but creating the addExpense and running it will add data to the manta table and return something with fetchExpense
// next create a useEffect for fetchExpense so that on mount it will fetch the expenses
// create an addExpenses function to add the receipt items to the expenses state

// Next, we want to create a expense manually, so we will go to the AddExpenseModal component and import the addExpense function from context and call it on form submit

// After successfully adding a manual expense, we will move on to the receipt upload and processing
// We will create a processReceipt function that will handle the file upload, call the Vision API to extract text, then call the Gemini API to summarize and categorize the items
// ----How it works is ----
// 1. The processReceipt function reads the uploaded image file and converts it to a base64 string
// 2. It then sends this base64 string to the Google Vision API to perform OCR and extract the raw text from the receipt image
// 3. Once we have the raw text, we construct a prompt for the Gemini API to extract and categorize the items into a structured JSON format
// 4. We call the Gemini API with this prompt and receive a JSON response containing the categorized items
// 5. Finally, we update the receipts state with this structured data so it can be reviewed and saved as expenses
// 6. The already created addExpenses function takes the items from the receipts state and batch save them to Manta as individual expense records
// 7. After saving, we clear the receipts state to reset for future uploads
// 8. The processReceipt function will be added to the context so it can be called from the AddReceiptModal component when a file is uploaded



const manta = new MantaClient({
  sdkKey: import.meta.env.VITE_MANTA_SDK_KEY,
});

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
      const response = await manta.fetchAllRecords({
        table: "manta-expense-tracker",
        fields: [
          "id",
          "date",
          "category",
          "description",
          "currency",
          "quantity",
          "unit_amount",
          "total_amount",
        ],
      });

      if (response?.data && Array.isArray(response.data)) {
        const formattedExpenses = response.data.map((e) => ({
          id: e.id,
          date: e.date,
          category: e.category?.toUpperCase() || "GENERAL",
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

  // UNIFIED: Handles single expense or array of expenses
  async function createExpense(expenseInput) {
    const isArray = Array.isArray(expenseInput);
    const expensesList = isArray ? expenseInput : [expenseInput];

    const today = new Date().toISOString().split("T")[0];
    const payloads = expensesList.map((expense) => {
      const quantity = Number(expense.quantity) || 1;
      const unitAmount = Number(expense.unit_amount || expense.amount) || 0; // Flexible key support
      const totalAmount = quantity * unitAmount;

      return {
        receipt_id: expense.receipt_id || `receipt-${uuidv4()}`,
        date: expense.date || today,
        category: expense.category,
        description: expense.description || "",
        currency: "$",
        quantity: quantity,
        unit_amount: unitAmount,
        total_amount: Math.round(totalAmount * 100) / 100,
      };
    });

    try {
      const result = await manta.createRecords({
        table: "manta-expense-tracker",
        data: payloads,
        options: {
          continueOnError: true,
        },
      });
      console.log(`${isArray ? "Batch" : "Single"} expense(s) added:`, result);
      fetchExpenses();

      // Clear receipts if batch (from receipts state)
      if (isArray && receipts.length && receipts[0]?.items) {
        clearReceipts();
      }
    } catch (error) {
      console.error("Error creating expense(s):", error);
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
        createExpense, // UNIFIED: Expose for both single and batch
        setReceipts,
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
