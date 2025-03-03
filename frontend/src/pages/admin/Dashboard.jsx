import React, { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch Total Revenue
    fetch("http://localhost:4000/api/admin/overall-revenue", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTotalRevenue(data.totalRevenue || 0))
      .catch((error) => console.error("Error fetching total revenue:", error));

    // Fetch Monthly Revenue
    fetch("http://localhost:4000/api/admin/monthly-revenue", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        setMonthlyRevenue(data[currentMonth] || 0);

        const formattedData = Object.keys(data).map((key) => ({
          month: key,
          revenue: data[key],
        }));
        setMonthWiseData(formattedData);
      })
      .catch((error) => console.error("Error fetching monthly revenue:", error));

    // Fetch Recent Invoices
    fetch("http://localhost:4000/api/admin/recent-data-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== "Access Denied, No Token Provided") {
          const qaTestingInvoices = data.QATestingForms?.map((item) => ({
            customer: item.clientName || "N/A",
            date: item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "N/A",
            total: item.amount || "N/A",
          })) || [];

          const developmentInvoices = data.DevelopmentForms?.map((item) => ({
            customer: item.clientName || "N/A",
            date: item.duration?.from ? new Date(item.duration.from).toLocaleDateString() : "N/A",
            total: item.amount ? `$${item.amount} ${item.currency || ""}` : "N/A",
          })) || [];

          setRecentInvoices([...qaTestingInvoices, ...developmentInvoices]);
        }
      })
      .catch((error) => console.error("Error fetching recent invoices:", error));

    // Fetch Invoices Summary (Paid & Unpaid Invoices)
    fetch("http://localhost:4000/api/admin/invoices-summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPaidInvoices(data.paid || 0);
        setUnpaidInvoices(data.unpaid || 0);
      })
      .catch((error) => console.error("Error fetching invoices summary:", error));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DashboardCards totalRevenue={totalRevenue} monthlyRevenue={monthlyRevenue} />

      {/* Paid & Unpaid Invoices Card */}
      {/* <div className="w-full max-w-[400px] h-[250px] bg-gradient-to-r from-green-900 to-green-500 text-white p-8 rounded-2xl shadow-2xl border border-green-300 ring-1 ring-green-400 hover:scale-105 transition-all duration-300 ease-in-out text-center flex flex-col justify-center">
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
      </div> */}

      <div className="flex justify-between mt-8 gap-6">
        {/* Month-wise Collection Chart */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Month-wise Collection</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthWiseData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="skyblue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice List Section */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold bg-blue-600 text-white p-3 rounded-t-lg">
            Recent Invoice List
          </h2>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-gray-600 pb-2">Client Name</th>
                  <th className="text-left text-gray-600 pb-2">Date</th>
                  <th className="text-left text-gray-600 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{invoice.customer}</td>
                      <td className="py-2">{invoice.date}</td>
                      <td className="py-2">{invoice.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No recent invoices available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
