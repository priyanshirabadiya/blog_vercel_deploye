import React, { useEffect, useState, useContext } from 'react';
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import './createpost.css';
import { categoriesdata } from '../../constant/data';
import { DataContext } from '../../context/Dataprovider';
import { getAccessToken } from '../../constant/utils/comman-utils';
import defaultimg from '../../Assets/blog-4.jpg';
const BASE_URL = process.env.REACT_APP_API_URL;

const Createpost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState("All");
    const [userId, setUserId] = useState("");
    const { account } = useContext(DataContext);
    const navigate = useNavigate();
    // console.log("Data in account", account);
    useEffect(() => {
        if (account && account._id) {
            setUserId(account._id);
        }
    }, [account]);

    const handleFilechange = (e) => {
        setImage(e.target.files[0]);
    };

    const token = getAccessToken().split(" ")[1];

    const handleSubmit = async () => {
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('description', description);
        formdata.append('imageUpload', image);
        formdata.append('categories', categories);

        try {
            const response = await fetch(`${BASE_URL}/post/uploadpost`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formdata
            });
            const data = await response.json();
            // console.log("main res data is : ", data);
            if (response.ok) {
                alert("Post added successfully...");
                // console.log(data, "post created successfully..");
                setTitle('');
                setDescription('');
                setImage(null);
                navigate('/');
            }
        } catch (error) {
            console.log("Error on createpost:", error);
            alert('An error occurred while creating the post.');
        }
    };
    const url = defaultimg;
    return (
        <>
            <div className='relative mb-[4rem] mt-[90px] rounded-lg flex justify-center p-[2rem]'>
                <div className='bg-[#F6F3FC] w-[80%] wid_ma rounded-lg' >
                    <h1 className='text-[30px] text-center mt-2 font-bold text-[#8750F7] pt-5'>Create Your Post</h1>
                    <div className='flex justify-center mt-2 img_width'>
                        <img src={image ? URL.createObjectURL(image) : url} className='rounded' alt="banner of post" />
                    </div>
                    <div className='flex flex-wrap justify-center mt-7 me-[10rem] max-[768px]:me-[0rem]'>
                        <div className=' max-[768px]:order-1' >
                            <label htmlFor="fileInput" className='cursor-pointer'>
                                <BsPlusCircle className='h-7 mb-1 ms-8 w-7' />
                            </label>
                            <input type="file" id='fileInput' className='hidden' onChange={handleFilechange} />
                            <label className='cursor-pointer text-sm text-[#351B68]'>Upload image</label>
                        </div>
                        <div className='ms-5 max-[768px]:-ms-20 flex inp_title order-2 max-[768px]:order-3'>
                            <div className='max-[768px]:mt-[5rem]  max-[500px]:-ms-[80px] max-[500px]:mt-20 flex' >
                                <label htmlFor="title" className='mt-3 w-[6rem] max-[500px]:ms-16 text-lg font-bold text-[#351B68]'>Add Title :</label>
                                <input
                                    type="text"
                                    id='title'
                                    className='mt-1 bg-[#F6F3FC] inp_title'
                                    placeholder='Enter title of blog..'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='order-3 max-[768px]:order-2 ' >
                            <select
                                name="category"
                                value={categories}
                                className='ms-5 absolute py-2 rounded border-2 px-3 text-[#351B68]'
                                id="category"
                                onChange={(e) => setCategories(e.target.value)}
                            >
                                <option value="Select Category" >Select Category</option>
                                {
                                    categoriesdata.map(category => (
                                        <option key={category.id} value={category.type} >{category.type}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className='flex justify-center mt-5 inp_title'>
                        <textarea
                            className='border-2 p-7 txt-res text-lg outline-none rounded-lg '
                            rows="6"
                            cols="105"
                            id="txtarea"
                            value={description}
                            placeholder='Add description..'
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='pb-[1rem] ps-[5rem] published_btn mt-8'>
                        <button className='px-10 py-2 rounded text-white tj-btn-primary_post' onClick={handleSubmit}>Publish</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Createpost;

