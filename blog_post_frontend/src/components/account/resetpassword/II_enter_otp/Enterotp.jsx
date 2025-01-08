import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_URL;

const Enterotp = () => {
  const [otpboxerror, setOtpboxError] = useState(false);
  const [otp, setOtp] = useState('');
  const [invalidotp, setInvalidOtpError] = useState('');
  let navigate = useNavigate();
  const { state } = useLocation();
  const mail = state?.mail;

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setOtpboxError(otp === '')
      if (otp === '') {
        return;
      }
      if (!mail) {
        alert('mail ID is missing. Please start over.');
        return;
      }
      let response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ otp, mail: mail })
      })
      let data = await response.json();
      // console.log(" Enterotp is :", data);
      setInvalidOtpError(data.message);
      if (response.status === 200) {
        sessionStorage.setItem('verifiedEmail', mail);
        navigate('/add-newpass', { state: { mail } });
        return;
      }
      if (response.status === 401) {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
          {invalidotp &&
            <p className='py-4  border rounded z-30 border-red-600 text-center text-[#ff0000] text-[12px] mb-4'>{invalidotp}</p>}
          <form onSubmit={handleSend} >
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700">Enter OTP which has been sent to your mail.</label>
              <input type="text" id="otp" name="otp"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  setOtp(e.target.value)
                  setOtpboxError(false)
                  setInvalidOtpError('')
                }}
              />
            </div>
            {otpboxerror && <p className='error_message pt-2 pb-0 ms-1'>Otp must be require.</p>}
            <button type="submit"
              className="w-full text-white py-2 px-4 rounded-lg tj-btn-primary_reset">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Enterotp
