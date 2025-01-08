import React from 'react'
import './banner.css';

const Banner = () => {
    return (
        <div>
            <div className='set_banner_bg_main' ></div>
            <div className='set_banner_bg items-center align-middle flex justify-center' >
                <div>
                    <h1 className='font-bold leading-[60px] text-center' >BLOG</h1>
                    <p className='text-center mt-3'>Blog application</p>
                </div>
            </div>
        </div>
    )
}

export default Banner;