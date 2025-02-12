import Xlayout from "@/components/Layout/XLayout";
import {GetServerSideProps, NextPage} from "next";
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image"; 
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import React, { useCallback, useMemo } from 'react';
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import { followUserMutation, unfollowUserMutation } from '@/graphql/mutation/user';
import { useQueryClient } from '@tanstack/react-query';

interface ServerProps {
    userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
    const {user: currentUser} = useCurrentUser();
    const queryClient = useQueryClient();


    const amIFollowing = useMemo(() => {
        if(!props.userInfo) return  false;
        return (
            (currentUser?.following?.findIndex(
                (el) => el?.id === props.userInfo?.id
            ) ?? -1) >= 0 
        );
    },[currentUser?.id, props.userInfo]);

    const handleFollowUser = useCallback( async () => {
        if(!props.userInfo?.id) return;

        await graphqlClient.request(followUserMutation, { to: props.userInfo?.id})
        await queryClient.invalidateQueries({queryKey: ['currentuser']})
    },[props.userInfo?.id, queryClient]);

    const handleUnFollowUser = useCallback( async () => {
        if(!props.userInfo?.id) return;

        await graphqlClient.request(unfollowUserMutation, { to: props.userInfo?.id})
        await queryClient.invalidateQueries({queryKey: ['currentuser']})
    },[props.userInfo?.id, queryClient]);

   

    
    return (
        <div>
            <Xlayout>
                <div>
                    <nav className=" flex items-center gap-8 py-1 px-3">
                    <IoMdArrowBack className="text-xl"/>
                    <div>
                        <h1 className="text-2xl font-bold">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
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
                            <h1 className="text-2xl font-bold mt-5 ">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
                            <div className='flex justify-between items-center'>
                            <div className='flex gap-4 mt-2 text-sm text-gray-400'>
                                <span>{props.userInfo?.followers?.length} followers</span>
                                <span>{props.userInfo?.following?.length} following</span>
                            </div>
                            {
                               currentUser?.id !== props.userInfo?.id && (
                               <>
                                    {
                                        amIFollowing ? (
                                        <button onClick={handleUnFollowUser} className='bg-white text-black py-1 px-3 rounded-full font-bold'>
                                            Unfollow
                                        </button>
                                        ) : (
                                        <button onClick={handleFollowUser} className='bg-white text-black py-1 px-3 rounded-full font-bold'>
                                            Follow</button>)
                                    }
                               </>
                            )}
                            </div>
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