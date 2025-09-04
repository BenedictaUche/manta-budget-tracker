import { Link } from "react-router-dom";

function AuthForm({ buttonText, children, btnUrl }) {
  return (
    <>
      <form className="flex flex-col space-y-3 mb-4 tracking-tight">
        {children}

        <Link
          to={btnUrl}
          className="flex justify-center bg-(--blue) text-white py-3 cursor-pointer hover:bg-(--blue)/90 duration-200 rounded"
        >
          <button className="flex items-center space-x-2">
            <span>{buttonText}</span>
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
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </Link>
      </form>
    </>
  );
}

export default AuthForm;
