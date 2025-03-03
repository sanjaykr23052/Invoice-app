const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice"); 
const authMiddleware = require("../middleware/authMiddleware");
const { QATestingForm, DevelopmentForm, DigitalMarketingForm } = require("../models/entries");

const router = express.Router();

/* ------------------- Admin Authentication Routes ------------------- */

//  Register Admin (Run Only Once)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error in Admin Registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

//  Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in Admin Login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

//  Logout API
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});



const formTypes = {
  1: QATestingForm,
  2: DevelopmentForm,
  3: DigitalMarketingForm,
};

router.post("/add-data", authMiddleware, async (req, res) => {
  const { formType, ...data } = req.body;

  if (!formTypes[formType]) {
    return res.status(400).json({ message: "Invalid form type" });
  }

  try {
    const FormModel = formTypes[formType];
    const newForm = new FormModel(data);
    await newForm.save();
    
    res.status(201).json({ message: "Form added successfully", data: newForm });
  } catch (error) {
    console.error("Error in Adding Form Data:", error);
    res.status(500).json({ error: "Failed to add form data", details: error.message });
  }
});

//  Get all data
router.get("/get-all-data", authMiddleware, async (req, res) => {
  try {
    const allForms = {
      QATestingForms: await QATestingForm.find(),
      DevelopmentForms: await DevelopmentForm.find(),
      DigitalMarketingForms: await DigitalMarketingForm.find(),
    };

    res.status(200).json(allForms);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to retrieve data", details: error.message });
  }
});

//  Get single data by ID
router.get("/get-data/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    let form = await QATestingForm.findById(id) || 
               await DevelopmentForm.findById(id) || 
               await DigitalMarketingForm.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ error: "Failed to retrieve data", details: error.message });
  }
});

//  Update data by ID
router.put("/update-data/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    let form = await QATestingForm.findByIdAndUpdate(id, updatedData, { new: true }) ||
               await DevelopmentForm.findByIdAndUpdate(id, updatedData, { new: true }) ||
               await DigitalMarketingForm.findByIdAndUpdate(id, updatedData, { new: true });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form updated successfully", data: form });
  } catch (error) {
    console.error("Error updating form data:", error);
    res.status(500).json({ error: "Failed to update data", details: error.message });
  }
});

//  Delete data by ID
router.delete("/delete-data/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    let form = await QATestingForm.findByIdAndDelete(id) ||
               await DevelopmentForm.findByIdAndDelete(id) ||
               await DigitalMarketingForm.findByIdAndDelete(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form data:", error);
    res.status(500).json({ error: "Failed to delete data", details: error.message });
  }
});

//  Get Recent Data from All Forms
router.get("/recent-data-list", authMiddleware, async (req, res) => {
  try {
    const recentData = {
      QATestingForms: await QATestingForm.find().sort({ createdAt: -1 }).limit(5),
      DevelopmentForms: await DevelopmentForm.find().sort({ createdAt: -1 }).limit(5),
      DigitalMarketingForms: await DigitalMarketingForm.find().sort({ createdAt: -1 }).limit(5),
    };

    res.status(200).json(recentData);
  } catch (error) {
    console.error("Error fetching recent data:", error);
    res.status(500).json({ error: "Failed to retrieve recent data", details: error.message });
  }
});

//  Overall Revenue API
router.get("/overall-revenue", authMiddleware, async (req, res) => {
  try {
    const totalRevenue = await calculateTotalRevenue();
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching overall revenue:", error);
    res.status(500).json({ error: "Failed to retrieve revenue", details: error.message });
  }
});

//  Monthly Revenue API
router.get("/monthly-revenue", authMiddleware, async (req, res) => {
  try {
    const monthlyRevenue = await calculateMonthlyRevenue();
    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ error: "Failed to retrieve monthly revenue", details: error.message });
  }
});

//  Invoices Summary API
router.get("/invoices-summary", authMiddleware, async (req, res) => {
  try {
    const invoicesSummary = await calculateInvoicesSummary();
    res.status(200).json(invoicesSummary);
  } catch (error) {
    console.error("Error fetching invoices summary:", error);
    res.status(500).json({ error: "Failed to retrieve invoices summary", details: error.message });
  }
});

