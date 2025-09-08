import { useState } from "react";

export default function AddCategoryDropdown({ onClose, onAddCategory }) {
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim()) return;

    onAddCategory(category.trim());
    setCategory("");
    onClose();
  };

  return (
    <div className="absolute z-20 top-10 left-0 mt-2 w-72 rounded-xl shadow-lg bg-(--white) p-4 z-10">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Enter category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border bg-(--white) border-(--grey-900) text-(--black) py-3 px-4 rounded focus:border-(--blue)/50 focus:outline-none duration-200 tracking-tight"
        />
        <button
          type="submit"
          className="w-full flex justify-center bg-(--blue) text-white py-2 cursor-pointer hover:bg-(--blue)/90 duration-200 rounded tracking-tight"
        >
          Add category
        </button>
      </form>
    </div>
  );
}
