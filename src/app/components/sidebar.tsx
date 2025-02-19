"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { FaBeer, FaReact } from 'react-icons/fa';
import PageSearchComponent from "./ui/pageSearchComp";

const Sidebar = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState("/file.svg");

  const handleClick = () => {
    router.push("/dashboard");
  };

  const handleClickHome = () => {
    router.push("/dashboard/home");
  };

  const handleClickProject = () => {

  }
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("New profile :", reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 h-screen fixed  text-black shadow-2xl p-5  ">

      <div className="flex flex-col items-center mb-5">
        <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 shadow-lg border-4 border-gray-600">
          <img
            src={profileImage}
            alt="Profile"
            className="object-cover w-full h-full"
          />
          <label
            htmlFor="profileImageInput"
            className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-xs text-black">Change</span>
          </label>
        </div>
        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <h2 className="text-2xl text-black  mb-10 text-center  ">Dashboard</h2>
      <ul className="space-y-4 text-black">
        <li
          className="flex items-center justify-start gap-3 cursor-pointer hover:text-gray-400 transition-colors"
          onClick={handleClickHome}
        >
          <HomeIcon className="w-5 h-5 text-black" />
          <span className="text-lg font-medium">Home</span>
        </li>
        <li
          className="flex items-center justify-start gap-3 cursor-pointer hover:text-gray-400 transition-colors"
          onClick={handleClick}
        >
          <UserIcon className="w-5 h-5 text-black" />
          <span className="text-lg font-medium">Users</span>
        </li>
        <li
          className="flex items-center justify-start gap-3 cursor-pointer hover:text-gray-400 transition-colors"
          onClick={handleClickProject}
        >
          <FaReact className="w-5 h-5 text-black" />
          <span className="text-lg font-medium">Projects</span>
        </li>
      </ul>

    </div>
  );
};

export default Sidebar;
