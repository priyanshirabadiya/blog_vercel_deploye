import React, { useState } from 'react';
import '../home.css';
import { IoSearchOutline } from "react-icons/io5";
import Toprated from './Toprated';

const Searching = ({ onSearch }) => {
    const [searchQuery, setsearchQuery] = useState('');

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setsearchQuery(query);
        onSearch(query);
    }

    return (
        <>
            <div className='sticky top-[100px] right-0' >
                <div className='mt-[65px] manage_mt bg-[#F6F3FC] rounded items-center flex justify-center h-[100px] wid_for_search ' >
                    <div className="tj-widget__search flex justify-center rounded form_group ">
                        <form className="search-form flex bg-[#F6F3FC]" action="#" method="get">
                            <div>
                                <input
                                    type="search"
                                    className='border '
                                    id="search"
                                    name="search"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className='' >
                                <button className="search-btn" type="submit">
                                    <IoSearchOutline />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='dis_manage' >
                    <Toprated />
                </div>
            </div>
        </>
    )
}

export default Searching
