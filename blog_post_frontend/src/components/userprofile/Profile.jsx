import React, { useState, useContext, useEffect, useRef } from 'react';
import './profile.css';
import user from '../../Assets/new_img.png'; // Default user image
import { DataContext } from '../../context/Dataprovider';
import { getAccessToken } from '../../constant/utils/comman-utils';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
const BASE_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
    const { account, setAccount } = useContext(DataContext);
    const [bio, setBio] = useState("");
    const [tempBio, setTempBio] = useState("");
    const [bioerror, setBioerror] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null); // Image preview state
    const fileInputRef = useRef(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const handleCropChange = (newCrop) => setCrop(newCrop);
    const handleZoomChange = (newZoom) => setZoom(newZoom);

    // console.log("data in account", account);
    // console.log("Bio Error is now", bioerror);

    // Fetch account details
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        // console.log('New stored user is :', storedUser);
        if (setAccount && !account._id) {
            setAccount(storedUser.newuser);
        }
        // console.log("data in with effect account", account);
        if (account._id) {
            const fetchAccountDetails = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/user/profile/${account._id}`, {
                        headers: { 'Authorization': getAccessToken() }
                    });
                    const data = await response.json();
                    // console.log("profile fetched data is:", data);
                    if (response.ok) {
                        setBio(data.bio);
                        setAccount({ ...account, ...data, bio: data.bio });
                    }
                } catch (error) {
                    console.error("Error fetching bio:", error);
                }
            };
            fetchAccountDetails();
        }
    }, [account._id, setAccount]);
    // console.log("Account is:", account);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result); // Set the image preview
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropImage = () => {
        if (!croppedAreaPixels) {
            console.error("No cropped area selected.");
            return;
        }

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
                    const formData = new FormData();
                    formData.append('image', blob, 'cropped-image.jpg');

                    try {
                        const response = await fetch(`${BASE_URL}/user/uploadProfileImage/${account._id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': getAccessToken()
                            },
                            body: formData,
                        });

                        const data = await response.json();
                        // console.log("which img data", data);
                        if (response.ok) {
                            // Update the image in state
                            setAccount((prevAccount) => ({ ...prevAccount, image: data.image }));

                            setImageSrc(null); // Clear the preview state
                            setIsCropModalOpen(false);
                        } else {
                            console.error("Failed to upload image. Response error:", data);
                        }
                    } catch (error) {
                        console.error("Error uploading image:", error);
                    }
                } else {
                    console.error("Blob creation failed.");
                }
            });
        };

        image.onerror = () => {
            console.error("Failed to load image for cropping.");
        };
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleBioSubmit = async () => {
        try {
            if (!tempBio || tempBio.trim() === "") {
                setBioerror(true);
                return;
            }
            else {
                const response = await fetch(`${BASE_URL}/user/addbio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getAccessToken()
                    },
                    body: JSON.stringify({ bio: tempBio, userId: account._id })
                });

                if (response.ok) {
                    const updatedAccount = { ...account, bio: tempBio };
                    setBio(tempBio);
                    setIsEditingBio(false);
                    setAccount(updatedAccount);
                    setBioerror(false);
                } else {
                    console.error("Failed to update bio.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelBio = () => {
        setIsEditingBio(false);
        setTempBio(bio);
        setBioerror(false);
    }

    // console.log("image src for image:", imageSrc);
    // console.log("image account:", account.image);

    return (
        <div className='flex justify-center mt-[90px]'>
            <div className='whole_shade bg-[#F6F3FC] p-[40px] mt-10 px-[80px] max-[880px]:p-[20px] max-[880px]:px-[30px]  '>
                <p className='text-center font-bold mt-3 text-[#8750F7] text-[35px]'>My Profile</p>
                <div className="text-[#2a1454] flex flex-wrap justify-center max-[480px]:justify-center  mt-5 ">
                    <div>
                        <div className="user_image flex justify-center items-center">
                            <img
                                src={
                                    imageSrc || (account.image ? `data:image/png;base64,${account.image}` : user)
                                }
                                className='h-[180px] w-[180px] rounded-full'
                                alt="User profile"
                            />
                        </div>
                        {!account.image && (
                            <div className="flex justify-center mt-3 py-1 brd_cls rounded">
                                <button onClick={() => fileInputRef.current.click()}>Upload Image</button>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}
                    </div>
                    <div className='ms-[80px] max-[780px]:ms-10 max-[500px]:ms-0 max-[480px]:ms-5 max-[400px]:ms-0 mt-5'>
                        <div className="text-[25px] max-[735px]:text-center  font-bold">
                            {account.firstName} {account.lastName}
                        </div>
                        <p className='max-[735px]:text-center' >{account.userName}</p>
                        <div className='mt-3 mb-1 max-[735px]:text-center'>
                            {bio ? (
                                <p className=" text-[18px] flex text-wrap flex-wrap font_bold max-[735px]:text-center max-[365px]:ms-1">{bio}</p>
                            ) : (
                                !isEditingBio &&
                                <div>
                                    <button
                                        className='px-3 py-1 bg-gray-300'
                                        onClick={() => {
                                            setIsEditingBio(true);
                                            setTempBio(bio);
                                        }}
                                    >
                                        Add bio
                                    </button>
                                </div>
                            )}
                            {isEditingBio && (
                                <div className="mt-2 text-wrap w-[450px] max-[735px]:text-center">
                                    <input
                                        type="text"
                                        className="px-2 w-[450px] flex text-wrap flex-wrap mb-2 py-1"
                                        placeholder="Enter your bio"
                                        value={tempBio}
                                        onChange={(e) => {
                                            setTempBio(e.target.value)
                                            if (e.target.value === "") {
                                                setBioerror(true)
                                            }
                                        }}
                                    />
                                    {bioerror && (
                                        <p className='text-[#ff0000] text-[12px] max-[735px]:text-center' >
                                            Bio should not be empty.
                                        </p>
                                    )}
                                    <div className="flex mt-2 mb-2">
                                        <button
                                            className='px-3 rounded py-1 bg-gray-300'
                                            onClick={handleCancelBio}
                                        >
                                            cancel
                                        </button>
                                        <button
                                            className='ms-3 px-3 rounded py-1 bg-gray-300'
                                            onClick={handleBioSubmit}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className='mt-1 max-[735px]:text-center'>{account.email}</p>
                    </div>
                </div>
                <div className='mt-8'>
                    <p className='text-sm text-wrap flex justify-center'>
                        Keep your profile details up-to-date to enjoy a personalized experience and stay connected with our network.
                    </p>
                    <div className='mt-[1.3rem] flex justify-end'>
                        <Link to={`/profile/edit`} >
                            <button className='tj-btn-primary'>Edit</button>
                        </Link>
                    </div>
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
                        onCropChange={handleCropChange}
                        onZoomChange={handleZoomChange}
                        zoomWithScroll={true}
                        restrictPosition={true}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <button onClick={handleCropImage} className='save-button'>
                    Save Crop
                </button>
            </Modal>
        </div>
    );
};

export default Profile;
