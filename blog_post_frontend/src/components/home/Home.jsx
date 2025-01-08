import React, { useState } from "react";
import Banner from '../banner/Banner';
import Categories from "./Categories";
import './home.css';
import './posts/posts.css';
import Posts from "./posts/Posts";
import Searching from "./serching&rating/Searching";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <>
            <Banner />
            <div className="flex justify-center mt-3 mb-10" >
                <div className="flex justify-center flex-wrap max-[600px]:justify-center  max-[625px]:justify-normal max-[625px]:flex-wrap-reverse" >
                    <div className="flex justify-center " >
                        <div className="">
                            <Categories />
                        </div>
                        <div className=" mb-10 flex justify-center mt-1 text-start">
                            <Posts searchQuery={searchQuery} />
                        </div>
                    </div>
                    <div className="" >
                        <Searching onSearch={handleSearch} />
                    </div>
                </div>
            </div>
        </>
    )
}
