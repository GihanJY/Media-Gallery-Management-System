import React from 'react'
import OTPForm from '../components/auth/OTPForm'
import { useLocation } from "react-router-dom";

function OTPPage() {
    const location = useLocation();
    const email = location.state?.email;
    return (
        <div>
            <OTPForm email={email} />
        </div>
    )
}

export default OTPPage
