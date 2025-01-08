import React, { useEffect, useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";
import './userposts.css';
import defaultpostimg from '../../Assets/blog-4.jpg';
import { addElipsis, getAccessToken } from './../../constant/utils/comman-utils';
import { Link } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_URL;

const UserPosts = () => {
    const [userposts, setUserPosts] = useState('');
    useEffect(() => {
        const fetchposts = async () => {
            const response = await fetch(`${BASE_URL}/post/user-posts`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': getAccessToken()
                }
            });
            if (response.ok) {
                let data = await response.json();
                // console.log("Data of user posts:=====", data);
                setUserPosts(data);
            } else {
                console.log('Failed to fetch posts:', response.status, response.statusText);
            }
        }
        fetchposts();
    }, []);
    return (
        <div className='text-[#8750F7] mb-[10px] mt-[90px] max-[768px]:justify-center' >
            <div className="flex justify-center  set_alignment mx-[5rem] p-5 flex-wrap ">
                {userposts && userposts.length > 0 ? (
                    userposts.map((post, ind) => (
                        <div key={ind} className="f_div manage_f max-[480px]:me-0 mt-3 bg-[#F6F3FC] ">
                            <div className='' >
                                <div className='flex justify-center set_img bg-gray-500'>
                                    <img src={post.image || defaultpostimg} className='img-h set_img' alt="Post Image" />
                                </div>
                                <div className='flex flex-wrap px-5 max-[360px]:mt-5 '>
                                    <FaRegUser className='h-5 w-4 mt-[21px]' />
                                    <p className='mt-5 ms-1'>{post.userId.userName}</p>
                                    <IoCalendarOutline className='h-5 w-5 mt-5 ms-5' />
                                    <p className='mt-5 ms-1'>{new Date(post.createdDate).toLocaleDateString()}</p>
                                    <TbCategory className='h-5 w-5 mt-5 ms-5' />
                                    <p className='mt-5 ms-1'>{post.categories}</p>
                                </div>
                                <div className=''>
                                    <div className='px-5 text-[30px] mt-3 w-[600px] cls_elips text-wrap text-[#8750F7] font-bold leading-[39px]'>
                                        Title: {addElipsis(post.title, 70)}
                                    </div>
                                    <p className='w-[600px] cls_elips mt-3 px-5'>Description: {addElipsis(post.description, 200)}</p>
                                </div>
                                <div className='m-5'>
                                    <Link to={`/details/${post._id}`} >
                                        <button className='tj-btn-primary'>Read More</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No Posts.</div>
                )}

            </div>
        </div >
    )
}

export default UserPosts;
