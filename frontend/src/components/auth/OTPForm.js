import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function OTPForm({ email }) {
    const navigate = useNavigate();
    const { verifyOTP } = useAuth();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpLength = 6;
    const inputRefs = useRef([]);

    useEffect(() => {
        // Auto-focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < otpLength - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Clear any existing messages when user starts typing
        if (message.text) {
            setMessage({ text: "", type: "" });
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, otpLength);

        if (/^\d+$/.test(pasteData) && pasteData.length === otpLength) {
            const newOtp = pasteData.split("");
            setOtp(newOtp);
            inputRefs.current[otpLength - 1].focus();
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== otpLength) {
            setMessage({
                text: `Please enter a complete ${otpLength}-digit OTP.`,
                type: "danger",
            });
            return;
        }

        setIsVerifying(true);
        setMessage({ text: "Verifying OTP...", type: "info" });

        try {
            const data = {
                email: email,
                otp: enteredOtp
            };

            const response = await verifyOTP(data);

            if (response.success) {
                setMessage({
                    text: "OTP verified successfully! Redirecting...",
                    type: "success",
                });
                navigate("/login");
                // Add your success logic here (redirect, etc.)
            } else {
                setMessage({
                    text: "Invalid OTP. Please try again.",
                    type: "danger",
                });
                // Clear OTP on failure
                setOtp(new Array(6).fill(""));
                inputRefs.current[0].focus();
            }
        } catch (error) {
            setMessage({
                text: "Verification failed. Please try again.",
                type: "danger",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = () => {
        setResendCooldown(30);
        setMessage({
            text: "New OTP has been sent to your email.",
            type: "info",
        });
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
    };

    const isOtpComplete = otp.join("").length === otpLength;

    const getMessageClass = () => {
        switch (message.type) {
            case "success":
                return "alert-success";
            case "danger":
                return "alert-danger";
            case "info":
                return "alert-info";
            default:
                return "alert-info";
        }
    };

    const getInputClass = (digit) => {
        let baseClass = "form-control text-center fs-4 fw-bold";
        if (digit) {
            baseClass += " border-primary bg-light";
        }
        if (message.type === "danger") {
            baseClass += " border-danger shake";
        }
        return baseClass;
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-4 p-md-5">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div
                                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: "80px", height: "80px" }}
                                >
                                    <i
                                        className="bi bi-shield-check text-primary"
                                        style={{ fontSize: "2rem" }}
                                    ></i>
                                </div>
                                <h2 className="card-title fw-bold text-dark mb-2">
                                    Verify Your Identity
                                </h2>
                                <p className="text-muted mb-0">
                                    Enter the 6-digit code sent to your email
                                </p>
                            </div>

                            {/* OTP Input Form */}
                            <form onSubmit={handleOtpVerification}>
                                <div className="row g-2 mb-4">
                                    {otp.map((digit, index) => (
                                        <div key={index} className="col-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                className={getInputClass(digit)}
                                                style={{
                                                    height: "60px",
                                                    fontSize: "1.5rem",
                                                    borderRadius: "12px",
                                                }}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                disabled={isVerifying}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={!isOtpComplete || isVerifying}
                                    className={`btn w-100 py-3 fw-semibold mb-3 ${!isOtpComplete || isVerifying
                                            ? "btn-secondary"
                                            : "btn-primary"
                                        }`}
                                    style={{ borderRadius: "12px" }}
                                >
                                    {isVerifying ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </button>
                            </form>

                            {/* Resend OTP */}
                            <div className="text-center mb-3">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0 || isVerifying}
                                    className={`btn btn-link text-decoration-none p-0 ${resendCooldown > 0 || isVerifying
                                            ? "text-muted"
                                            : "text-primary"
                                        }`}
                                >
                                    {resendCooldown > 0
                                        ? `Resend code in ${resendCooldown}s`
                                        : "Didn't receive code? Resend"}
                                </button>
                            </div>

                            {/* Message Display */}
                            {message.text && (
                                <div
                                    className={`alert ${getMessageClass()} text-center mb-0`}
                                    role="alert"
                                >
                                    {message.text}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="text-center mt-4 pt-3 border-top">
                                <small className="text-muted">
                                    <i className="bi bi-lock-fill me-1"></i>
                                    Secure verification process • Your data is protected
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Bootstrap Icons CDN */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
            />

            {/* Add CSS for shake animation */}
            <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        .form-control {
          transition: all 0.2s ease-in-out;
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          border-color: #007bff;
        }
        .btn-primary {
          background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
          border: none;
          transition: all 0.3s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }
        .card {
          border-radius: 20px;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}

export default OTPForm;
