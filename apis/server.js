// server.js

// ==============================================================================
// Expense Tracker Backend API
//
// This Node.js/Express application serves as the backend for a simple
// expense tracker. It provides three main functionalities:
// 1. Manually adding a new expense.
// 2. Processing a set of receipt items to extract and categorize expense data
//    using mocked Gemini API calls.
// 3. Managing expense categories.
//
// All data is stored in memory for this demonstration and will be reset upon
// server restart. This is ideal for a quick demo.
// ==============================================================================

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================================================
// Middleware
// ==============================================================================

// Use express.json() to parse incoming JSON payloads
app.use(express.json());

// ==============================================================================
// In-memory 'database' for demonstration purposes.
// In a production environment, you would use a real database like PostgreSQL,
// MongoDB, or Firestore.
// ==============================================================================
let expenses = [];
let categories = [
  "Groceries",
  "Transportation",
  "Shopping",
  "Utilities",
  "Other",
];
let expenseIdCounter = 1;

// ==============================================================================
// Helper function for mocking Gemini API calls
// ==============================================================================

/**
 * Mocks a call to the Gemini API to parse and categorize each item.
 * The prompt for Gemini would instruct it to analyze the 'description'
 * and assign a category. It can also infer a category if the description
 * is not a common item.
 * @param {Array<Object>} receiptItems - A structured list of items from a hypothetical Vision API call.
 * @returns {Array<Object>} A list of dictionaries with added 'category' and calculated 'price' for each item.
 */
function mockGeminiApiParse(receiptItems) {
  console.log("MOCK: Calling Gemini API to parse and categorize each item...");

  // In a real application, you would send each item's description to Gemini
  // to get a category. The prompt would be something like:
  // "Categorize the expense item: 'Milk'. Choose from 'Groceries', 'Utilities',
  // 'Food & Drink', 'Transportation', or 'Shopping'. If none fit, infer a
  // new category."

  const categorizedItems = receiptItems.map((item) => {
    // Simulate Gemini's categorization and inference logic
    let category = "Other"; // Default to 'Other'
    const description = item.description.toLowerCase();

    if (
      description.includes("milk") ||
      description.includes("bread") ||
      description.includes("cereal")
    ) {
      category = "Groceries";
    } else if (description.includes("taxi") || description.includes("bus")) {
      category = "Transportation";
    } else if (
      description.includes("tv") ||
      description.includes("shirt") ||
      description.includes("book")
    ) {
      category = "Shopping";
    }

    // Check if the inferred category is in our existing categories, if not, add it
    if (!categories.includes(category)) {
      categories.push(category);
    }

    // Calculate the total price for the item
    const price = item.quantity * item.unit_price;

    return {
      date: item.date,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      price: price, // Total price for the item
      category: category,
    };
  });

  return categorizedItems;
}

// ==============================================================================
// API Endpoints
// ==============================================================================

/**
 * Endpoint to manually add a new expense.
 * Expects a JSON payload with expense details such as:
 * {
 * "date": "YYYY-MM-DD",
 * "category": "string",
 * "description": "string",
 * "amount": "number",
 * "quantity": "number"
 * }
 */
app.post("/api/add-expense", (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: "No JSON data received." });
    }

    // Create a new expense entry
    const newExpense = {
      id: expenseIdCounter++,
      date: data.date,
      category: data.category,
      description: data.description,
      amount: data.amount,
      quantity: data.quantity,
    };

    // Validate that required fields are present
    if (
      !newExpense.date ||
      !newExpense.category ||
      !newExpense.description ||
      newExpense.amount === undefined ||
      newExpense.quantity === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Save the expense to our in-memory list
    expenses.push(newExpense);

    console.log(`Added new expense:`, newExpense);
    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (e) {
    console.error(`An error occurred:`, e);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

/**
 * Endpoint to get all expenses.
 * This will return the entire list of expenses stored in memory.
 */
app.get("/api/expenses", (req, res) => {
  try {
    console.log("Fetching all expenses.");
    return res.status(200).json({ expenses: expenses });
  } catch (e) {
    console.error(`An error occurred:`, e);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

/**
 * Endpoint to process structured receipt data sent from the frontend.
 * This endpoint simulates the full pipeline without needing to upload a file.
 * It expects a JSON payload that represents the data extracted by a
 * hypothetical Google Vision API call.
 *
 * Expected JSON payload format:
 * {
 * "receipt_items": [
 * {"date": "YYYY-MM-DD", "description": "string", "quantity": number, "unit_price": number},
 * ...
 * ]
 * }
 */
app.post("/api/process-receipt", (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.receipt_items) {
      return res
        .status(400)
        .json({ error: "No 'receipt_items' in JSON data received." });
    }

    const rawItems = data.receipt_items;
    console.log(`Received ${rawItems.length} items to process.`);

    // 1. Mock Gemini API call to categorize and parse each item
    const parsedItems = mockGeminiApiParse(rawItems);

    // 2. Add each parsed item to our in-memory list as a separate expense
    const addedExpenses = parsedItems.map((item) => {
      const newExpense = {
        id: expenseIdCounter++,
        date: item.date,
        category: item.category,
        description: item.description,
        amount: item.price,
        quantity: item.quantity,
      };
      expenses.push(newExpense);
      return newExpense;
    });

    console.log(
      `Processed receipt and added ${addedExpenses.length} new expenses.`
    );
    return res.status(201).json({
      message: "Receipt processed and expenses added successfully",
      expenses: addedExpenses,
    });
  } catch (e) {
    console.error(`An error occurred during receipt processing:`, e);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

// ------------------------------------------------------------------------------
// NEW CATEGORY ENDPOINTS
// ------------------------------------------------------------------------------

/**
 * Endpoint to create a new category.
 * Expects a JSON payload with a 'category' key.
 * * Expected JSON payload format:
 * {
 * "category": "New Category Name"
 * }
 */
app.post("/api/categories", (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const newCategory = category.trim();

    if (categories.includes(newCategory)) {
      return res.status(409).json({ error: "Category already exists." });
    }

    categories.push(newCategory);
    console.log(`Added new category: ${newCategory}`);

    return res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (e) {
    console.error(`An error occurred:`, e);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

/**
 * Endpoint to get all existing categories.
 */
app.get("/api/categories", (req, res) => {
  try {
    console.log("Fetching all categories.");
    return res.status(200).json({ categories: categories });
  } catch (e) {
    console.error(`An error occurred:`, e);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});

// ==============================================================================
// Start the server
// ==============================================================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Starting backend for expense tracker...");
});
