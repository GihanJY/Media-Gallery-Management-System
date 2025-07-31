const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const register = async (req, res) => {
  // Logic: Save user temporarily + send OTP
};

const verifyOTP = async (req, res) => {
  // Logic: Verify OTP and activate account
};

const login = async (req, res) => {
  // Logic: Authenticate user with email/password
};

const googleAuth = async (req, res) => {
  // Logic: Handle Google OAuth login/signup
};

const forgotPassword = async (req, res) => {
  // Logic: Generate OTP and send to user email
};

const resetPassword = async (req, res) => {
  // Logic: Verify OTP and update password
};

module.exports = {
    register,
    verifyOTP,
    login,
    googleAuth,
    forgotPassword,
    resetPassword,
}