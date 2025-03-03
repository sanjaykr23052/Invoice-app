import React from "react";

const QATestingForm = ({ formData, handleChange }) => {
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === "hours" ? Number(value) : value;
    
    handleChange({
      target: {
        name: `items.${index}.${name}`,
        value: updatedItems[index][name]
      }
    });
  };

  const addNewItem = () => {
    handleChange({
      target: {
        name: "items",
        value: [...formData.items, { itemName: "", hours: 0 }]
      }
    });
  }; 


  const handleSubmit = (e) => {
    e.preventDefault();
    const { clientName, weekSelection, fromDate, toDate, items } = formData;
    if (!clientName || !weekSelection || !fromDate || !toDate || !items.length) {
      return console.error("QATestingForm validation failed:", {
        clientName: clientName ? undefined : "Client Name is required",
        weekSelection: weekSelection ? undefined : "Week Selection is required",
        fromDate: fromDate ? undefined : "From Date is required",
        toDate: toDate ? undefined : "To Date is required",
        items: items.length ? undefined : "Item List is required",
      });
    }
    const validatedItems = items.map((item) => {
      if (!item.itemName || item.hours === "") {
        return console.error("QATestingForm validation failed:", {
          itemName: item.itemName ? undefined : "Item Name is required",
          hours: item.hours !== "" ? undefined : "Hours is required",
        });
      }
      return item;
    });
    if (validatedItems.every((item) => item.itemName && item.hours !== "")) {
      // Call API to handle form data submission
      console.log("Form data is valid:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-4">
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
      <div>
        <label className="block font-medium">Address:</label>
        <input type="text" name="Address" value={formData.Address || ""} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Amount:</label>
        <input type="number" name="amount" value={formData.amount || ""} onChange={handleChange} className="w-full border rounded p-2" required />
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

