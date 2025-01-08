import { useState, useContext } from 'react';
import { DataContext } from '../../context/Dataprovider';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import './login.css';
import logo from '../../Assets/blglogo.png';
const BASE_URL = process.env.REACT_APP_API_URL;

const Login = ({ isUserAuthenticated }) => {
    const [account, toggleAccount] = useState('login');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailerror, setEmailError] = useState(false);
    const [passWorderror, setpassWordError] = useState(false);
    const [Semailerror, SsetEmailError] = useState(false);
    const [SpassWorderror, SsetpassWordError] = useState(false);
    const [firstNameerror, setfirstNameError] = useState(false);
    const [lastNameerror, setlastNameError] = useState(false);
    const [userAlreadyexisterror, setuserAlreadyexistError] = useState('');
    const [usernotfoundError, setUsernotFoundError] = useState("");

    const { setAccount } = useContext(DataContext);
    const navigate = useNavigate();

    const toggleSignup = () => {
        account === 'signUp' ? toggleAccount('login') : toggleAccount('signUp');
    }

    const handleLogin = async () => {
        setEmailError(email === "")
        setpassWordError(password === "")
        try {
            if (email === "" || password === "") {
                return;
            }
            if (usernotfoundError) {
                return;
            }
            let response = await fetch(`${BASE_URL}/user/loginuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            let data = await response.json();
            // console.log("First response is:", data);
            // setIncorrectPassError(data.message);
            if (response.ok) {
                sessionStorage.setItem('access token', `Bearer ${data.accessToken}`);
                // console.log(data.userName);
                setAccount({
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    bio: data.bio,
                    _id: data._id,
                    image: data.image,
                });
                isUserAuthenticated(true);
                navigate("/");
            } else if (response.status === 404) {
                setUsernotFoundError(data.message)
            } else {
                console.log('Register failed Error is:', data.message);
            }
        } catch (error) {
            console.log("Error on login:", error);
        }
    }

    const handleSignup = async () => {
        setfirstNameError(firstName === "");
        setlastNameError(lastName === "");
        SsetEmailError(email === "");
        SsetpassWordError(password === "");

        try {
            if (firstName === "" || lastName === "" || email === "" || password === "") {
                return;
            }
            if (userAlreadyexisterror) {
                return;
            }
            let response = await fetch(`${BASE_URL}/user/adduser`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            });
            let data = await response.json();
            // console.log('Successfully registered user...', data);
            setuserAlreadyexistError(data.message);
            if (response.ok) {
                sessionStorage.setItem('user', JSON.stringify({
                    ...data,
                    image: data.image || null
                }));
                sessionStorage.setItem('access token', `Bearer ${data.accessToken}`);

                setAccount({
                    _id: data._id,
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    bio: data.bio,
                    image: data.image || null
                });

                isUserAuthenticated(true);
                navigate("/");
            } else {
                console.log('Error on register:', data.message);
            }
        } catch (error) {
            console.log("Error during signup:", error);
        }
    }

    return (
        <div className="main_parent bg-[#F6F3FC]" >
            <div className="login_page bg-white text-[#5530A0] rounded-lg mt- size_padding p-[40px] px-[50px] pt-[0px]" >
                <div className="item-center ">
                    <div className='-z-20 flex justify-center mt-7 ' >
                        <img src={logo} className='h-[80px] size_img mb-7 w-auto' alt="" />
                    </div>
                    {account === 'login' ?
                        <div className='mt-3' >
                            {usernotfoundError &&
                                <p className='px-7 py-4 border rounded z-30 border-red-600 text-center text-[#ff0000] text-[14px] -mt-3 mb-4'>{usernotfoundError}</p>}
                            <form action="" className='size_wid' >
                                <label htmlFor="email" className='size_mo' >Enter email:</label><br />
                                <input
                                    type="text"
                                    className='mt-0 mb-5 size_input'
                                    placeholder="Email address"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(false);
                                        setUsernotFoundError('')
                                    }}
                                    autoComplete='on'
                                />
                                {emailerror && <p className='error_message size_mo'>Email must be require.</p>}
                                <div>
                                    <label htmlFor="password" className="mt-10 size_mo" >Enter Password:</label><br />
                                    <input
                                        type="password"
                                        className="mt-0 size_input"
                                        placeholder="Password"
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setpassWordError(false)
                                            setUsernotFoundError('')
                                        }}
                                    />
                                    {passWorderror && <p className='error_message-pass size_mo'>Password must be require.</p>}
                                </div>
                                <p className='text-end mt-3 mb-2 size_me  forgotPass hover:underline' >
                                    <Link to='/entermail' className='text-[#b695f9]' >
                                        Forgot password
                                    </Link>
                                </p>
                                <div className="m-5 mt-0">
                                    <Box sx={{ flexWrap: 'wrap' }} className="flex justify-center" >
                                        <Button className='w-[300px] size_wid-btn tj-btn-primary' onClick={handleLogin} >Login Account</Button>
                                    </Box>
                                </div>
                            </form>
                            <div className="">
                                <p className='text-center'>OR</p>
                                <p className='mt-3'>Don't have an Account <button className='text-[#9067e3] ms-2 underline underline-offset-1' onClick={() => toggleSignup()} >Sign up</button> </p>
                            </div>
                        </div>
                        :
                        <>
                            {userAlreadyexisterror &&
                                <p className='px-10 py-5 border rounded z-30 border-red-600 text-center text-[#ff0000] text-[12px] -mt-3 mb-4'>{userAlreadyexisterror}</p>}
                            <form action="">
                                <label htmlFor="firstName" className='size_mo' >Enter Firstname:</label><br />
                                <input
                                    type="text"
                                    className="size_input mt-0 mb-5"
                                    placeholder="Firstname"
                                    onChange={(e) => {
                                        setfirstName(e.target.value)
                                        setfirstNameError(false)
                                    }}
                                />
                                {firstNameerror && <p className='text-[#ff0000] text-[12px] -mt-3 mb-4 '>FirstName must be require.</p>}
                                <div>
                                    <label htmlFor="lastName" className='size_mo' >Enter Lastname:</label><br />
                                    <input
                                        type="text"
                                        className="size_input mt-0 mb-5"
                                        placeholder="Lastname"
                                        onChange={(e) => {
                                            setlastName(e.target.value)
                                            setlastNameError(false)
                                        }}
                                    />
                                </div>
                                {lastNameerror && <p className='text-[#ff0000] text-[12px] -mt-3 mb-4 '>Lastname must be require.</p>}
                                <div>
                                <label htmlFor="email" className='size_mo' >Enter email:</label><br />
                                <input
                                    type="text"
                                    className="size_input mt-0 mb-5"
                                    placeholder="Email address"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        SsetEmailError(false)
                                        setuserAlreadyexistError("")
                                    }}
                                    autoComplete='on'
                                />
                                </div>
                                {Semailerror && <p className='text-[#ff0000] text-[12px] -mt-3 mb-4'>Email must be require.</p>}
                                
                                <label htmlFor="password" className="mt-10 size_mo" >Enter Password:</label><br />
                                <input
                                    type="password"
                                    className="size_input mt-0 "
                                    placeholder="Password"
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        SsetpassWordError(false)
                                    }}
                                />
                                {SpassWorderror && <p className='error_message-pass size_mo'>Password must be require.</p>}
                                <div className="m-5 mt-8 flex justify-center size_mo">
                                    <Box sx={{ flexWrap: 'wrap' }}>
                                        <Button className='w-[300px] size_wid-btn tj-btn-primary' onClick={handleSignup} >Create an account</Button>
                                    </Box>
                                </div>
                                <div className="">
                                    <p className='text-center size_mo'>OR</p>
                                    <p className='mt-3 size_mo'>Already have an account<button className='ms-2 underline underline-offset-1 size_mo text-[#9067e3]' onClick={() => toggleSignup()} >Log in</button> </p>
                                </div>
                            </form>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Login;
