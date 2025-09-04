function Input({ type, placeholder }) {
  return (
    <>
      <input
        className="border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200"
        type={type}
        placeholder={placeholder}
      />
    </>
  );
}

export default Input;
