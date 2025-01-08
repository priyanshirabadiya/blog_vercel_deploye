import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";
import { Link, useSearchParams } from 'react-router-dom';
import { addElipsis, getAccessToken } from '../../../constant/utils/comman-utils';
import defaultpostimg from '../../../Assets/blog-4.jpg';
import './posts.css';
const BASE_URL = process.env.REACT_APP_API_URL;

const Posts = ({ searchQuery }) => {
    const [posts, setPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let url = `${BASE_URL}/post/getall`;
                if (category) {
                    url += `?category=${category}`;
                }

                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getAccessToken(),
                    },
                });
                let data = await response.json();
                // console.log("Fetched Posts:", data); // Log fetched posts
                if (response.ok) {
                    setPosts(data.posts);
                } else {
                    console.error('Failed to fetch posts:', response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error in fetching posts:", error);
            }
        };
        fetchPosts();
    }, [category]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    const url = defaultpostimg;

    const renderStars = (averageRating) => {
        const totalStars = 5;
        const filledStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 !== 0;
        // console.log("Filled stars",filledStars);
        // console.log("Half stars",hasHalfStar);
        return (
            <>
                {Array.from({ length: filledStars }).map((_, ind) => (
                    <FaStar key={ind} className="text-yellow-400 me-[2px]" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 me-[2px]" />}
                {Array.from({ length: totalStars - filledStars - (hasHalfStar ? 1 : 0) }).map((_, ind) => (
                    <FaRegStar key={ind} className="text-[#2a1454] me-[2px]" />
                ))}
            </>
        );
    };

    return (
        <div className='p-5 manage_padding mb-10 '>
            {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post, ind) => (
                    <div key={ind}>
                        <div className='pb-1 bg-[#F6F3FC] h-auto post_widths rounded-[11px] mt-10'>
                            <div className='flex justify-center'>
                                <img
                                    className='h-[25rem] post_widths for_height rounded-t-[11px]'
                                    src={post.image || url}
                                    alt="Post Image"
                                />
                            </div>
                            <div className='p-5 pt-0 pb-0'>
                                <div className='flex justify-between wrapped_cls flex-wrap'>
                                    <div className='flex max-[1034px]:flex-wrap wrapped_cls text-[#8750F7]'>
                                        <FaRegUser className='h-5 w-4 mt-[21px]' />
                                        <p className='mt-5 ms-1'>{post.userName}</p>
                                        <IoCalendarOutline className='h-5 w-5 mt-5 max-[1034px]:ms-2 ms-5' />
                                        <p className='mt-5 ms-1'>{new Date(post.createdDate).toLocaleDateString()}</p>
                                        <TbCategory className='h-5 w-5 mt-5 ms-5 max-[1034px]:ms-2' />
                                        <p className='mt-5 ms-1'>{post.categories}</p>
                                    </div>
                                    <div className='flex justify-start me-3 mt-5'>
                                        {renderStars(post.averageRating || 0)}
                                    </div>
                                </div>
                                <p className="text-[#8750F7] text-[25px] mt-3 mb-1 font-bold">
                                    {addElipsis(post.title, 90)}
                                </p>
                                <p className='text-[16px] text-[#2a1454] text-wrap mb-1 font-bold'>
                                    {addElipsis(post.description, 200)}
                                </p>
                                <div className='m-5'>
                                    <Link to={`/details/${post._id}`} >
                                        <button className='tj-btn-primary'>Read More</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className='bg-[#F6F3FC] post_widths mt-10 h-[30rem] font-500 flex items-center justify-center text-[20px]' >No data available.</div>
            )}
        </div>
    );
};

export default Posts;
