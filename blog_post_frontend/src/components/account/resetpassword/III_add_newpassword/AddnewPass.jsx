import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
const BASE_URL = process.env.REACT_APP_API_URL;

const AddnewPass = () => {
  const [newpass, setNewPass] = useState('');
  const [confirmpass, setConfirmPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const mail = state?.mail;

  const handlepassChange = (e) => {
    setNewPass(e.target.value);
  }

  const handleConfirmPassChange = (e) => {
    setConfirmPass(e.target.value);
  }

  const handlePasswordSet = async () => {
    if (newpass !== confirmpass) {
      setError(true);
    }
    try {
      const verifiedEmail = sessionStorage.getItem('verifiedEmail');
      if (!verifiedEmail) {
        console.error('No verified email found. Please verify OTP again.');
        return;
      }

      let response = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ newpass, confirmpass, mail: verifiedEmail })
      })
      let data = await response.json();
      // console.log("getteddata data is:", data);
      if (data.errormessage) {
        setError(data.errormessage);
      }
      if (response.ok) {
        alert("Password changed successfully...");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error on new password set:", error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
          <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
          <form id="resetPasswordForm" >
            {error && <p className='text-[#ff0000] text-[15px] border border-red-600 p-3 mb-4' >{error}</p>}
            <div>
              <label htmlFor="password" className="block text-sm font-medium w-[500px] text-gray-700">New Password</label>
              <input type="password" id="password" name="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
                onChange={(e) => handlepassChange(e)}
                required />
            </div>
            <div className='mt-5' >
              <label htmlFor="password" className="block text-sm font-medium w-[500px] text-gray-700">Confirm Password</label>
              <input type="password" id="password" name="password"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter confirm password" required
                onChange={(e) => handleConfirmPassChange(e)}
              />
            </div>
            <Link className='' >
              <button type="submit" onClick={() => handlePasswordSet()} className="w-full tj-btn-primary_reset text-white mt-4 py-2 rounded-lg">Reset Password</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddnewPass;
