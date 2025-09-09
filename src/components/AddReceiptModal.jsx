import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";

export default function AddReceiptModal({ onClose }) {
  const [fileName, setFileName] = useState("");
  const backdropRef = useRef();
  const navigate = useNavigate();
  const { addReceipt } = useContext(ExpenseContext);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!fileName) return;
    const receiptObj = {
      id: Date.now(),
      fileName,
      date: new Date().toISOString().slice(0, 10),
    };
    addReceipt(receiptObj);
    onClose();
    navigate("/summary");
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

        <form onSubmit={handleUpload} className="space-y-4 tracking-tight">
          <h2 className="text-(--black) text-lg font-extrabold mb-4 uppercase tracking-tight">
            Upload a receipt
          </h2>

          <div className="relative flex flex-col items-center gap-2 border border-dashed border-(--grey-600) rounded-lg p-6 text-center cursor-pointer hover:border-(--blue)/50 hover:border duration-200 text-(--grey-600)">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setFileName(file.name);
                else setFileName("");
              }}
            />

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

            {fileName ? (
              <p className="text-(--blue) font-medium max-w-33 truncate">
                {fileName}
              </p>
            ) : (
              <p>Upload a receipt here</p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-(--blue) text-(--white) font-medium py-3 rounded-lg hover:bg-(--blue)/85 transition cursor-pointer"
            >
              Upload and Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full border bg-(--white) border-(--grey-900) text-(--black) py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
