import {useRouter} from 'next/router';
import Xlayout from "@/components/Layout/XLayout";
import {GetServerSideProps, NextPage} from "next";
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image"; 
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import React from 'react';
import { graphql } from '@/gql';
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import { resolveObjectURL } from 'buffer';

interface ServerProps {
    userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
    const router = useRouter();

   

    
    return (
        <div>
            <Xlayout>
                <div>
                    <nav className=" flex items-center gap-8 py-1 px-3">
                    <IoMdArrowBack className="text-xl"/>
                    <div>
                        <h1 className="text-2xl font-bold">Piyush pal</h1>
                        <h1 className="text-md text-slate-500">{props.userInfo?.tweets?.length} posts</h1>
                    </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {props.userInfo?.profileImageURL && (
                            <Image 
                            src={props.userInfo?.profileImageURL} 
                            alt="user-image" 
                            className="rounded-full"
                            width={100} 
                            height={100}/>)
                            }
                            <h1 className="text-2xl font-bold mt-5 ">Piyush pal</h1>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map((tweet) => (
                            <FeedCard data={tweet as Tweet} key={tweet?.id} />))}
                    </div>
                </div>
            </Xlayout>
        </div>
    )
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined;

    if(!id) return {notFound: true, props: {user: undefined}};

    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if(!userInfo?.getUserById) return {notFound: true}

    return {
        props: {
            userInfo: userInfo.getUserById as User, 
        },
    };
};

export default UserProfilePage;