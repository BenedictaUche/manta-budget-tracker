import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

function ExpensesTable({ filteredCategory = null }) {
  const { expenses, loading } = useContext(ExpenseContext);

  const rows = filteredCategory
    ? expenses.filter((e) => e.category === filteredCategory)
    : expenses;

console.log(expenses, 'expenses');
  if (loading) {
    return (
      <div className="bg-(--white) rounded-xl border border-(--grey-900)/80 p-6">
        <p className="text-(--grey-600) italic animate-pulse">
          Loading expenses...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-(--white) rounded-xl border border-(--grey-900)/80 overflow-hidden pl-6">
      {rows.length === 0 ? (
        <p className="p-6 text-(--grey-600) italic">
          No expenses added yet. Go to the expenses page to add one!
        </p>
      ) : (
        <div className="max-h-[800px] overflow-y-auto overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="sticky top-0 bg-(--white) z-10">
              <tr className="text-(--grey-600) tracking-tight font-extrabold text-sm">
                <th className="py-3 pr-6">DATE</th>
                <th className="py-3 pr-6">CATEGORY</th>
                <th className="py-3 pr-6">DESCRIPTION</th>
                <th className="py-3 pr-6">QUANTITY</th>
                <th className="py-3 pr-6">TOTAL AMOUNT</th>
              </tr>
            </thead>
            <tbody className="text-sm text-(--grey) tracking-tight">
              {rows.map((expense, index) => (
                <tr
                  key={expense.id ?? index}
                  className="border-t border-(--accent) hover:bg-(--light-blue)/50 rounded-lg duration-300 delay-100 cursor-pointer"
                >
                  <td className="py-3 pr-6">{expense.date}</td>
                  <td className="py-3 pr-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-(--light-blue) text-(--blue) border border-(--blue)">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 pr-6">{expense.description}</td>
                  <td className="py-3 pr-6">{expense.quantity}</td>
                  <td className="py-3 pr-6 font-semibold">${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpensesTable;
