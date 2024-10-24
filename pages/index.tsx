import Image from "next/image";
import {BsBell, BsBookmark, BsEnvelope, BsTwitter} from 'react-icons/bs'
import {BiHash, BiHomeCircle, BiUser} from 'react-icons/bi'
import React from "react";
import { title } from "process";
import FeedCard from "@/components/FeedCard";
import { FaXTwitter } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";

interface TwitterSidebarButton{
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />
  },
  {
    title: "Explore",
    icon:<BiHash />
  },
  {
    title:"Notifications",
    icon: <BsBell />
  },
  {
    title:"Messages",
    icon: <BsEnvelope />
  },
  {
    title:"Bookmarks",
    icon:<BsBookmark />
  },
  {
    title:"Premium",
    icon:<FaXTwitter />
  },
  {
    title:"Profile",
    icon: <BiUser /> 
  },
  {
    title:"More",
    icon: <CgMoreO /> 
  }

];



export default function Home() {
  return (
    <div >
      <div className="grid grid-cols-12 h-screen w-screen px-20 ">
        <div className="col-span-3  pt-4 px-4   ">
          <div className="text-3xl h-fit w-fit  hover:bg-gray-800 rounded-full p-2  cursor-pointer transition-all ">
          <FaXTwitter/>
          </div>
          <div className="mt-4 text-2xl pr-4">  
            <ul>
            {sidebarMenuItems.map((item) => (
              <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4  py-2 w-fit cursor-pointer mt-2  " key={item.title}>
               <span className="text-2xl">{item.icon}</span>
                <span>{item.title}</span> 
                </li> ))}
            </ul>
            <div className="mt-5  px-4  ">
            <button className="bg-[#1c9bef] text-lg font-semibold px-4 py-2 w-full rounded-full ">Tweet</button>
            </div>
          </div>
        </div>
        <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-700 h-screen overflow-scroll ">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
