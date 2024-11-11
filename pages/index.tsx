import Image from "next/image";
import React, { useCallback, useState } from "react";
 import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { IoImageOutline } from "react-icons/io5";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Maybe, Tweet, User } from "@/gql/graphql";
import Xlayout from "@/components/Layout/XLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";


interface HomeProps {
  tweets?: Tweet[]
}


export default function Home(props: HomeProps) {

  const {user} = useCurrentUser();
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


  
  return (
    <div >
      <Xlayout>
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
            props.tweets?.map((tweet) =>
              tweet ? <FeedCard key={tweet.id} data={tweet as unknown as Tweet} /> : null
            )
          } 
      </Xlayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async(context) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};