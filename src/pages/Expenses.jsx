import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { expenses as initialExpenses } from "../data";
import AddCategoryDropdown from "../components/AddCategoryDropdown";
import AddExpenseModal from "../components/AddExpenseModal";

function Expenses() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

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
    <div className="flex h-screen bg-(--accent) text-(--white)">
      <Sidebar />

      <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-10 w-full">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-(--black) text-3xl lg:text-4xl font-semibold tracking-tighter mb-2 sm:mb-3 mt-9">
            Expenses
          </h1>
          <p className="uppercase text-sm sm:text-base tracking-tight font-extrabold text-(--grey) mb-4 sm:mb-2">
            View, organize, and add your expenses by category
          </p>

          {/* Category tags */}
          <div className="flex flex-wrap items-center gap-2 mt-8 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center px-3 py-1 bg-(--black) hover:bg-(--black)/95 duration-200 rounded-full gap-1.5 cursor-pointer uppercase tracking-tight text-sm"
            >
              Add category
            </button>

            {showDropdown && (
              <AddCategoryDropdown
                onClose={() => setShowDropdown(false)}
                onAddCategory={handleAddCategory}
              />
            )}

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
          </div>

          <div className="w-full bg-(--grey-600)/30 h-0.25 my-5"></div>

          {/* Add Expense */}
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded mt-5 cursor-pointer"
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

          {/* Modal */}
          {showExpenseModal && (
            <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
          )}

          {/* Expenses Table */}
          <div className="mt-8 bg-(--white) p-4 rounded-xl border-(--grey-900)/80 border overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="text-(--grey-600) tracking-tight font-extrabold text-sm">
                  <th className="pb-3 pr-6">DATE</th>
                  <th className="pb-3 pr-6">CATEGORY</th>
                  <th className="pb-3 pr-6">DESCRIPTION</th>
                  <th className="pb-3 pr-6">AMOUNT</th>
                  <th className="pb-3 pr-6"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-(--grey) tracking-tight">
                {expenses
                  .filter(
                    (expense) =>
                      !selectedCategory || expense.category === selectedCategory
                  )
                  .map((expense, i) => (
                    <tr
                      key={i}
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
                        {expense.amount}
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <button className="cursor-pointer text-red-500 hover:text-red-600 text-sm font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </header>
      </div>
    </div>
  );
}

export default Expenses;
