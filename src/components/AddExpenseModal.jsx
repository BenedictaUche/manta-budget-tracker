import { useRef } from "react";
import Input from "./Input";

export default function AddExpenseModal({ onClose }) {
  const backdropRef = useRef();

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
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

        <h2 className="text-(--black) text-lg font-extrabold mb-4 uppercase tracking-tight">
          Add Expense
        </h2>

        <form className="space-y-4 tracking-tight">
          <input
            className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            type="text"
            placeholder="Enter expense description"
          />

          <div className="flex gap-3">
            <Input type="number" placeholder="Amount" />
            <Input type="date" placeholder="yyyy/mm/dd" />
          </div>

          <select className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200">
            <option>Select category</option>
            <option>Transport</option>
            <option>Groceries</option>
            <option>Entertainment</option>
            <option>Bills</option>
          </select>

          <h2 className="text-(--black) text-lg font-extrabold mb-4 uppercase tracking-tight">
            Or upload a receipt
          </h2>

          {/* Upload Receipt */}
          <div className="flex flex-col items-center gap-2 border border-dashed border-(--grey-900) rounded-lg p-6 text-center cursor-pointer hover:border-(--blue)/50 hover:border duration-200 text-(--grey-900)">
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>

            <p>Upload a receipt here</p>
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
