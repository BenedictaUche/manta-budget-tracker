import { useRef, useState, useContext } from "react";
import Input from "./Input";
import { ExpenseContext } from "../context/ExpenseContext";

export default function AddExpenseModal({ onClose }) {
  const { categories, addExpense } = useContext(ExpenseContext);
  const backdropRef = useRef();

  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    unit_amount: "",
    currency: "$",
    // total_amount: "",
  });

  // if (!newExpense.category && categories.length) {
  //   newExpense.category = categories[0];
  // }

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // addExpense({
    //   ...newExpense,
    // });

    onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-(--white) rounded-2xl shadow-lg max-w-[500px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-(--grey) hover:text-(--black) cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 tracking-tight">
          <h2 className="text-(--grey) text-lg font-extrabold mb-4 uppercase tracking-tight">
            Add an expense
          </h2>

          <div className="flex gap-3">
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            >
              {categories.length ? (
                categories.map((c) => <option key={c}>{c}</option>)
              ) : (
                <option value="" disabled>
                  Create a category first
                </option>
              )}
            </select>

            <Input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <input
            className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            type="text"
            placeholder=" Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense((p) => ({ ...p, description: e.target.value }))
            }
          />

          <div className="flex gap-3">
            <Input
              type="number"
              min="0"
              placeholder="Unit Amount (1 item)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              type="date"
              placeholder="yyyy/mm/dd"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense((p) => ({ ...p, date: e.target.value }))
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-(--blue) text-(--white) font-medium py-3 rounded-lg hover:bg-(--blue)/85 transition cursor-pointer disabled:opacity-50"
          >
            Add expense +
          </button>
        </form>
      </div>
    </div>
  );
}
