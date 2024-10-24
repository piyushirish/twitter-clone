import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";

const FeedCard: React.FC = () => {
    return <div className="border border-r-0 border-l-0 border-gray-700 border-b-0 p-3 hover:bg-gray-900 cursor-pointer transition-all">
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-1  ">
                <Image src="https://pbs.twimg.com/profile_images/1685493839686144000/5ySwkrUb_400x400.jpg" alt="user-image" width={50} height={50} className="rounded-full" />
            </div>
            <div className="col-span-11">
                <h5 className="font-semibold px-1">
                    Piyush Pal</h5>
                    <p className="p-1 py-0">
                    Develop applications that empower users to control their data. Innovate with Affinidi’s data and identity technology stack. Are you ready to lead the next wave ?
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
