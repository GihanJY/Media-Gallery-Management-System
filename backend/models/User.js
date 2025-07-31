const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String 
    }, // Optional for Google OAuth users
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    googleId: String,
    avatar: String,
    otp: String,
    otpExpires: Date,
  },
  { 
    timestamps: true 
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
