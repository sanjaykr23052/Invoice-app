import React, { useState } from "react";

const QATestingForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    weekSelection: "",
    fromDate: "",
    toDate: "",
    Address: "",
    amount: "",
    items: [{ itemName: "", hours: "" }], // Initialize with one item
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addNewItem = () => {
    // Create a new item with default values
    const newItem = { itemName: "", hours: "" };
    // Update the items in formData
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  return (
    <form className="grid grid-cols-2 gap-6 mt-4">
      {/* Client Name */}
      <div>
        <label className="block font-medium">Client Name:</label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Week Selection */}
      <div>
        <label className="block font-medium">Week Selection:</label>
        <select
          name="weekSelection"
          value={formData.weekSelection}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select Week</option>
          <option value="1st Week">QA AND TESTING SERVICES FOR 1st Week</option>
          <option value="2nd Week">QA AND TESTING SERVICES FOR 2nd Week</option>
          <option value="3rd Week">QA AND TESTING SERVICES FOR 3rd Week</option>
          <option value="4th Week">QA AND TESTING SERVICES FOR 4th Week</option>
        </select>
      </div>

      {/* From Date */}
      <div>
        <label className="block font-medium">From Date:</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* To Date */}
      <div>
        <label className="block font-medium">To Date:</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="block font-medium">Address:</label>
        <input
          type="text"
          name="Address"
          value={formData.Address || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block font-medium">Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Dynamic Item List */}
      <div className="col-span-2">
        <label className="block font-medium">Item List:</label>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => handleItemChange(e, index)}
              className="border rounded p-2 flex-1"
              required
            />
            <input
              type="number"
              name="hours"
              placeholder="Hours"
              value={item.hours}
              onChange={(e) => handleItemChange(e, index)}
              className="border rounded p-2 w-24"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addNewItem}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add More
        </button>
      </div>
    </form>
  );
};

export default QATestingForm;