import React from 'react';
import { categoriesdata } from '../../constant/data';
import { Link } from 'react-router-dom';
import './home.css';

const Categories = () => {
    return (
        <div className='sticky res_display top-[35px]' >
            <div className='flex justify-center' >
                <div>
                    <div className='bg-[#F6F3FC]  flex py-3 justify-center rounded-[8px] mt-16'>
                        <Link to={`/create`}>
                            <button className='mt-1 tj-btn-primary_post'>
                                <div className='w-[100px]'>Create Blog</div>
                            </button>
                        </Link>
                    </div>
                    <div className='bg-[#F6F3FC] p-5 mt-3  rounded-[8px]' >
                        <div className='text-center w-[220px] max-[1150px]:w-[190px] cursor-pointer  font-bold text-lg tracking-wide text-[#8750F7]'>
                            <Link to="/">ALL CATEGORIES</Link>
                        </div>
                        <div className='border-b pt-3' />
                        <div className=''>
                            {categoriesdata.map(category => (
                                <div key={category.id} className='' >
                                    <div className=' ' >
                                        <Link to={`/?category=${category.type}`}>
                                            <div className='text-center border-b cursor-pointer py-3'>{category.type}</div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
