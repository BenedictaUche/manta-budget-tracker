import Sidebar from "../components/Sidebar";
import { expenses } from "../data";

function Expenses() {
  return (
    <div className="flex h-screen bg-(--accent) text-(--white)">
      <Sidebar />
      <header className="py-5 px-10 w-full ">
        <h1 className="text-(--black) text-4xl font-semibold tracking-tighter mb-3">
          Expenses
        </h1>
        <p className="uppercase text-base tracking-tight font-extrabold text-(--grey) mb-2">
          view, organize, and add your expenses by category
        </p>
        <div className="flex cursor-pointer space-x-2 mt-8">
          <div className="flex justify-between items-center px-4 py-1 bg-(--black) hover:bg-(--black)/95 duration-200 rounded-full gap-2">
            <p className="text-(--white) text-base font-medium tracking-tighter uppercase">
              add category
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          {expenses.map((expense, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-1 border border-(--grey) rounded-full"
            >
              <p className="text-(--grey) text-base font-medium tracking-tighter uppercase">
                {expense.category}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full bg-(--grey-600)/30 h-0.25 my-5"></div>
        <button className="flex items-center gap-1 px-4 py-2 bg-(--blue) hover:bg-(--blue)/85 duration-200 rounded mt-5 cursor-pointer">
          Add expense
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </header>
    </div>
  );
}

export default Expenses;
