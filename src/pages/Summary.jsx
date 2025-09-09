// src/pages/Summary.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ExpenseContext } from "../context/ExpenseContext";

export default function Summary() {
  const { receipts, clearReceipts, addExpense, expenses } =
    useContext(ExpenseContext);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  // derive categories from current expenses (dynamic)
  const categories = [...new Set(expenses.map((e) => e.category))];

  useEffect(() => {
    if (receipts && receipts.length > 0) {
      setRows(
        receipts.map((r) => ({
          id: r.id || Date.now(),
          date: r.date || new Date().toISOString().slice(0, 10),
          category: r.category || (categories.length ? categories[0] : ""),
          quantity: r.quantity,
          amount: r.amount,
          description: r.description || r.fileName || "",
        }))
      );
    } else {
      setRows([
        {
          id: Date.now(),
          date: new Date().toISOString().slice(0, 10),
          category: categories.length ? categories[0] : "",
          quantity: 1,
          amount: 0,
          description: "",
        },
      ]);
    }
    // 👇 remove categories from deps so it doesn't reset when categories change
  }, [receipts]);

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
        date: new Date().toISOString().slice(0, 10),
        category: categories.length ? categories[0] : "",
        quantity: 1,
        amount: 0,
        description: "",
      },
    ]);
  };

  const handleSaveAll = () => {
    rows.forEach((r) => {
      // send unit amount and quantity; your context can decide how to store/multiply
      addExpense({
        date: r.date,
        category: r.category || "UNCATEGORIZED",
        description: r.description,
        amount: Number(r.amount) || 0,
        quantity: Number(r.quantity) || 1,
      });
    });
    clearReceipts();
    navigate("/expenses");
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="text-(--grey-600) tracking-tight font-extrabold text-sm">
                  <tr>
                    <th className="py-3 pr-6">DATE</th>
                    <th className="py-3 pr-6">CATEGORY</th>
                    <th className="py-3 pr-6">QUANTITY</th>
                    <th className="py-3 pr-6">UNIT AMOUNT</th>
                    <th className="py-3 pr-6">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-(--grey) tracking-tight">
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="border-t border-(--accent)">
                      <td className="py-3 pr-6">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) =>
                            updateRow(idx, "date", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600) text-(--black) py-2 px-2 rounded"
                        />
                      </td>
                      <td className="py-3 pr-6">
                        <select
                          value={row.category}
                          onChange={(e) =>
                            updateRow(idx, "category", e.target.value)
                          }
                          className="px-3 py-1 rounded-full text-xs font-medium bg-(--light-blue) text-(--blue) border border-(--blue)"
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
                          onChange={(e) =>
                            updateRow(idx, "amount", e.target.value)
                          }
                          className="border bg-(--white) border-(--grey-600) text-(--black) py-2 px-2 rounded w-32"
                        />
                      </td>
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
