const invoiceData = {
    company: {
      name: "TECHDEVISE IT SERVICES LLP",
      address: "F - 268, INDUSTRIAL AREA, PHASE - 8B, MOHALI, PUNJAB, 160071",
      contact: "+91-9855499027, +91-7889038027",
      gstin: "03AAPFT6571LZ"
    },
    invoice: {
      billNo: "268/215/06",
      date: "25 MAY 2021",
      state: "Punjab",
      stateCode: "03"
    },
    customer: {
      name: "HARJIT SINGH SAMRA",
      address: "2472, FOXCROFT CIR, ROSEVILLE, CALIFORNIA, 95747",
      gstin: "N/A"
    },
    items: [
      {
        description: "WordPress",
        rate: 17700,
        amount: 17700,
        discount: 0,
        total: 17700
      }
    ],
    bank: {
      name: "PUNJAB NATIONAL BANK LTD",
      accountNo: "001563300003339",
      ifsc: "YESB0000015"
    }
  };
  
  export default invoiceData;
  