import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";  
import "react-toastify/dist/ReactToastify.css";

const Invoice = () => {
  const [invoices, setInvoices] = useState({
    development: [],
    qATesting: [],
    digitalMarketing: [],
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

      const response = await fetch(
        "http://localhost:4000/api/admin/invoice-details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setInvoices({
        development: data.DevelopmentInvoices || [],
        qATesting: data.QATestingInvoices || [],
        digitalMarketing: data.DigitalMarketingInvoices || [],
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleDelete = async (invoiceId, formType) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! Please log in.");
        return;
      }

      if (!invoiceId) {
        console.error("Invoice ID is missing!");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/admin/delete-data/${invoiceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed! Status: ${response.status}`);
      }

      toast.success("Invoice deleted successfully!");

      // Update state to remove deleted invoice
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        [formType]: prevInvoices[formType].filter(
          (item) => item._id !== invoiceId
        ),
      }));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice!");
    }
  };

  const showInvoiceDetails = (invoiceData) => {
    Swal.fire({
      title: "BILL OF SUPPLY",
      width: 800,
      html: `
        <div style="text-align: left;">
          <p><strong>Bill No:</strong> ${invoiceData.invoiceNumber}</p>
          <p><strong>Date of Issue:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>State:</strong> Punjab</p>
          <p><strong>State Code:</strong> 03</p>
          <hr>
          <p><strong>Client Name:</strong> ${invoiceData.clientName}</p>
          <p><strong>Address:</strong> ${invoiceData.Address || "N/A"}</p>
          <p><strong>GSTIN/UIN:</strong> N/A</p>
          <hr>
          <table style="width:100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 8px;">Sr.No</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Production Description</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Rate</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Discount</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Value of Supply</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${invoiceData.projectName}, ${invoiceData.technology}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${invoiceData.rate}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${invoiceData.amount.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${invoiceData.discount || 0}%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${invoiceData.totalAmount ? invoiceData.totalAmount.toFixed(2) : "0.00"}</td>
              </tr>
            </tbody>
          </table>
          <hr>
              <p style="text-align: right; font-weight: bold;">Total: ₹{invoice.valueOfSupply ? invoice.valueOfSupply.toFixed(2) : 0}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
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
                Project Name
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
                    {invoice.projectName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.currency} {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-900 px-2 py-1 rounded-md mr-4"
                      onClick={() => handleDelete(invoice._id, formType)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 px-4 py-1 rounded-md bg-green-100 hover:bg-green-200 transition duration-300 ease-in-out"
                      onClick={() => showInvoiceDetails(invoice)}
                    >
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


