import { useRef, useState, useContext } from "react";
import Input from "./Input";
import { ExpenseContext } from "../context/ExpenseContext";

export default function AddExpenseModal({ onClose }) {
  const { addExpense } = useContext(ExpenseContext);
  const backdropRef = useRef();
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "TRANSPORT",
    description: "",
  });

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addExpense({
      ...form,
      quantity: Number(quantity || 1),
      amount: Number(amount || 0),
    });

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
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            >
              <option>TRANSPORT</option>
              <option>GROCERIES</option>
              <option>ENTERTAINMENT</option>
              <option>BILLS</option>
            </select>
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <input
            className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            type="text"
            placeholder=" Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />

          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="date"
              placeholder="yyyy/mm/dd"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-(--blue) text-(--white) font-medium py-3 rounded-lg hover:bg-(--blue)/85 transition cursor-pointer"
          >
            Add expense +
          </button>
        </form>
      </div>
    </div>
  );
}
