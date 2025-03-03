import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Invoice = () => {
  const [invoices, setInvoices] = useState({
    development: [],
    qATesting: [],
    digitalMarketing: []
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! Please log in.");
        return;
      }

      const response = await fetch("http://localhost:4000/api/admin/get-all-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setInvoices({
        development: data.DevelopmentForms || [],
        qATesting: data.QATestingForms || [],
        digitalMarketing: data.DigitalMarketingForms || []
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleDelete = async (invoice, formType) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! Please log in.");
        return;
      }

      // Make sure the invoice has an ID before making the request
      if (!invoice._id) {
        console.error("Invoice ID is missing!");
        return;
      }

      // Corrected API URL (with invoice ID)
      const response = await fetch(`http://localhost:4000/api/admin/delete-data/${invoice._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed! Status: ${response.status}`);
      }

      // Show success toast
      toast.success("Invoice deleted successfully!");

      // Update the state to remove the deleted invoice
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        [formType]: prevInvoices[formType].filter((item) => item._id !== invoice._id)
      }));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Invoice Records</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(invoices).map(([formType, invoiceList]) =>
              invoiceList.map((invoice, index) => (
                <tr key={`${formType}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-red-600 hover:text-red-900 mr-4"
                      onClick={() => handleDelete(invoice, formType)}
                    >
                      Delete
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
