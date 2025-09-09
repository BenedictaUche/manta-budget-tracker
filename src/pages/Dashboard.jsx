import { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ExpensesTable from "../components/ExpensesTable";
import { ExpenseContext } from "../context/ExpenseContext";

function Dashboard() {
  const user = "David Johnson";
  const { expenses, budget } = useContext(ExpenseContext);

  const totalExpenses = expenses.reduce(
    (acc, exp) => acc + (Number(exp.amount) || 0),
    0
  );
  const remainingBalance = budget - totalExpenses;

  return (
    <>
      <div className="flex min-h-screen bg-(--accent) text-(--white)">
        {/* Sidebar */}
        <Sidebar user={user} />
        {/* Main dashboard */}
        <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-10 w-full">
          <header className="mb-8 sm:mb-10">
            <h1 className="text-(--black) text-3xl lg:text-4xl font-semibold tracking-tighter mb-2 sm:mb-3 mt-9">
              Hello {user.split(" ")[0]},
            </h1>
            <p className="uppercase text-sm sm:text-base tracking-tight font-extrabold text-(--grey) mb-4 sm:mb-2">
              Here's a quick look at your budget and expenses
            </p>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 max-w-full lg:max-w-4xl cursor-pointer my-6">
              {/* Overall Budget */}
              <div className="flex flex-col py-5 pl-4 pr-8 sm:pr-16 bg-gradient-to-r from-(--green) to-(--light-green-gradient) rounded-lg">
                <div className="flex items-center gap-1.5 text-(--light-green) mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
                  </svg>
                  <span className="uppercase tracking-tight font-extrabold text-xs sm:text-sm">
                    Overall Budget
                  </span>
                </div>
                <div className="font-bold text-2xl sm:text-3xl text-(--white)">
                  ₦{budget.toLocaleString()}
                  <span className="text-xs sm:text-sm text-(--light-green)">
                    .00
                  </span>
                </div>
              </div>

              {/* Total Expenses */}
              <div className="flex flex-col py-5 pl-4 pr-8 sm:pr-16 bg-gradient-to-r from-(--yellow) to-(--light-yellow-gradient) rounded-lg">
                <div className="flex items-center gap-1.5 text-(--light-yellow) mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="uppercase tracking-tight font-extrabold text-xs sm:text-sm">
                    Total Expenses
                  </span>
                </div>
                <div className="font-bold text-2xl sm:text-3xl text-(--white)">
                  ₦{totalExpenses.toLocaleString()}
                  <span className="text-xs sm:text-sm text-(--light-yellow)">
                    .00
                  </span>
                </div>
              </div>

              {/* Remaining Balance */}
              <div className="flex flex-col py-5 pl-4 pr-8 sm:pr-16 bg-gradient-to-r from-(--blue) to-(--light-blue-gradient) rounded-lg">
                <div className="flex items-center gap-1.5 text-(--light-blue) mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 sm:size-6"
                  >
                    <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                      clipRule="evenodd"
                    />
                    <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                  </svg>
                  <span className="uppercase tracking-tight font-extrabold text-xs sm:text-sm">
                    Remaining Balance
                  </span>
                </div>
                <div className="font-bold text-2xl sm:text-3xl text-(--white)">
                  ₦{remainingBalance.toLocaleString()}
                  <span className="text-xs sm:text-sm text-(--light-blue)">
                    .00
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Table */}
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
          <ExpensesTable />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
