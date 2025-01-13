import React, { useEffect, useState } from 'react';
import '../home.css';
import { FaRegComments, FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import defaultimg from '../../../Assets/blog-4.jpg';
import { addElipsis, getAccessToken } from '../../../constant/utils/comman-utils';
const BASE_URL = process.env.REACT_APP_API_URL;

const Toprated = () => {
    const [ratedpost, setRatedPosts] = useState([]);

    useEffect(() => {
        const topratedposts = async () => {
            try {
                let response = await fetch(`${BASE_URL}/post/get-rated-posts`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': getAccessToken(),
                    },
                });
                let data = await response.json();
                // console.log("Fetched Data:", data);
                if (response.ok) {
                    setRatedPosts(data.posts);
                } else {
                    console.error("Error fetching data:", data.message);
                }
            } catch (error) {
                console.error("Error in topratedposts:", error);
            }
        };

        topratedposts();
    }, []);

    return (
        <div>
            <div className='mt-5 p-5 pe-0 bg-[#F6F3FC] rounded'>
                <div className='cursor-pointer font-bold text-lg tracking-wide text-[#8750F7]'>
                    <Link>TOP RATED</Link>
                </div>
                {ratedpost && ratedpost.length > 0 ? (
                    ratedpost.map((post, ind) => (
                        <Link key={ind} to={`/details/${post._id}`} >
                            <div className='flex'>
                                <div className='mt-5'>
                                    <img src={post.image || defaultimg} className='h-[75px] w-[80px] rounded' alt="" />
                                </div>
                                <div>
                                    <div className='flex'>
                                        <FaStar className="mt-7 ms-3 me-[2px]" style={{ color: '#9675d4' }} />
                                        <p className='text-[#8750F7] text-[13px] ms-1 mt-[25px]'>
                                            {parseFloat(post.averageRating).toFixed(1)}
                                        </p>
                                        <FaRegComments className='h-5 w-5 mt-6 ms-3 text-[#8750F7]' />
                                        <p className='text-[#8750F7] text-[13px] ms-1 mt-6'>
                                            ({post.commentCount || 0})
                                        </p>
                                    </div>
                                    <div className='ms-5 w-[210px] res-width bld mt-1 text-wrap'>
                                        {addElipsis(post.title, 45)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </div>
    );
};

export default Toprated;
