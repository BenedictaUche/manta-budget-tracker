import { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";

export default function AddReceiptModal({ onClose }) {
  const [fileName, setFileName] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const backdropRef = useRef();
  // const navigate = useNavigate();
  // const { addReceipt } = useContext(ExpenseContext);

  const handleBackdropClick = (e) => {
    if (isUploading) return;
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // const handleUpload = (e) => {
  //   e.preventDefault();
  //   if (!fileName) return;
  //   const receiptObj = {
  //     id: Date.now(),
  //     fileName,
  //     date: new Date().toISOString().slice(0, 10),
  //   };
  //   addReceipt(receiptObj);
  //   onClose();
  //   navigate("/summary");
  // };

  async function analyzeReceiptWithVision(file) {
    // 1. Read the file as a Base64 string for the API
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // Use a Promise to handle the async nature of FileReader
    await new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result.split(",")[1];
          const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
          const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

          const body = {
            requests: [
              {
                image: { content: base64Image },
                features: [{ type: "TEXT_DETECTION" }],
              },
            ],
          };

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const data = await res.json();
          const annotations = data.responses[0].textAnnotations;

          if (annotations && annotations.length > 0) {
            const fullReceiptText = annotations[0].description;

            console.log("--- Extracted Receipt Text (from Google Vision) ---");
            console.log(fullReceiptText);
          } else {
            console.log("No text detected in the image.");
          }
          resolve();
        } catch (err) {
          console.error("Error calling Vision API:", err);
          reject(err);
        }
      };
    });
  }

  const handleUpload = async (e) => {
    // Make the function async
    e.preventDefault();
    if (!receiptFile || isUploading) return;

    setIsUploading(true);
    console.log("Starting receipt analysis...");

    // Call the Vision API and wait for it to finish
    await analyzeReceiptWithVision(receiptFile);

    console.log("Analysis complete. You can see the result above.");

    // For the demo, we are done. We won't add it to the table yet.
    // The lines below can be used later.
    /*
  const receiptObj = {
    id: Date.now(),
    fileName,
    date: new Date().toISOString().slice(0, 10),
  };
  addReceipt(receiptObj);
  navigate("/summary");
  */
    setIsUploading(false);
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
          disabled={isUploading}
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
                if (file) {
                  setFileName(file.name);
                  setReceiptFile(file);
                } else {
                  setFileName("");
                  setReceiptFile(null);
                }
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
              disabled={isUploading || !receiptFile}
              className="w-full flex items-center justify-center gap-2 bg-(--blue) text-(--white) font-medium py-3 rounded-lg hover:bg-(--blue)/85 transition cursor-pointer"
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Upload and Review"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
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
