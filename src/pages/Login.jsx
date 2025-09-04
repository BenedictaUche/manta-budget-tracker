import Input from "../components/Input";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Logo from "../components/Logo";

function Login() {
  return (
    <div className="flex flex-col md:flex-row h-full bg-(--accent)">
      <div className="w-full md:w-1/2  flex flex-col px-10 py-5">
        <Logo />
        <p className="uppercase text-sm tracking-tight font-extrabold text-(--grey) mb-2">
          Sign in to your account
        </p>
        <h1 className="text-5xl text-(--black) font-semibold mb-15 tracking-tighter">
          Start tracking expenses, set budgets, and gain insights
        </h1>

        <AuthForm buttonText="Sign In" btnUrl="/dashboard">
          <Input type="text" placeholder="Enter Username" />
          <Input type="password" placeholder="Enter Password" />
        </AuthForm>
        <p className="uppercase text-sm tracking-tight font-extrabold text-(--grey-600) mb-2 no-underline">
          Don't have an account?{" "}
          <Link to="/" className="text-primary no-underline text-(--blue)">
            <span>Create an account</span>
          </Link>
        </p>
      </div>

      <div className=" hidden sm:block w-full md:w-1/2  ">
        <img
          src="assets/auth-img.svg"
          className="w-screen h-screen object-cover"
          alt="auth img"
        />
      </div>
    </div>
  );
}

export default Login;
