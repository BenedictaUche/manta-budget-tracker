import React from "react";

export default function Input({
  className = "",
  children,
  required,
  ...props
}) {
  const baseClass =
    "border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200";

  const isRequired = required ?? Boolean(children);

  return (
    <input
      className={`${baseClass} ${className}`}
      required={isRequired}
      {...props}
    />
  );
}
