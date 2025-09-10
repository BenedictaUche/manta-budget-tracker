// To get API Key: https://console.cloud.google.com/apis/credentials?pli=1&project=ace-axon-461817-i2
// api key tutorial: https://cloud.google.com/docs/authentication/api-keys?hl=en&visit_id=638917292613095136-297626302&rd=1#console
// Enable Vision API

import React, { useState } from "react";

function ReceiptScanner() {
  const [file, setFile] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [fullText, setFullText] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];
      const apiKey = "AIzaSyDVbfUsC6Yu7WSE1Gy1ljRIlpyY_hqqgYs"; // Replace with your Vision API key
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const body = {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }], // OCR mode
          },
        ],
      };

      function extractTotalAmount(receiptText) {
        // Match currency-like patterns: $39.43 or 39.43
        const matches = receiptText.match(/\$?\d+(\.\d{2})/g);

        if (!matches) return null;

        // Return the LAST match (most likely the total)
        const lastAmount = matches[matches.length - 1];

        // Remove $ if present and return as number
        return parseFloat(lastAmount.replace("$", ""));
      }

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        console.log("Vision API OCR Result:", data);

        const annotations = data.responses[0].textAnnotations;
        if (annotations && annotations.length > 0) {
          const fullReceiptText = annotations[0].description;
          setFullText(fullReceiptText);

          const total = extractTotalAmount(fullReceiptText);
          setNumbers([total]); // show only the total
        } else {
          setFullText("No text detected.");
          setNumbers([]);
        }
      } catch (err) {
        console.error("Error calling Vision API:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Receipt Scanner (Google Vision OCR)
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        Analyze Receipt
      </button>

      {fullText && (
        <div className="mt-6">
          <h3 className="font-semibold">Full OCR Text:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2 whitespace-pre-wrap">
            {fullText}
          </pre>
        </div>
      )}

      {numbers.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Extracted Numbers:</h3>
          <ul className="list-disc pl-6 mt-2">
            {numbers.map((num, id) => (
              <li key={idx}>{num}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReceiptScanner;
