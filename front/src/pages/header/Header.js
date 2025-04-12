import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../images/logoMain.png";
import { MdMenu } from "react-icons/md";
import 'react-modern-drawer/dist/index.css';
function Header(props) {
    return (
        <div className={"bg-primary-600"}>
        <div className="blur-container text-start ">
            <nav id='blur-header' className='h-[50px]  transition-all border-b-slate-300 duration-300 md:h-24 max-w-screen-xl mx-auto  border-b-[1px] flex items-center justify-between flex-wrap w-full'>
                <Link to={"/"}>
                    <img className='h-8 md:h-14 pl-4 filter contrast-more' alt='logo' src={logo} />
                </Link>
                <div className=' items-center h-12 '>
                    <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-dark m-0 p-0 text-right hover:text-gray-300 transition-colors duration-200">
                        2025-2026-o'quv yili uchun qabul
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-dark m-0 p-0 text-right hover:text-gray-400 transition-colors duration-200">
                        Tel: +998 55 309-99-99
                    </p>

                </div>

            </nav>
        </div>



        </div>
    );
}

export default Header;
