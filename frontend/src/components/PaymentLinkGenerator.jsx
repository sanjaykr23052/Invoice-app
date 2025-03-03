import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../pages/admin/PaymentForm";
import QATestingForm from "./QATestingForm";
import { postApiData } from "../services/apiConnector";
const PaymentLinkGenerator = () => {
  const [activeTab, setActiveTab] = useState("development");
  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    technology: "",
    milestone: "",
    duration: { from: "", to: "" },
    amount: "",
    currency: "USD",
    invoiceBy: "",
    isRecurring: false,
    formType: 2,
    Address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const initialFormData = {
    development: {
      clientName: "",
      projectName: "",
      technology: "",
      milestone: "",
      duration: { from: "", to: "" },
      amount: "",
      currency: "USD",
      invoiceBy: "",
      isRecurring: false,
      formType: 2,
      Address: "",
      Discount: "",
    },
    qaTesting: {
      clientName: "",
      weekSelection: "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      items: [{ itemName: "", hours: 0 }],
      formType: 1,
      Address: "",
      amount: "",
    },
    digitalMarketing: {
      clientName: "",
      campaignName: "",
      platform: "",
      budget: "",
      duration: "",
      invoiceGeneratedBy: "",
      amount: "",
      currency: "USD",
      formType: 3,
      Address: "",
      Discount: "",
    },
  };

  const setTab = (tab) => {
    setActiveTab(tab);
    setFormData({ ...initialFormData[tab] });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prevData) => {
      if (name.includes("duration")) {
        const key = name.split(".")[1];
        return {
          ...prevData,
          duration: {
            ...prevData.duration,
            [key]: value,
          },
        };
      }
      if (name.startsWith("items.")) {
        const [_, index, field] = name.split(".");
        const updatedItems = [...prevData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: type === "number" ? parseFloat(value) : value,
        };
        return {
          ...prevData,
          items: updatedItems,
        };
      }
      if (name === "items") {
        return {
          ...prevData,
          items: value,
        };
      }
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmitForm = async () => {
    console.log("Submitting Data:", formData);

    try {
      var token = localStorage.getItem("token");
      setLoading(true);

      const response = await postApiData("http://localhost:4000/api/admin/add-data", formData, token);

      console.log("API Response:", response);

      if (response && response.message === "Form added successfully" && response.data && response.data._id) {
        let billCounter = parseInt(localStorage.getItem('billCounter')) || 0;
        billCounter++; // Increment counter
        localStorage.setItem('billCounter', billCounter);
  
        // Add billNumber to formData
        const invoiceData = {
          ...formData,
          invoiceNumber: billCounter
        };
        alert("Form submitted successfully!");
       if (formData.formType === 1) {
        navigate("/QAInvoicePage", { state: { formData: invoiceData } }); 
      } else {
        navigate("/InvoicePage", { state: { formData: invoiceData } }); 
      }
      } else {
        alert("Submission failed.");
        setError({ error: "Failed to add form data", details: response.details });
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setError({ error: "Failed to submit form data", details: error.message });
    } finally {
      setLoading(false);
    }
    const invoiceData = {
      ...formData,
      invoiceNumber: billCounter,
      // Add discount to invoice data
      discount: formData.Discount || 0 // Use 0 as fallback
    };
  
    if (formData.formType === 1) {
      navigate("/QAInvoicePage", { state: { formData: invoiceData } }); 
    } else {
      navigate("/InvoicePage", { state: { formData: invoiceData } }); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">PAYMENT LINK GENERATOR</h2>

      <div className="flex justify-center border-b">
        {["development", "digitalMarketing", "qaTesting"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${activeTab === tab ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}
            onClick={() => setTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>


      <div className="mt-6">
        <h3 className="text-lg font-semibold text-center border-b pb-2">ONE TIME PAYMENT</h3>
        {activeTab === "qaTesting" && <QATestingForm formData={formData} handleChange={handleChange} />}
        {activeTab !== "qaTesting" && <PaymentForm formData={formData} handleChange={handleChange} />}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmitForm}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all ${loading ? "cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Payment Link"}
        </button>
      </div>

      {error && (
        <div className="mt-6 text-red-600 font-semibold text-center">
          {error.error}:
          {error.details && (
            <ul className="list-disc pl-6">
              {Object.keys(error.details).map((key) => (
                <li key={key}>{key}: {error.details[key]}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentLinkGenerator;
