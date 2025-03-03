// QAInvoicePage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import QAInvoiceForm from '../components/QAInvoiceForm';

const QAInvoicePage = () => {
  const { state } = useLocation();
  const { formData } = state || {};

  return <QAInvoiceForm formData={formData} />;
};

export default QAInvoicePage;

