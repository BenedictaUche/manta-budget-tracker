import { expenses } from "../data";

function ExpensesTable() {
  return (
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
            {expenses.map((expense, index) => (
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
                <td className="py-3 pr-6 font-semibold">₦{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpensesTable;
