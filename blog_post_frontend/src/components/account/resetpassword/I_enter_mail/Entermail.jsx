import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_URL;

const Entermail = () => {
  const [mail, setMail] = useState('');
  const [mailerrro, setMailError] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setMailError(mail === '')
      if (mail === '') {
        return;
      }
      let response = await fetch(`${BASE_URL}/enter-mail`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ mail })
      })
      let data = await response.json();
      // console.log("Data of Entered mail is :", data);
      if (response.ok) {
        navigate('/enter-otp', { state: { mail } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Enter email to receive otp</h2>
          <form id="forgotPasswordForm" onSubmit={handleSend} >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => {
                  setMail(e.target.value)
                  setMailError(false)
                }}
                placeholder="Enter your email" required />
            </div>
            {mailerrro && <p className='error_message pt-4 pb-3 mb-2 ms-1 absolute'>Mail must be require.</p>}
            <button className="w-full bg-blue-600 mt-6 text-white tj-btn-primary_reset py-2 rounded-lg">Send OTP</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Entermail;