//   Functions
async function calculateTotalRevenue() {
  const revenue = await Promise.all([
    QATestingForm.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    DevelopmentForm.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    DigitalMarketingForm.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  return revenue.reduce((acc, item) => acc + (item[0]?.total || 0), 0);
}

async function calculateMonthlyRevenue() {
  const revenueData = await Promise.all([
    QATestingForm.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: "$amount" } } }
    ]),
    DevelopmentForm.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: "$amount" } } }
    ]),
    DigitalMarketingForm.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: "$amount" } } }
    ]),
  ]);

  const monthlyRevenue = {};
  revenueData.flat().forEach(({ _id, total }) => {
    const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + total;
  });

  return monthlyRevenue;
}

async function calculateInvoicesSummary() {
  const invoices = await Promise.all([
    QATestingForm.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    DevelopmentForm.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    DigitalMarketingForm.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
  ]);

  const summary = { paid: 0, unpaid: 0 };
  invoices.flat().forEach(({ _id, count }) => {
    if (_id === "paid") summary.paid += count;
    if (_id === "unpaid") summary.unpaid += count;
  });

  return summary;
}

// Invoice Details API
router.get("/invoice-details", authMiddleware, async (req, res) => {
  try {
    const developmentInvoices = await DevelopmentForm.find({}, "clientName projectName amount currency generatedBy duration");
    const marketingInvoices = await DigitalMarketingForm.find({}, "clientName projectName amount currency generatedBy duration");
    const qaTestingInvoices = await QATestingForm.find({}, "clientName weekSelection fromDate toDate itemList");

    const invoices = {
      DevelopmentInvoices: developmentInvoices,
      DigitalMarketingInvoices: marketingInvoices,
      QATestingInvoices: qaTestingInvoices,
    };

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    res.status(500).json({ error: "Failed to retrieve invoice details", details: error.message });
  }
});


// Create User Route
router.post("/create-user", authMiddleware, async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      userType
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Role-based middleware
const checkPermission = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.userType !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};


/* ------------------- Add Invoice API ------------------- */
router.post("/add-invoice", authMiddleware, async (req, res) => {
  try {
    const {
      nameOfClient,
      nameOfProject,
      nameOfTechnology,
      nameOfMilestone,
      estimatedDuration,
      currency,
      isRecurring,
    } = req.body;

    // Validate required fields
    if (!nameOfClient || !nameOfProject || !nameOfTechnology || !nameOfMilestone || !estimatedDuration || !currency) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new invoice
    const newInvoice = new Invoice({
      nameOfClient,
      nameOfProject,
      nameOfTechnology,
      nameOfMilestone,
      estimatedDuration,
      currency,
      isRecurring,
    });

    await newInvoice.save();
    res.status(201).json({ message: "Invoice added successfully", data: newInvoice });
  } catch (error) {
    console.error("Error in Adding Invoice:", error);
    res.status(500).json({ error: "Failed to add invoice", details: error.message });
  }
});

// Create User (Admin Only)
router.post("/create-user", authMiddleware, async (req, res) => {
  try {
    // Only allow admins to create users
    if (!(req.user instanceof Admin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { username, password, userType, email } = req.body;
    
    // Validate input
    if (!username || !password || !email || !['staff', 'account'].includes(userType)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Check existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      userType,
      email
    });

    await newUser.save();

    res.status(201).json({ 
      message: "User created successfully",
      userId: newUser._id
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login (For staff/account users)
router.post("/user-login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User List Admin Only
router.get("/user-list", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Invalid Token or User Not Found" });
    }

    if (!(req.user instanceof Admin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({}, "-password");
    
    res.status(200).json({ 
      message: "User list fetched successfully",
      users
    });

  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-user/:id", authMiddleware, async (req, res) => {
  try {
    if (!(req.user instanceof Admin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { username, email, userType } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.userType = userType || user.userType;

    await user.save();

    res.json({ message: "User updated successfully", user });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    if (!(req.user instanceof Admin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    if (!(req.user instanceof Admin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;

