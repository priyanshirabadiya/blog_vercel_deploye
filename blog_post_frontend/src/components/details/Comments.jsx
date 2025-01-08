import React, { useState, useContext, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import './detailsView.css';
import { formatDistanceToNowStrict } from 'date-fns';
import { DataContext } from '../../context/Dataprovider';
import { getAccessToken } from '../../constant/utils/comman-utils';
const BASE_URL = process.env.REACT_APP_API_URL;

let initialValues = {
    userName: '',
    postId: '',
    date: new Date(),
    comment: '',
    image: '',
}

const Comments = ({ post }) => {
    const [comment, setComment] = useState(initialValues);
    const [allcomments, setAllcomments] = useState([]);
    const [value, setValue] = useState('');
    const [postUser, setPostUser] = useState('');
    const { account } = useContext(DataContext);
    //  console.log("data of comments:", account);
    useEffect(() => {
        setComment({ ...comment })
    }, [account]);

    var loggedUserName = account.userName;
    initialValues.userName = account.userName;
    initialValues.image = account.image;
    const handlecommentchange = (e) => {
        setComment({
            ...comment,
            postId: post._id,
            comment: e.target.value,
            image: account.image,
            userName: account.userName
        })
        setValue(e.target.value);
    }

    let token = getAccessToken().split(" ")[1];
    const addComment = async () => {
        const response = await fetch(`${BASE_URL}/post/addcomment`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...comment,
                date: new Date()
            })
        });
        const data = await response.json();
        // console.log("what we set in comment:", data);
        if (response.ok) {
            alert("Comment added..");
            setComment({ ...initialValues, date: new Date() });
            setValue('');
        } else {
            console.error('Failed to add comment:', data.message);
        }
    }
    useEffect(() => {
        // console.log("post id from comment", post._id);
        const fetchallcomments = async () => {
            try {
                let response = await fetch(`${BASE_URL}/post/allcomments/${post._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                let data = await response.json();
                //  console.log("What we get in data:", data);
                if (response.ok) {
                    const sorteddata = data.comments.sort((a, b) => new Date(b.date) - new Date(a.date))
                    setAllcomments(sorteddata);
                    setPostUser(data.postUser);
                }
            } catch (error) {
                //  console.log("Error in show post in main page:", error);
            }
        }
        fetchallcomments();
    }, [post._id, comment]);

    const deleteComment = async (commentId) => {
        try {
            let response = await fetch(`${BASE_URL}/post/deletecomment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getAccessToken()
                }
            })
            let data = await response.json();
            if (response.ok) {
                //  console.log("deleted data is :: ", data);
                alert("comment Deleted successfully...");
                setAllcomments(allcomments.filter(comment => comment._id !== commentId));
            }
        } catch (error) {
             console.log('Can not delete comment :', error);
        }
    }

    const formatCommentDate = (date) => {
        if (date && !isNaN(new Date(date).getTime())) {
            return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
        } else {
            return "Invalid date";
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setAllcomments([...allcomments]);
        }, 0);
        return () => clearInterval(interval);
    }, [allcomments]);


    return (
        <div className=''>
            {/* Comment Input Section */}
            <div className='flex mx-14 max-[365px]:flex-wrap max-[365px]:mx-2 mb-[50px] justify-between'>
                {/* Display User Image */}
                {comment.image ?
                    <div className='border-2 border-[#c5b1ef] rounded-full w-[45px] h-[45px] mt-2 flex justify-center items-center'>
                        <img src={`data:image/png;base64,${comment.image}`} className='rounded-full' alt="" />
                    </div> :
                    <div className='border-2 rounded-full w-[45px] h-[45px] mt-2 flex justify-center items-center'>
                        <FaUser className='w-[30px] h-[20px]' />
                    </div>
                }
                {/* Comment Input Field */}
                <div className='p-2 comm_txt'>
                    <input
                        type="text"
                        placeholder='Add comment here...'
                        className='p-5'
                        value={value}
                        onChange={(e) => handlecommentchange(e)}
                    />
                </div>
                {/* Add Comment Button */}
                <div className='pb-[1rem]  published_btn max-[365px]:m-5 max-[365px]:flex max-[365px]:flex-end'>
                    <button className='px-10 py-2 rounded text-white tj-btn-primary_post' onClick={() => addComment()}>Add comment</button>
                </div>
            </div>
            {/* Comments Display Section */}
            <div className='flex justify-center'>
                <div>
                    {allcomments.map((comment, ind) => (
                        <div key={ind} className="comment-item mx-10 all_comments flex justify-between pt-3 pb-[5px] mb-4 border-b border-gray-300 max-[365px]:mx-0 ">
                            <div className='flex'>
                                {/* Display Comment User Image */}
                                {comment.image ?
                                    <div className='border-2 ms-3 rounded-full w-[45px] h-[45px] mt-0 flex justify-center items-center'>
                                        <img src={`data:image/png;base64,${comment.image}`} className='rounded-full' alt="" />
                                    </div> :
                                    <div className='border-2 rounded-full w-[45px] h-[45px] -ms-3 flex justify-center items-center'>
                                        <FaUser className='w-[30px] h-[20px]' />
                                    </div>
                                }
                                {/* Comment Details */}
                                <div className='mt-0  ms-2'>
                                    <div className="flex">
                                        <p className="text-[#3D2176] font-bold max-[365px]:text-[14px]">{comment.userName || "Anonymous"}</p>
                                        <div className='text-gray-400 text-sm ms-3 max-[365px]:hidden'>
                                            {formatCommentDate(comment.date)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-start max-[365px]:text-[14px]'>{comment.comment}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Delete Button */}
                            {(comment.userName === loggedUserName || loggedUserName === postUser) && (
                                <button onClick={() => deleteComment(comment._id)}>
                                    <i className="fa-solid  fa-trash me-3 ms-3 px-3 rounded-[5px] mt-0 cursor-pointer" style={{ color: "black" }} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Comments;