"use client";

import { IoChatboxEllipsesOutline, IoPersonCircleOutline, IoAddCircleOutline, IoTrashOutline, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface User {
  name: string;
  image: string;
}

export const SidebarRoomItem = () => {
  // useState with explicit boolean type
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // useRef with HTMLElement type for DOM elements, initialized to null
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close drozdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion for event.target to Node to use contains()
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for mousedown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Explicitly type the users array
  const users: User[] = [
    { name: 'Sala 2', image: '/docs/images/people/profile-picture-1.jpg' },
    { name: 'Robert Gough', image: '/docs/images/people/profile-picture-2.jpg' },
    { name: 'Bonnie Green', image: '/docs/images/people/profile-picture-3.jpg' },
    { name: 'Leslie Livingston', image: '/docs/images/people/profile-picture-4.jpg' },
    { name: 'Michael Gough', image: '/docs/images/people/profile-picture-5.jpg' },
    { name: 'Joseph Mcfall', image: '/docs/images/people/profile-picture-2.jpg' },
    { name: 'Roberta Casas', image: '/docs/images/people/profile-picture-3.jpg' },
    { name: 'Neil Sims', image: '/docs/images/people/profile-picture-1.jpg' },
  ];

  return (
    <>
      <button
        id="dropdownUsersButton"
        ref={buttonRef} // Assign ref to the button
        onClick={toggleDropdown}
        style={{ color: 'var(--sidebar-text)' }}
        type="button"
        className="cursor-pointer flex p-2 mt-1 text-gray-900 rounded-lg dark:text-white group sidebar-menu-item-link w-full"
      >
        <IoChatboxEllipsesOutline size={24} className="shrink-0 w-5 h-5 mr-2.5 transition duration-75 menu-icon" />

        Mis chats{' '}
        <svg
          className="w-3 h-3 ms-4 mt-[0.5vh]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      <div
        id="dropdownUsers"
        ref={dropdownRef} // Assign ref to the dropdown div
        className={`z-10 bg-white rounded-lg shadow-sm w-60 dark:bg-[var(--sidebar-box)] ${isDropdownOpen ? 'block' : 'hidden'}`}
      >
        <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
          {users.map((user, index) => (
            <li key={index}>
              <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-[var(--background)] dark:hover:text-white">
                <Image
                  className="w-6 h-6 me-2 rounded-full"
                  src={user.image}
                  alt={`${user.name} image`}
                  width={24} // Specify width for optimization
                  height={24} // Specify height for optimization
                />
                {user.name}
              </a>
            </li>
          ))}
        </ul>
        {/* <a href="#" className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"> */}
        {/*   <svg */}
        {/*     className="w-4 h-4 me-2" */}
        {/*     aria-hidden="true" */}
        {/*     xmlns="http://www.w3.org/2000/svg" */}
        {/*     fill="currentColor" */}
        {/*     viewBox="0 0 20 18" */}
        {/*   > */}
        {/*     <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" /> */}
        {/*   </svg> */}
        {/*   Add new user */}
        {/* </a> */}
      </div>
    </>
  );
};
