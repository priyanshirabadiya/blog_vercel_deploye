import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaRegStar, FaStar } from "react-icons/fa6";
import '../banner/banner.css';
import { DataContext } from '../../context/Dataprovider';
import { getAccessToken } from '../../constant/utils/comman-utils';
import Comments from './Comments.jsx';
import defaultimg from '../../Assets/blog-4.jpg';
const BASE_URL = process.env.REACT_APP_API_URL;

function DetailView() {
    const [post, setPost] = useState({});
    const [currentRating, setCurrentRating] = useState(0);
    const { id } = useParams();
    const { account } = useContext(DataContext);
    const navigate = useNavigate();

    const url = defaultimg;

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${BASE_URL}/post/getsingle/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': getAccessToken()
                }
            });
            let data = await response.json();
            if (response.ok) {
                setPost(data);
                const userrating = data.ratings.find(rating => rating.userId._id === account._id)?.rating || 0;
                setCurrentRating(userrating);
                // console.log("first setted rating", currentRating);
            }
        };
        fetchData();
    }, [id]);

    const handleRatingClick = async (ratingValue) => {
        const newRating = ratingValue === currentRating ? 0 : ratingValue;
        setCurrentRating(newRating); // Optimistic update

        try {
            const response = await fetch(`${BASE_URL}/post/rate/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAccessToken(),
                },
                body: JSON.stringify({ rating: newRating }),
            });
            const data = await response.json();
            // console.log("Data of stars", data);
            if (response.ok) {
                setPost((prevPost) => ({
                    ...prevPost,
                    ratings: data.updatedRatings,
                }));
                setCurrentRating(
                    data.updatedRatings.find(rating => rating.userId._id?.toString() === account._id?.toString())?.rating || 0
                );
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };


    const deletepost = async () => {
        try {
            const response = await fetch(`${BASE_URL}/post/deletepost/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getAccessToken()
                }
            });
            if (response.ok) {
                alert("Deleted successfully...");
                navigate("/");
            }
        } catch (error) {
            console.error("Cannot delete post:", error);
        }
    };

    return (
        <>
            <div className='flex mb-[50px] justify-center text-center mt-[90px]'>
                <div className=' bg-[#F6F3FC] max-[365px]:w-[350px] w-[1000px] pb-[40px] rounded text-center'>
                    <div className='flex justify-center'>
                        <p className='mx-12 font-bold text-wrap text-center text-[30px] text-[#8750F7] pt-5 mt-3 mb-3'>
                            {post.title}
                        </p>
                    </div>
                    <div className='flex justify-center mt-5'>
                        <img src={post.image || url} className='border-2 rounded p-5 max-[365px]:h-[330px] h-[450px] w-[700px]' alt="" />
                    </div>
                    <div className='mx-14 flex mt-5 justify-between' >
                        <div className='mt-3 flex justify-center'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => handleRatingClick(star)} // pass the star number
                                    className='cursor-pointer me-[2px] text-lg'
                                    //                                       yellow      white-blank
                                    style={{ color: star <= currentRating ? '#FFD700' : '#2a1454' }}
                                >
                                    {/*           yellow bordered star    simple star */}
                                    {star <= currentRating ? <FaStar /> : <FaRegStar />}
                                </span>
                            ))}
                        </div>

                        <div>
                            {account.userName === post.userName && (
                                <p className='text-end ms-10'>
                                    <Link to={`/update/${post._id}`}>
                                        <i className="fa-solid fa-pen-to-square fa-lg p-5 px-3 border-[#ddc5f5] rounded-[5px] mt-2 cursor-pointer border-2"
                                            style={{ color: "#3D2176" }}
                                        ></i>
                                    </Link>
                                    <button onClick={() => deletepost()}>
                                        <i className="fa-solid fa-trash ms-3 p-[13px] px-[14px] rounded-[5px] mt-2 border-[#ddc5f5] cursor-pointer border-2"
                                            style={{ color: "#2a1454" }}
                                        ></i>
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                    <p className='mt-5 mb-30 text-start'>
                        <strong className='text-[23px] mb-2 ms-10 text-start flex justify-start text-[#8750F7]'>Description : </strong>
                    </p>
                    <p className='text-[18px] text-[#2A148F] mx-10 flex justify-center'>
                        {post.description}
                    </p>
                    <p className='mt-2 mb-2 text-[17px] text-[#2A148F]'>
                        <strong className='text-[20px] text-[#8750F7]'> Author</strong> : {post.userName}
                    </p>
                    <p className='mt-2 mb-2 text-[17px] text-[#2A148F]'>
                        <strong className='text-[17px] text-[#8750F7]'>Category</strong> : {post.categories}
                    </p>
                    <p className='mt-2 mb-10 text-[17px] text-[#2A148F]'>
                        <strong className='text-[17px] text-[#8750F7]'>Created date</strong>: {new Date(post.createdDate).toDateString()}
                    </p>
                    <div className="">
                        <Comments post={post} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailView;












