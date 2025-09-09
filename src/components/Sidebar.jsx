import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Avatar, { genConfig } from "react-nice-avatar";
import Logo from "../components/Logo";

function Sidebar({ user = "David Johnson" }) {
  const [open, setOpen] = useState(false);
  const myConfig = genConfig(user);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-(--white) lg:hidden fixed top-4 left-4 z-50 bg-(--blue) rounded-md shadow cursor-pointer"
      >
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 h-full w-64 bg-(--blue) text-(--white) border-r z-50 transform transition-transform duration-300
    ${
      open ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 lg:sticky lg:top-0 lg:flex overflow-y-auto`}
      >
        <div className="flex flex-col justify-between h-screen px-5 py-5 ">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link to="/dashboard">
                <Logo src="assets/logo-light.png" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden text-(--white)"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col space-y-3 tracking-tight text-xl">
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-[18px] text-(--blue) font-medium bg-(--white) rounded py-2 px-3 pr-6"
                    : "flex items-center gap-3 text-[18px] text-(--white) font-medium rounded hover:bg-(--white)/10 py-2 px-3 pr-6 hover:duration-500"
                }
              >
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
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Dashboard
              </NavLink>

              <NavLink
                to="/expenses"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-[18px] text-(--blue) font-medium bg-(--white) rounded py-2 px-3 pr-6"
                    : "flex items-center gap-3 text-[18px] text-(--white) font-medium rounded hover:bg-(--white)/10 py-2 px-3 pr-6 hover:duration-500"
                }
              >
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
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
                Expenses
              </NavLink>
              <NavLink
                to="/summary"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-[18px] text-(--blue) font-medium bg-(--white) rounded py-2 px-3 pr-6"
                    : "flex items-center gap-3 text-[18px] text-(--white) font-medium rounded hover:bg-(--white)/10 py-2 px-3 pr-6 hover:duration-500"
                }
              >
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
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                  />
                </svg>
                Summary
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="w-10 h-10" {...myConfig} />
            <p className="font-bold tracking-tight text-[18px] uppercase">
              {user}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
