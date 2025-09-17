import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";

export default function AddReceiptModal({ onClose }) {
  const [fileName, setFileName] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const { categories, setReceipts } = useContext(ExpenseContext);
  const [loading, setIsLoading] = useState(false);

  const backdropRef = useRef();
  const navigate = useNavigate();

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  async function analyzeReceiptWithVision(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    const rawText = await new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const result = reader.result.split(",")[1];

          const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
          const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

          const body = {
            requests: [
              {
                image: { content: result },
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
          console.log(annotations[0].description, "new format");

          if (annotations && annotations.length > 0) {
            resolve(annotations[0].description);
          }

          // console.log(data, "response");
        } catch (err) {
          reject(err);
        }
      };
    });

    await summarizeReceipt(rawText);
  }

  async function summarizeReceipt(rawText) {
    const categoryList = categories.join(",");

    const prompt = `Extract all purchased items from the following receipt text and summarize them in a single JSON object.
    The object must have two keys:
    1. "items": an array of purchased items. Each item object in the array should include:
    - "category": Must be one of the following: [${categoryList}] or "Other" if no other category fits.
    - "description": The name of the item. "quantity": The numeric quantity, default to 1 if not specified. "amount": The numeric unit price for a single item. "total_amount": The final numeric total amount from the receipt. Return only the raw JSON object and nothing else. Receipt text: "${rawText}"`;

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    const geminiData = await geminiRes.json();

    const JsonResponse = geminiData.candidates[0].content.parts[0].text;

    const cleanResponse = JsonResponse.replace(/```json\n?|```/g, "").trim();

    const response = JSON.parse(cleanResponse);

    setReceipts([response]);
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileName) return;
    // const receiptObj = {
    //   id: Date.now(),
    //   fileName,
    //   date: new Date().toISOString().slice(0, 10),
    // };
    // addReceipt(receiptObj);
    setIsLoading(true);
    try {
      await analyzeReceiptWithVision(receiptFile);
      navigate("/summary");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
              className="w-full flex items-center justify-center gap-2 bg-(--blue) text-(--white) font-medium py-3 rounded-lg hover:bg-(--blue)/85 transition cursor-pointer"
            >
              {loading ? "LOADING... " : "Upload Receipt"}
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
