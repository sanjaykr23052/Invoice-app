import React, { useState } from "react";

const DashboardCards = ({ totalRevenue, monthlyRevenue, paidInvoices, unpaidInvoices }) => {
  // const [paidInvoices, setPaidInvoices] = useState(0);
  // const [unpaidInvoices, setUnpaidInvoices] = useState(0);

  return (
    <div className="flex flex-nowrap overflow-x-auto whitespace-nowrap gap-8 p-6 w-full">
      {/* Overall Revenue */}
      <div className="w-full max-w-[400px] h-[250px] bg-gradient-to-r from-blue-900 to-blue-500 text-white p-8 rounded-2xl shadow-2xl border border-blue-300 ring-1 ring-blue-400 hover:scale-105 transition-all duration-300 ease-in-out text-center flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold">Rs {totalRevenue.toLocaleString()}</h2>
        <p className="text-yellow-300 text-xl mt-3">Overall Revenue</p>
      </div>

      {/* Total Invoices */}
      <div className="w-full max-w-[400px] h-[250px] bg-gradient-to-r from-pink-900 to-pink-500 text-white p-8 rounded-2xl shadow-2xl border border-pink-300 ring-1 ring-pink-400 hover:scale-105 transition-all duration-300 ease-in-out text-center flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold">12</h2>
        <p className="text-yellow-300 text-xl mt-3">Total Invoices</p>
      </div>

      {/* Revenue This Month */}
      <div className="w-full max-w-[400px] h-[250px] bg-gradient-to-r from-gray-900 to-gray-500 text-white p-8 rounded-2xl shadow-2xl border border-gray-300 ring-1 ring-gray-400 text-center flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold">Rs {monthlyRevenue.toLocaleString()}</h2>
        <p className="text-yellow-300 text-xl mt-3">This Month’s Revenue</p>
      </div>

      {/* Paid & Unpaid Invoices Card */}
      <div className="w-full max-w-[400px] h-[250px] bg-gradient-to-r from-green-900 to-green-500 text-white p-8 rounded-2xl shadow-2xl border border-green-300 ring-1 ring-green-400 hover:scale-105 transition-all duration-300 ease-in-out text-center flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Invoices Summary</h2>
        <div className="flex justify-between items-center text-white">
          <div className="w-1/2 text-center border-r border-white pr-4">
            <h3 className="text-3xl font-bold text-yellow-300">{paidInvoices}</h3>
            <p className="text-lg mt-2">Paid Invoices</p>
          </div>
          <div className="w-1/2 text-center pl-4">
            <h3 className="text-3xl font-bold text-red-300">{unpaidInvoices}</h3>
            <p className="text-lg mt-2">Unpaid Invoices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;

