import { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import AddCategoryDropdown from "../components/AddCategoryDropdown";
import AddExpenseModal from "../components/AddExpenseModal";
import AddReceiptModal from "../components/AddReceiptModal";
import ExpensesTable from "../components/ExpensesTable";
import { ExpenseContext } from "../context/ExpenseContext";

function Expenses() {
  const { addCategory, budget, setBudget, categories } =
    useContext(ExpenseContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleAddCategory = (newCategory) => {
    addCategory(newCategory);
  };

  return (
    <div className="flex min-h-screen bg-(--accent) text-(--white)">
      <Sidebar />

      <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-10 w-full">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-(--black) text-3xl lg:text-4xl font-semibold tracking-tighter mb-2 sm:mb-3 mt-9">
            Expenses
          </h1>
          <p className="uppercase text-sm sm:text-base tracking-tight font-extrabold text-(--grey) mb-4 sm:mb-2">
            View, organize, and add your expenses by category
          </p>

          {/* Budget Input */}
          <div className="my-6">
            <label className="block text-(--black) font-semibold mb-2">
              Set Overall Budget
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value || 0))}
              className="border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
            />
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap items-center gap-2 mt-8 relative">
            {/* Add Category Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded cursor-pointer z-20"
            >
              Add category
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>

            {showDropdown && (
              <AddCategoryDropdown
                onClose={() => setShowDropdown(false)}
                onAddCategory={handleAddCategory}
              />
            )}

            {/* All Categories Tag */}
            <div
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium tracking-tight uppercase cursor-pointer transition-colors
                ${
                  selectedCategory === null
                    ? "bg-(--light-blue) text-(--blue) border border-(--blue)"
                    : "border border-(--grey) text-(--grey)"
                }`}
            >
              All
            </div>

            {/* Category Tags */}
            {categories.map((category, i) => (
              <div
                key={i}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium tracking-tight uppercase cursor-pointer transition-colors
                      ${
                        selectedCategory === category
                          ? "bg-(--light-blue) text-(--blue) border border-(--blue)"
                          : "border border-(--grey) text-(--grey)"
                      }`}
              >
                {category}
              </div>
            ))}

            {/* Divider */}
            <div className="w-full bg-(--grey-600)/30 h-0.25 my-5"></div>

            <div className="mr-auto flex space-x-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded cursor-pointer"
              >
                Upload a receipt
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
              </button>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded cursor-pointer"
              >
                Add expense manually
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Filtered Expenses */}
          <div className="mt-4 w-full">
            <ExpensesTable filteredCategory={selectedCategory} />
          </div>

          {/* Modals */}
          {showUploadModal && (
            <AddReceiptModal onClose={() => setShowUploadModal(false)} />
          )}
          {showExpenseModal && (
            <AddExpenseModal
              onClose={() => {
                setShowExpenseModal(false);
                setSelectedCategory(null);
              }}
            />
          )}
        </header>
      </div>
    </div>
  );
}

export default Expenses;
