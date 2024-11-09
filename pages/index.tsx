import Image from "next/image";
import {BsBell, BsBookmark, BsEnvelope, BsTwitter} from 'react-icons/bs';
import {BiHash, BiHomeCircle, BiUser} from 'react-icons/bi';
import React, { useCallback, useState } from "react";
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
import { IoImageOutline } from "react-icons/io5";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Maybe, Tweet, User } from "@/gql/graphql";

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
  const {tweets = []} = useGetAllTweets();
  const queryClient = useQueryClient();
  const {mutate} = useCreateTweet()

  const [content, setContent] = useState("")



  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*');
    input.click();
  },[])

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    },
    {
      onSuccess: () =>{
        setContent("");
      },
    }
    
  );

  }, [content, mutate]);

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
            <div className="absolute bottom-5 flex gap-2 items-center hover:bg-gray-800 rounded-full px-3 py-2 cursor-pointer">
              {user && user.profileImageURL && (
                <Image className="rounded-full" 
                  src={user?.profileImageURL} 
                  alt="user-image" 
                  height={40} 
                  width={40} 
                />
              )}
              <div>
              <h3 className="text-xl"> {user.firstName} {user.lastName} </h3>
              </div>
          </div>
        )}
        </div>
        <div className="col-span-6 border-r-[1px] border-l-[1px] border-gray-700 h-screen overflow-scroll ">
          <div>
          <div className="border border-r-0 border-l-0 border-gray-700 border-b-0 p-3 hover:bg-gray-900 cursor-pointer transition-all">
          <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1  ">
                {user?.profileImageURL && (
                <Image 
                className="rounded-full "
                src={user?.profileImageURL} 
                alt="user-image" 
                width={50} 
                height={50}  
                />)}
            </div>
            <div className="col-span-11 ">
              <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              className=" w-full bg-transparent text-xl border-b border-slate-700" 
              placeholder="What is happening?!"
              rows={3}> 
              </textarea>
              <div className="mt-2 flex justify-between items-center">
              <IoImageOutline onClick={handleSelectImage} className="text-xl" />
              <button onClick={handleCreateTweet}
              className="bg-[#1c9bef] text-lg font-semibold px-4 py-1 rounded-full ">Post</button>

              </div>

            </div>
          </div>
          </div>
          </div>
          {
            tweets?.map((tweet) =>
              tweet ? <FeedCard key={tweet.id} data={tweet as unknown as Tweet} /> : null
            )
          } 

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
