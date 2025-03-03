import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const QAInvoiceForm = ({ formData = {} }) => {
  const { items = [], weekSelection, fromDate, toDate } = formData;
  const rate = 50;
  const totalAmount = items?.reduce((sum, item) => sum + (item.hours * rate), 0) || 0;
  const invoiceRef = useRef();

  const handlePrint = () => {
    const input = invoiceRef.current;

    // Hide buttons before generating PDF
    const buttons = document.querySelectorAll('.no-print');
    buttons.forEach(button => button.style.display = 'none');

    // Force traditional color formats for PDF generation
    input.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";

    html2canvas(input, {
      backgroundColor: "#FFFFFF",
      scale: 2,
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `${formData.clientName?.replace(/ /g, '_') || 'invoice'}_${
        weekSelection?.replace(/[^a-zA-Z0-9]/g, '_') || 'week'
      }.pdf`;
      
      pdf.save(fileName);

      // Reset styles
      input.style.backgroundColor = "";
      document.body.style.backgroundColor = "";

      // Show buttons again after generating PDF
      buttons.forEach(button => button.style.display = '');
    });
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-6 bg-[#ffffff] shadow-lg rounded-lg border"
      style={{ 
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff'
      }}
      ref={invoiceRef}
    >
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: #ffffff !important;
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
            {`268/${new Date().getFullYear().toString().slice(2, 4)}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${String(formData.invoiceNumber).padStart(2, '0')}`}
          </p>
          <p><strong>Date of Issue:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p><strong>State:</strong> Punjab</p>
          <p><strong>State Code:</strong> 03</p>
        </div>
      </div>
      
      {/* Client Information */}
      <div className="mt-4 p-4 border rounded-lg text-sm" style={{ borderColor: '#e5e7eb' }}>
        <p><strong>Client Name:</strong> {formData.clientName || 'N/A'}</p>
        <p><strong>Address:</strong> {formData.Address || 'N/A'}</p>
        <p><strong>GSTIN/UIN:</strong> N/A</p>
      </div>
      
      {/* Dynamic Table */}
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th className="border px-4 py-2 text-left" style={{ borderColor: '#d1d5db' }}>Description</th>
            <th className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>Hours</th>
            <th className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>Rate</th>
            <th className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>Amount</th>
            <th className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 pl-8" style={{ borderColor: '#d1d5db' }} colSpan={5}>
              <div>
                <strong>Week Selection:</strong> {weekSelection || 'N/A'}<br />
                <strong>From Date:</strong> {fromDate || 'N/A'}<br />
                <strong>To Date:</strong> {toDate || 'N/A'}
              </div>
            </td>
          </tr>
          {items?.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 pl-8" style={{ borderColor: '#d1d5db' }}>{item.itemName}</td>
              <td className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>{item.hours}</td>
              <td className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>${rate}</td>
              <td className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>${item.hours * rate}</td>
              <th className="border px-4 py-2" style={{ borderColor: '#d1d5db' }}>${item.hours * rate}</th>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="mt-4 text-right font-semibold text-lg">
        Total: ₹ {totalAmount}
      </div>
        
      {/* Bank Details Table */}
      <table className="w-full border mt-6 text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th className="p-2 border text-center" style={{ borderColor: '#d1d5db' }} colSpan={3}>Bank Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#d1d5db' }}>Bank Name :</td>
            <td className="p-2 border" style={{ borderColor: '#d1d5db' }}>YES BANK LTD</td>
            <td rowSpan={3} className="p-2 border text-center align-top" style={{ borderColor: '#d1d5db' }}>
              <p className="text-xs italic">Certified that the particulars given above are correct</p>
              <p className="font-semibold">For TECHDEVISE IT SERVICES LLP</p>
            </td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#d1d5db' }}>Bank A/C No :</td>
            <td className="p-2 border" style={{ borderColor: '#d1d5db' }}>001563300003339</td>
          </tr>
          <tr>
            <td className="p-2 border font-semibold" style={{ borderColor: '#d1d5db' }}>Bank IFSC :</td>
            <td className="p-2 border" style={{ borderColor: '#d1d5db' }}>YESB0000015</td>
          </tr>
          <tr>
            <td className="p-2 border text-center font-semibold" style={{ borderColor: '#d1d5db' }} colSpan={2}>Terms & Conditions</td>
            <td className="p-2 border text-center font-semibold" style={{ borderColor: '#d1d5db' }}>Common Seal</td>
          </tr>
          <tr>
            <td className="p-2 border text-center" style={{ borderColor: '#d1d5db' }} colSpan={2}></td>
            <td className="p-2 border text-right font-semibold" style={{ borderColor: '#d1d5db' }}>Authorized Signatory</td>
          </tr>
        </tbody>
      </table>

      {/* Payment Buttons */}
      <div className="mt-6 flex justify-center space-x-4 no-print">
        <button 
          className="flex items-center bg-[#2563eb] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1d4ed8]"
          onClick={() => alert("Redirecting to PayPal...")}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 mr-2" />
          Checkout with PayPal
        </button>

        <button 
          className="flex items-center bg-[#1f2937] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#111827]"
          onClick={() => alert("Redirecting to Razorpay...")}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Razorpay_logo.svg" alt="Razorpay" className="h-5 mr-2" />
          Checkout with Razorpay
        </button>
      </div>

      {/* Print and Pay Now Buttons */}
      <div className="mt-8 border-t pt-4 no-print" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-[#4b5563] text-white px-6 py-2 rounded-lg hover:bg-[#374151]"
            onClick={handlePrint}
          >
            Print
          </button>
          <button 
            className="bg-[#2563eb] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8]"
            onClick={() => alert("Pay Now clicked")}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default QAInvoiceForm;