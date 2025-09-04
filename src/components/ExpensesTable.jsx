import { expenses } from "../data";

function ExpensesTable() {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-2xl tracking-tighter font-semibold text-(--grey)">
          Recent Expenses
        </h2>
        <p className="flex items-center gap-1 text-(--grey) font-semibold cursor-pointer hover:text-(--blue) duration-300 text-base">
          <span className="font-extrabold tracking-tight uppercase">
            Export
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
              clipRule="evenodd"
            />
          </svg>
        </p>
      </div>

      {/* Table */}
      <div className="bg-(--white) p-4 rounded-xl border-(--grey-900)/80 border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-(--grey-600) tracking-tight font-extrabold text-sm">
              <th className="pb-3">DATE</th>
              <th className="pb-3">CATEGORY</th>
              <th className="pb-3">DESCRIPTION</th>
              <th className="pb-3">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="text-sm text-(--grey) tracking-tight">
            {expenses.map((expense, index) => (
              <tr
                key={index}
                className="border-t border-(--accent) hover:bg-(--light-blue)/50 rounded-lg duration-300 delay-100 cursor-pointer"
              >
                <td className="py-3">{expense.date}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${expense.categoryColor}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="py-3">{expense.description}</td>
                <td className="py-3 font-semibold">{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpensesTable;
