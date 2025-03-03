import React from "react";

const DropdownCategory = ({ value, onChange }) => {
  const categories = ["WordPress", "Shopify", "Custom Development"];

  return (
    <select 
      className="border p-1 w-full"
      value={value} 
      onChange={onChange}
    >
      {categories.map((cat, index) => (
        <option key={index} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default DropdownCategory;
