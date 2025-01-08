import React, { useState, useContext, useEffect, useRef } from 'react';
import '../Profile';
import user from '../../../Assets/new_img.png'; // default user image
import { DataContext } from '../../../context/Dataprovider';
import { getAccessToken } from '../../../constant/utils/comman-utils';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import '../profile.css';
import { Link, useNavigate } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_URL;

const Editprofiledetails = () => {
    const { account, setAccount } = useContext(DataContext);
    const [bio, setBio] = useState(account.bio || "");
    const [firstName, setFirstName] = useState(account.firstName);
    const [lastName, setLastName] = useState(account.lastName);
    const [email, setEmail] = useState(account.email);
    const [userName, setUserName] = useState(account.userName);
    const [userNameError, setuserNameError] = useState("");
    // console.log("data in with edit account", account);
    // empty error handling
    const [emailerror, setEmailError] = useState(false);
    const [firstNameerror, setfirstNameError] = useState(false);
    const [lastNameerror, setlastNameError] = useState(false);
    const [lastUserNameerror, setlastUserNameError] = useState(false);

    // State for managing the temporary image changes
    const [tempImage, setTempImage] = useState(account.image);
    const [imageSrc, setImageSrc] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const fileInputRef = useRef(null);
    const [croppedImage, setCroppedImage] = useState(null); // state to hold cropped image
    const navigate = useNavigate();

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [fileInputRef]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }

        // reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Function to handle cropping image and store it temporarily
    const handleCropImage = () => {
        if (!croppedAreaPixels) return;

        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const { width, height } = croppedAreaPixels;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                croppedAreaPixels.x, croppedAreaPixels.y,
                width, height,
                0, 0,
                width, height
            );

            canvas.toBlob(async (blob) => {
                if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setCroppedImage(reader.result); // store the cropped image temporarily
                        setIsCropModalOpen(false);
                    };
                    reader.readAsDataURL(blob);
                }
            }, 'image/jpeg');
        };
    };

    // Main profile updation function
    const handleUpdateProfile = async () => {
        setfirstNameError(firstName === "");
        setlastNameError(lastName === "");
        setlastUserNameError(lastUserNameerror === "");
        setEmailError(email === "");
        try {
            // Use the croppedImage for final profile update
            const finalImage = croppedImage ? croppedImage.split(',')[1] : tempImage;
            const response = await fetch(`${BASE_URL}/user/profile/update/${account._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAccessToken()
                },
                body: JSON.stringify({ bio: bio, firstName, lastName, userName, email, image: finalImage })
            });

            const updatedData = await response.json();
            // console.log("Updation of data:", updatedData);

            if (updatedData.message) {
                setuserNameError(updatedData.message);
            }

            if (response.ok) {
                setAccount((prev) => ({
                    ...prev,
                    bio: updatedData.user.bio,
                    firstName: updatedData.user.firstName,
                    lastName: updatedData.user.lastName,
                    email: updatedData.user.email,
                    userName: updatedData.user.userName,
                    image: updatedData.user.image,
                }));
                setBio(updatedData.user.bio);
                setFirstName(updatedData.user.firstName);
                setLastName(updatedData.user.lastName);
                setEmail(updatedData.user.email);
                setUserName(updatedData.user.userName);
                setTempImage(updatedData.user.image);
                navigate('/profile');
            } else {
                if (updatedData.message) {
                    console.error(updatedData.message);
                } else {
                    console.error("Failed to update profile.");
                }
            }
            // navigate('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleCancel = () => {
        setTempImage(account.image);
        navigate('/profile');
    };

    return (
        <div className='flex justify-center mb-[20px] mt-[50px]'>
            <div className='whole_shade bg-[#F6F3FC] p-[50px] pb-[30px] size_customize mt-10 px-[100px]'>
                <p className='text-center font-bold mt-3 text-[35px]'>Edit Profile</p>
                <div className="flex flex-wrap center_jsti mt-10">
                    <div className='relative'>
                        <div className='flex bg-black rounded cursor-pointer right-0 top-32 absolute'>
                            <div>
                                <i
                                    className="fa-solid fa-pen pt-2 fa-2xs p-1 z-[5000]"
                                    style={{ color: "white" }}
                                    onClick={() => fileInputRef.current.click()}
                                ></i>
                            </div>
                            <p className='text-white text-sm cursor-pointer pe-[5px] pt-[1px]'>edit</p>
                        </div>
                        <div className="user_image flex justify-center items-center">
                            <img
                                src={
                                    croppedImage
                                        ? croppedImage
                                        : tempImage
                                            ? `data:image/png;base64,${tempImage}`
                                            : account.image
                                                ? `data:image/png;base64,${account.image}`
                                                : user
                                }
                                className='h-[200px] w-[200px] rounded-full'
                                alt="User profile"
                            />
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <Modal
                        isOpen={isCropModalOpen}
                        onRequestClose={() => setIsCropModalOpen(false)}
                        className="crop-modal"
                    >
                        <div className="crop-container">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="rect"
                                showGrid={true}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                zoomWithScroll={true}
                                restrictPosition={true}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                        <button onClick={handleCropImage} className="save-button">Save</button>
                    </Modal>
                    <div className='ms-[80px] max-[500px]:ms-[20px] mt-5'>
                        <div className="rm_border">
                            <div className="rm_border">
                                <div className='mb-1'>Firstname : </div>
                                <input
                                    type="text"
                                    className="border font-bold rounded mb-2 p-2"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value)
                                        setfirstNameError(false)
                                    }
                                    }
                                />
                                {firstNameerror && <p className='text-[#ff0000] border-none text-[12px] mb-4'>FirstName must be require.</p>}
                                <div className='mt-2 mb-1'>Lastname : </div>
                                <input
                                    type="text"
                                    className="font-bold border mb-2 p-2"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value)
                                        setlastUserNameError(false)
                                    }}
                                />
                                {lastNameerror && <p className='text-[#ff0000] border-none text-[12px] mb-4'>lastName must be require.</p>}
                                <div className='mt-2 mb-1'>Username : </div>
                                <input
                                    type="text"
                                    className="font-bold border mb-2 p-2"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value)
                                        setuserNameError('')
                                        setlastUserNameError(false)
                                    }}
                                />
                                {lastUserNameerror && <p className='text-[#ff0000] border-none text-[12px] mb-4'>userName must be require.</p>}
                                {userNameError && <div className="error_message pt-3 ms-1">{userNameError}</div>}
                                <div className='mt-2 mb-1'>Bio : </div>
                                <input
                                    type="text"
                                    className="font-bold border mb-2 p-2"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                                <div className='mt-2 mb-1'>Email : </div>
                                <input
                                    type="text"
                                    className="font-bold border mb-2 p-2"
                                    value={email}
                                    onChange={(e) => {
                                        setEmailError(false)
                                        setEmail(e.target.value)
                                    }}
                                />
                                {emailerror && <p className='text-[#ff0000] border-none text-[12px] mb-4'>Email must be require.</p>}
                            </div>
                        </div>
                        <div className='mt-5 flex me-14 justify-end'>
                            <div className='me-2'>
                                <button className='tj-btn-primary' onClick={handleCancel} >Cancel</button>
                            </div>
                            <div className=''>
                                {/* <Link className='' > */}
                                    <button className='tj-btn-primary' onClick={handleUpdateProfile}>Save</button>
                                {/* </Link> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editprofiledetails;
