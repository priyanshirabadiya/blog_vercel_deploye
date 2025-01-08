import React, { useEffect, useState, useContext } from 'react';
import { BsPlusCircle } from "react-icons/bs";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/Dataprovider';
import { getAccessToken } from '../../constant/utils/comman-utils';
import { categoriesdata } from '../../constant/data';
const BASE_URL = process.env.REACT_APP_API_URL;

const UpdatePost = () => {
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState("");
    const [username, setUsername] = useState("");
    const { account } = useContext(DataContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${BASE_URL}/post/getsingle/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': getAccessToken()
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTitle(data.title);
                setDescription(data.description);
                setImage(data.image);
                setCategories(data.categories);
                setUsername(data.userName);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        setCategories(location.search?.split("=")[1] || 'All');
    }, [location.search]);

    useEffect(() => {
        if (account && account.userName) {
            setUsername(account.userName);
        }
    }, [account]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]); // Only set the file object here
    };

    const token = getAccessToken().split(" ")[1];

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('imageUpload', image);
        formData.append('categories', categories);
        formData.append('username', username);

        try {
            const response = await fetch(`${BASE_URL}/post/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                alert("Post updated successfully...");
                setTitle('');
                setDescription('');
                setImage(data.image);
                navigate(`/details/${id}`);
            }

        } catch (error) {
            console.log("Error on UpdatePost:", error);
            alert('An error occurred while updating the post.');
        }
    };

    const url = 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';

    return (
        <>
            <div className='mb-[50rem]'>
                <h1 className='text-[30px] mt-3 text-center font-bold'>Update Your Post</h1>
                <div className='flex justify-center w-full mt-2 img_width'>
                    <img
                        src={
                            typeof image === 'string'
                                ? image.startsWith("data:") ? image : `data:${image.contentType || 'image/jpeg'};base64,${Buffer.from(image).toString('base64')}`
                                : (image instanceof File ? URL.createObjectURL(image) : url)
                        }
                        alt="banner of post"
                    />
                </div>
                <div className='mx-[14rem] flex mt-7'>
                    <div>
                        <label htmlFor="fileInput" className='cursor-pointer'>
                            <BsPlusCircle className='h-7 mb-1 ms-8 w-7' />
                        </label>
                        <input type="file" id='fileInput' className='hidden' onChange={handleFileChange} />
                        <label className='cursor-pointer text-sm'>Update image</label>
                    </div>
                    <div className='ms-10 flex inp_title'>
                        <label htmlFor="title" className='text-gray-700 mt-3 w-[7rem] me-3 text-lg font-bold'>Update Title :</label>
                        <input
                            type="text"
                            id='title'
                            className='mt-1 inp_title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            name="category"
                            value={categories}
                            className='ms-5 absolute py-2 rounded border-2 px-3'
                            id="category"
                            onChange={(e) => setCategories(e.target.value)}
                        >
                            <option value="Select Category" >Update Category</option>
                            {
                                categoriesdata.map(category => (
                                    <option key={category.id} value={category.type} >{category.type}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='mx-[14rem] mt-2'>
                    <textarea
                        className='border-2 p-7 text-lg outline-none ms-5 rounded-lg'
                        rows="6"
                        cols="105"
                        id="txtarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className='ms-[15.2rem] published_btn mt-3'>
                    <button className='px-10 py-2 rounded text-white' onClick={handleSubmit}>Update</button>
                </div>
            </div>
        </>
    );
};

export default UpdatePost;
