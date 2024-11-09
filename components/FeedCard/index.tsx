import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import { Tweet } from "@/gql/graphql";

export interface FeedCardProps {
    data: Tweet;
    }

export const FeedCard: React.FC<FeedCardProps> = (props) => {
    const {data} = props
    return <div className="border border-r-0 border-l-0 border-gray-700 border-b-0 p-3 hover:bg-gray-900 cursor-pointer transition-all">
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-1  ">
               {data.author?.profileImageURL && <Image 
                src={data.author.profileImageURL} 
                alt="user-image" 
                width={50} 
                height={50} className="rounded-full" />}
            </div>
            <div className="col-span-11">
                <h5 className="font-semibold px-1"> 
                    {data.author?.firstName} {data.author?.lastName}
                </h5>
                    <p className="p-1 py-0">
                        {data.content}
                    </p>
                    <div className="flex justify-between mt-4 text-xl pr-4">
                        <div>
                        <BiMessageRounded />
                        </div>
                        <div>
                        <FaRetweet />
                        </div>
                        <div>
                        <FiHeart />
                        </div>
                        <div>
                        <FaRegBookmark/>
                        </div>
                        <div>
                        <BiUpload />
                        </div>
                    </div>
            </div>  
        </div>
    </div>
}

export default FeedCard;
