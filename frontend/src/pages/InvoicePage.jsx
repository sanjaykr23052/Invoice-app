import React from "react";
import { useLocation } from "react-router-dom";
import { InvoiceForm } from "../components/InvoiceForm";

export const InvoicePage = () => {
  const location = useLocation();
  const formData = location.state?.formData || {};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <InvoiceForm formData={formData} />
    </div>
  );
};


