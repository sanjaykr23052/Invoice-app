import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login.jsx";
import PaymentLinkGenerator from "./components/PaymentLinkGenerator.jsx";
// import InvoicePayment from "./components/InvoicePayment.jsx";
import { InvoicePage } from "./pages/InvoicePage.jsx";
import UserPages from './pages/admin/UserPages';
import QAInvoicePage from "./pages/QAInvoicePage.jsx";
import PaymentForm from "./pages/admin/PaymentForm";
import Invoice from "./pages/admin/Invoice.jsx";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard"; // Import Dashboard instead of DashboardCards
import "./index.css";

const App = () => {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <>
      <ToastContainer position="top-center" autoClose={300} />
      <Router  basename="/invoice">
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/paymentLink" element={<PaymentLinkGenerator />} />
          {/* <Route path="/InvoicePayment" element={<InvoicePayment />} /> */}
          <Route path="/InvoicePage" element={<InvoicePage />} />
          <Route path="/QAInvoicePage" element={<QAInvoicePage />} />
          <Route path="qaTesting" element={<QAInvoicePage />} />
        {/* Admin Layout Wrapper */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="admin/dashboard" element={<Dashboard />} /> */}
          <Route path="dashboard/payment" element={<PaymentForm />} />
          <Route path="dashboard/invoice" element={<Invoice />} />
          <Route path="dashboard/user-pages" element={<UserPages />} />
        </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;

