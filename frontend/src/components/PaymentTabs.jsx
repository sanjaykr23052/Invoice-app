import React, { useState } from "react";
// import QATestingForm from "./QATestingForm";
import PaymentForm from "./common/PaymentForm";

const PaymentTabs = () => {
  const [activeTab, setActiveTab] = useState("qa-testing");

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`py-2 px-4 ${activeTab === "qa-testing" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("qa-testing")}
        >
          QA & Testing
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "development" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("development")}
        >
          Web Development
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "marketing" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("marketing")}
        >
          Digital Marketing
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">
        {activeTab === "qa-testing" && <QATestingForm />}
        {activeTab === "development" && <PaymentForm activeTab="development" />}
        {activeTab === "marketing" && <PaymentForm activeTab="marketing" />}
      </div>
    </div>
  );
};

export default PaymentTabs;
