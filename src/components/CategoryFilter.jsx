import React from "react";

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const categories = [
    "all",
    "music",
    "theater",
    "sports",
    "Education",
    "social",
    "Gaming",
  ];

  // Inline style for the filter container
  const containerStyle = {
    position: "fixed",
    top: "4rem", // Adjust top value to move the filter under the header
    left: "0",
    right: "0",
    backgroundColor: "#ffffff", // White background
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow for styling
    zIndex: "20", // Make sure it stays on top
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  };

  // Inline style for the button
  const buttonStyle = {
    padding: "0.5rem 1rem", // Padding inside the button
    borderRadius: "0.375rem", // Rounded corners
    fontWeight: "bold", // Make text bold
  };

  // Style for the active category button
  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4C51BF", // Indigo background
    color: "#ffffff", // White text
  };

  // Style for the inactive category button
  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#E2E8F0", // Light gray background
    color: "#2D3748", // Dark text
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {categories.map((category) => (
          <button
            key={category}
            style={selectedCategory === category ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
