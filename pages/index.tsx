import Image from "next/image";
import {BsBell, BsBookmark, BsEnvelope, BsTwitter} from 'react-icons/bs';
import {BiHash, BiHomeCircle, BiUser} from 'react-icons/bi';
import React, { useCallback } from "react";
import { title } from "process";
import FeedCard from "@/components/FeedCard";
import { FaXTwitter } from "react-icons/fa6";
import { CgMoreO } from "react-icons/cg";
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import toast from "react-hot-toast";
import { GraphQLClient } from "graphql-request";
import { graphqlClient } from "@/clients/api";
import { Token } from "graphql";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueries, useQueryClient } from "@tanstack/react-query";

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

  const {user} = useCurrentUser();
  const queryClient = useQueryClient();

  console.log(user);

  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;
    if (!googleToken) return toast.error('Google Token not found');
  
    try {
      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );
      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
        toast.success('Verified successfully');
        await queryClient.invalidateQueries({ queryKey: ['currentuser']});
      }
    } catch (error) {
      console.error('Google token verification failed:', error);
      toast.error('Verification failed, please try again');
    }
  }, [queryClient]
);
  
  return (
    <div >
      <div className="grid grid-cols-12 h-screen w-screen px-20 ">
        <div className="col-span-3  pt-4 px-4 relative">
          <div className="text-3xl h-fit w-fit  hover:bg-gray-800 rounded-full p-2  cursor-pointer transition-all ">
          <FaXTwitter/>
          </div>
          <div className="mt-4 text-xl pr-4">  
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
          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center hover:bg-gray-800 rounded-full px-3 py-2">
              {user && user.profileImageURL && (
                <Image className="rounded-full" 
                  src={user?.profileImageURL} 
                  alt="user-image" 
                  height={50} 
                  width={50} 
                />
              )}
              <div>
              <h3 className="text-xl"> {user.firstName} {user.lastName} </h3>
              </div>
          </div>
        )}
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
        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg ">
              <h1 className="my-2 text-xl">New to X</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
