import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const InvoiceForm = ({ formData }) => {
  const [category, setCategory] = useState("WordPress");
  // Remove rate state and use formData.amount directly
  const [discount, setDiscount] = useState(formData.discount || 0);
  const invoiceRef = useRef();

  const categories = ["WordPress", "Shopify", "Custom Development"];

  const calculateSupplyValue = () => {
    // Calculate using original amount from formData
    return formData.amount - formData.amount * (discount / 100);
  };


  const handlePrint = () => {
    const input = invoiceRef.current;

    // Hide all buttons before generating PDF
    const buttons = document.querySelectorAll('.no-print, .pay-now');
    buttons.forEach(button => button.style.display = 'none');

    // Force white background for PDF generation
    input.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";

    html2canvas(input, {
      backgroundColor: "#FFFFFF",
      scale: 2, // Increase resolution
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${formData.clientName.replace(/ /g, "_")}_${
          formData.milestone ? formData.milestone.replace(/ /g, "_") : "invoice"
        }.pdf`
      );

      // Reset background colors
      input.style.backgroundColor = "";
      document.body.style.backgroundColor = "";

      // Show buttons again after generating PDF
      buttons.forEach(button => button.style.display = '');
    });
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border"
      style={{ 
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff' // Explicit white background
      }}
      ref={invoiceRef}
    >
      <style>
        {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              background: white !important;
            }
            
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="text-center font-bold text-lg border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
        TECHDEVISE IT SERVICES LLP
      </div>
      <div className="text-center text-sm">F - 268, INDUSTRIAL AREA, PHASE - 8B, MOHALI, PUNJAB, 160071</div>
      <div className="text-center text-sm border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
        TEL: +91-9855499027, +91-7889038027 | GSTIN: 03AAPFT6571LZ
      </div>

      <h2 className="text-center text-xl font-semibold my-4">BILL OF SUPPLY</h2>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 border-b pb-4 text-sm" style={{ borderColor: '#e5e7eb' }}>
        <div>
          <p>
            <strong>Bill No:</strong>{" "}
            {`268/${new Date().getFullYear().toString().slice(2, 4)}/${(
              new Date().getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}/${String(formData.invoiceNumber).padStart(
              2,
              "0"
            )}`}
          </p>
          <p><strong>Date of Issue:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p><strong>State:</strong> Punjab</p>
          <p><strong>State Code:</strong> 03</p>
        </div>
      </div>

      {/* Bill to Party */}
      <div className="mt-4 p-4 border rounded-lg text-sm" style={{ borderColor: '#e5e7eb' }}>
        <p><strong>Client Name:</strong> {formData.clientName}</p>
        <p><strong>Address:</strong> {formData.Address}</p>
        <p><strong>GSTIN/UIN:</strong> N/A</p>
      </div>

      {/* Table */}
      <table className="w-full border mt-4 text-sm border-collapse">
        <thead>
          <tr className="bg-[#f3f4f6] text-left">
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Sr.No</th>
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Production Description</th>
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Rate</th>
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Amount</th>
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Discount</th>
            <th className="p-2 border" style={{ borderColor: '#e5e7eb' }}>Value of Supply</th>
          </tr>
        </thead>
        <tbody>
        <tr>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>1</td>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>
      {formData.projectName}, {formData.technology}
    </td>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>
  {formData.amount}
</td>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>
      {formData.amount}
    </td>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>
  {discount}
</td>
    <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>
      {calculateSupplyValue().toFixed(2)}
    </td>
  </tr>
        </tbody>
      </table>

      {/* Total Section */}
      <div className="mt-4 text-right font-semibold text-lg">
        Total: ₹{calculateSupplyValue().toFixed(2)}
      </div>

      {/* Bank Details Table */}
      <table className="w-full border mt-6 text-sm border-collapse">
        <thead>
          <tr className="bg-[#f3f4f6] text-left">
            <th 
              className="p-2 border text-center" 
              style={{ borderColor: '#e5e7eb' }} 
              colSpan={3}
            >
              Bank Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#e5e7eb' }}>Bank Name :</td>
            <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>YES BANK LTD</td>
            <td rowSpan={3} className="p-2 border text-center align-top" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-xs italic">
                Certified that the particulars given above are correct
              </p>
              <p className="font-semibold">For TECHDEVISE IT SERVICES LLP</p>
            </td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#e5e7eb' }}>Bank A/C No :</td>
            <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>001563300003339</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#e5e7eb' }}>Bank IFSC :</td>
            <td className="p-2 border" style={{ borderColor: '#e5e7eb' }}>YESB0000015</td>
          </tr>
          <tr>
            <td className="p-2 border text-center font-semibold" style={{ borderColor: '#e5e7eb' }} colSpan={2}>
              Terms & Conditions
            </td>
            <td className="p-2 border text-center font-semibold" style={{ borderColor: '#e5e7eb' }}>Common Seal</td>
          </tr>
          <tr>
            <td className="p-2 border text-center" style={{ borderColor: '#e5e7eb' }} colSpan={2}></td>
            <td className="p-2 border text-right font-semibold" style={{ borderColor: '#e5e7eb' }}>
              Authorized Signatory
            </td>
          </tr>
        </tbody>
      </table>

      {/* Payment Buttons */}
      <div className="mt-6 flex justify-center space-x-4 no-print">
        <button
          className="bg-[#4b5563] text-white px-6 py-2 rounded-lg hover:bg-[#374151]"
          onClick={handlePrint}
        >
          Print Invoice
        </button>
        <button
          className="flex items-center bg-[#003087] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#00205b]"
          onClick={() => alert("Redirecting to PayPal...")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="h-5 mr-2"
          />
          Checkout with PayPal
        </button>

        <button
          className="flex items-center bg-[#0B2343] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#091c33]"
          onClick={() => alert("Redirecting to Razorpay...")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Razorpay_logo.svg"
            alt="Razorpay"
            className="h-5 mr-2"
          />
          Checkout with Razorpay
        </button>
      </div>

      {/* Pay Now Button */}
      <div className="mt-8 border-t pt-4 pay-now">
        <div className="flex justify-center space-x-4">
          <button className="bg-[#2563eb] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8]">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;