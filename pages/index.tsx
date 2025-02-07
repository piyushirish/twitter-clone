import Image from "next/image";
import React, { useCallback, useState } from "react";
 import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { IoImageOutline } from "react-icons/io5";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet} from "@/gql/graphql";
import Xlayout from "@/components/Layout/XLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";


interface HomeProps {
  tweets?: Tweet[]
}


export default function Home(props: HomeProps) {

  const {user} = useCurrentUser();
  const {tweets = props.tweets as Tweet[]} = useGetAllTweets()

  const {mutateAsync} = useCreateTweet();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");


  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return;

      const {getSignedURLForTweet} = await graphqlClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type
      }) 

      if(getSignedURLForTweet) {
        toast.loading("Uploading...", { id: '2'})
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            'Content-Type': file.type
          }
        })
        toast.success("Upload Completed", {id: '2'})

        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`
        setImageURL(myFilePath)
      }
    };
  }, [])



  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*');

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener('change',handlerFn);

    input.click();


  },[handleInputChangeFile])

  const handleCreateTweet = useCallback(async () => {
    await mutateAsync({
      content,
      imageURL,
    });
    setContent("");
    setImageURL("");
  }, [content, mutateAsync,imageURL]);


  
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
              {
                imageURL && 
                <Image 
                src={imageURL} 
                alt="tweet-image" 
                width={300} 
                height={300}/>
              }
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
            tweets ?.map((tweet) =>
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