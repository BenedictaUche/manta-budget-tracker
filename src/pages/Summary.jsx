import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ExpenseContext } from "../context/ExpenseContext";
import { v4 as uuidv4 } from "uuid";

export default function Summary() {
  const { receipts, clearReceipts, categories, createExpense } =
    useContext(ExpenseContext);
  const [rows, setRows] = useState([]);

  const [summaryDate, setSummaryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (receipts && receipts.length > 0 && receipts[0].items) {
      const geminiItems = receipts[0].items;
      setRows(
        geminiItems.map((item) => ({
          id: Date.now() + Math.random(),
          category:
            item.category || (categories.length ? categories[0] : "Other"),
          quantity: item.quantity || 1,
          amount: item.amount || 0,
          description: item.description || "",
        }))
      );
    } else {
      setRows([
        {
          id: Date.now(),
          category: categories.length ? categories[0] : "",
          quantity: 1,
          amount: 0,
          description: "",
        },
      ]);
    }
  }, [receipts, categories]);

  const updateRow = (idx, key, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [key]: key === "amount" || key === "quantity" ? Number(value) : value,
      };
      return next;
    });
  };

  const addNewEmptyRow = () => {
    setRows((p) => [
      ...p,
      {
        id: Date.now(),
        category: categories.length ? categories[0] : "",
        quantity: 1,
        amount: 0,
        description: "",
      },
    ]);
  };

  // UPDATED: Build from rows and use unified createExpense
  const handleSaveAll = async () => {
    try {
      const expenseList = rows.map((row) => ({
        category: row.category,
        description: row.description,
        quantity: row.quantity,
        amount: row.amount, // Maps to unit_amount in payload
        date: summaryDate,
        receipt_id: `receipt-${uuidv4()}`, // Shared or per-item; adjust as needed
      }));

      await createExpense(expenseList);
      clearReceipts();
      navigate("/expenses");
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-(--accent) text-(--white)">
      <Sidebar />
      <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-10 w-full">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-(--black) text-3xl lg:text-4xl font-semibold tracking-tighter mb-2 sm:mb-3 mt-9">
            Summary
          </h1>
          <p className="uppercase text-sm sm:text-base tracking-tight font-extrabold text-(--grey) mb-4 sm:mb-2">
            Review uploaded receipts and save them to expenses
          </p>

          <div className="bg-(--white) rounded-xl border border-(--grey-900)/80 overflow-hidden p-4">
            <div className="mb-4">
              <label className="block text-(--grey-600) font-extrabold text-sm mb-2">
                EXPENSE DATE
              </label>
              <input
                type="date"
                value={summaryDate}
                onChange={(e) => setSummaryDate(e.target.value)}
                className="border bg-(--white) border-(--grey-600) text-(--black) py-2 px-2 rounded"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="text-(--grey-600) tracking-tight font-extrabold text-sm">
                  <tr>
                    <th className="py-3 pr-6">DESCRIPTION</th>
                    <th className="py-3 pr-6">CATEGORY</th>
                    <th className="py-3 pr-6">QUANTITY</th>
                    <th className="py-3 pr-6">UNIT AMOUNT</th>
                    <th className="py-3 pr-6">TOTAL AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-(--grey) tracking-tight">
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="border-t border-(--accent)">
                      <td className="py-3 pr-6">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) =>
                            updateRow(idx, "description", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600)  text-(--black) py-2 px-2 rounded w-full"
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <select
                          value={row.category}
                          onChange={(e) =>
                            updateRow(idx, "category", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600) text-(--black) py-2 px-2 rounded"
                        >
                          {categories.length ? (
                            categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Create a category first
                            </option>
                          )}
                        </select>
                      </td>
                      <td className="py-3 pr-6">
                        <input
                          type="number"
                          value={row.quantity}
                          min="0"
                          onChange={(e) =>
                            updateRow(idx, "quantity", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600)  text-(--black) py-2 px-2 rounded w-24"
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <input
                          type="number"
                          value={row.amount}
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            updateRow(idx, "amount", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600) text-(--black) py-2 px-2 rounded w-32"
                        />
                      </td>
                      <td className="py-3 pr-6 font-semibold text-(--black)">
                        $
                        {(row.quantity * row.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={addNewEmptyRow}
                className="flex items-center gap-2 bg-(--white) text-(--grey) border border-(--grey-900) py-2 px-4 rounded"
              >
                Add row
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 bg-(--blue) text-(--white) py-2 px-4 rounded hover:bg-(--blue)/85"
              >
                Save
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
