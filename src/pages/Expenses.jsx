import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { expenses as initialExpenses } from "../data";
import AddCategoryDropdown from "../components/AddCategoryDropdown";
import AddExpenseModal from "../components/AddExpenseModal";
// import ExpensesTable from "../components/ExpensesTable";

function Expenses() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [budget, setBudget] = useState(120000);

  const categories = [...new Set(expenses.map((e) => e.category))];

  const handleAddCategory = (newCategory) => {
    if (categories.includes(newCategory)) return;

    const fakeExpense = {
      date: "—",
      category: newCategory,
      categoryColor: "bg-(--grey) text-(--black)",
      description: "—",
      amount: "—",
    };

    setExpenses((prev) => [...prev, fakeExpense]);
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
              disabled
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
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

            <div className="mr-auto">
              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded cursor-pointer"
              >
                Add expense
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
            <div className="bg-(--white) rounded-xl border border-(--grey-900)/80 overflow-hidden pl-6">
              {/* Scrollable container */}
              <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-(--white) z-10">
                    <tr className="text-(--grey-600) tracking-tight font-extrabold text-sm">
                      <th className="py-3 pr-6">DATE</th>
                      <th className="py-3 pr-6">CATEGORY</th>
                      <th className="py-3 pr-6">DESCRIPTION</th>
                      <th className="py-3 pr-6">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-(--grey) tracking-tight">
                    {expenses
                      .filter((expense) =>
                        selectedCategory
                          ? expense.category === selectedCategory
                          : true
                      )
                      .map((expense, index) => (
                        <tr
                          key={index}
                          className="border-t border-(--accent) hover:bg-(--light-blue)/50 rounded-lg duration-300 delay-100 cursor-pointer"
                        >
                          <td className="py-3 pr-6">{expense.date}</td>
                          <td className="py-3 pr-6">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-(--light-blue) text-(--blue) border border-(--blue)">
                              {expense.category}
                            </span>
                          </td>
                          <td className="py-3 pr-6">{expense.description}</td>
                          <td className="py-3 pr-6 font-semibold">
                            ₦{expense.amount}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showExpenseModal && (
            <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
          )}
        </header>
      </div>
    </div>
  );
}

export default Expenses;
