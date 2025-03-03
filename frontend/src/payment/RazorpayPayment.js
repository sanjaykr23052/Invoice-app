// import React from "react";

// const RazorpayPayment = () => {
//   const loadRazorpay = async () => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   };

//   const handlePayment = async () => {
//     await loadRazorpay();

//     const options = {
//       key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay Key ID
//       amount: 50000, // Amount in paise (e.g., ₹500.00)
//       currency: "INR",
//       name: "Your Business Name",
//       description: "Test Transaction",
//       image: "https://your-logo-url.com/logo.png",
//       handler: function (response) {
//         alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
//         console.log(response);
//       },
//       prefill: {
//         name: "John Doe",
//         email: "johndoe@example.com",
//         contact: "9999999999",
//       },
//       notes: {
//         address: "Your Business Address",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   };

//   return (
//     <div>
//       <h2>Razorpay Payment</h2>
//       <button onClick={handlePayment}>Pay Now</button>
//     </div>
//   );
// };

// export default RazorpayPayment;
