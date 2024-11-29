// CategoryFilter.jsx
import React from "react";

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const categories = ["all", "music", "theater", "sports", "Education", "social", "Gaming"];

  return (
    <div className="flex gap-4 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded ${
            selectedCategory === category
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
