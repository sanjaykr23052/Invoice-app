// const { Schema, model } = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new Schema({
//   firstName: { type: String, required: true, maxlength: 50 },
//   lastName: { type: String, required: true, maxlength: 50 },
//   email: { type: String, required: true, unique: true, maxlength: 50 },
//   phoneNumber: { type: String, required: true, maxlength: 20 },
//   address: { type: String, required: true, maxlength: 200 },
//   password: { type: String, required: true, minlength: 6 }, // Add password field
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const UserModel = model("User", userSchema);

// module.exports = UserModel;


const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
