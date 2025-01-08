import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logoi from '../../Assets/blglogo-removebg-preview.png';
import { BsPersonCircle } from "react-icons/bs";
import { DataContext } from '../../context/Dataprovider';
import user from '../../Assets/new_img.png';
import '../banner/banner.css';
const BASE_URL = process.env.REACT_APP_API_URL;

const navigation = [
    { name: 'Home', to: '/', current: false },
    { name: 'Post', to: '/create', current: false },
    { name: 'Your Posts', to: '/user-posts', current: false },
    { name: 'Services', to: '#', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const { account } = useContext(DataContext);

    return (
        <>
            <Disclosure as="nav" className="bg-[#291c36] z-[1000] fixed top-0 w-full px-10">
                {({ open }) => (
                    <>
                        <div className="flex h-16 items-center justify-between ">
                            <div className="flex items-center">
                                <Link to="/" >
                                    <img src={logoi} width={80} alt="Logo" className="" />
                                </Link>
                                <div className="hidden sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.to}
                                                className={classNames(
                                                    item.current ? 'text-white' : 'text-gray-300 hover:bg-[#111827] hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-transparent text-sm ">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        {account.image ?
                                            <div className='h-8 w-8 me-5 rounded-full text-white' >
                                                <img
                                                    src={
                                                        (account.image ? `data:image/png;base64,${account.image}` : user)
                                                    }
                                                    className='h-auto w-[200px] rounded-full'
                                                    alt="User profile"
                                                />
                                            </div> :
                                            <BsPersonCircle className=' text-white h-8 w-8 me-5' />
                                        }
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            Your Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            Settings
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a href="/login" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            Sign out
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                            <div className="-mr-2 flex sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        to={item.to}
                                        className={classNames(
                                            item.current ? 'text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    );
}