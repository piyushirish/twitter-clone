import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { BiHash, BiHomeCircle, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { FaXTwitter } from "react-icons/fa6";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface XlayoutProps {
  children: React.ReactNode;
}

const Xlayout: React.FC<XlayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      { title: "Home", icon: <BiHomeCircle />, link: "/" },
      { title: "Explore", icon: <BiHash />, link: "/" },
      { title: "Notifications", icon: <BsBell />, link: "/" },
      { title: "Messages", icon: <BsEnvelope />, link: "/" },
      { title: "Bookmarks", icon: <BsBookmark />, link: "/" },
      { title: "Premium", icon: <FaXTwitter />, link: "/" },
      { title: "Profile", icon: <BiUser />, link: `/${user?.id}` },
      { title: "More", icon: <CgMoreO />, link: "/" },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token not found");

      try {
        const { verifyGoogleToken } = await graphqlClient.request(
          verifyUserGoogleTokenQuery,
          { token: googleToken }
        );
        if (verifyGoogleToken) {
          window.localStorage.setItem("__twitter_token", verifyGoogleToken);
          toast.success("Verified successfully");
          await queryClient.invalidateQueries({ queryKey: ["currentuser"] });
        }
      } catch (error) {
        console.error("Google token verification failed:", error);
        toast.error("Verification failed, please try again");
      }
    },
    [queryClient]
  );

  return (
    <div className="grid grid-cols-12 h-screen w-screen sm:px-20">
      <div className="hidden sm:flex sm:col-span-3 pt-4 pr-10 relative">
        <div>
          <div className="text-3xl h-fit w-fit mx-2 hover:bg-gray-800 rounded-full p-2 cursor-pointer transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-4 text-xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2 w-fit cursor-pointer mt-2"
                    href={item.link}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-2">
              <button className="hidden sm:block bg-[#1c9bef] hover:bg-sky-600 text-lg font-semibold px-4 py-2 w-full rounded-full">
                Tweet
              </button>
              <button className="block sm:hidden bg-[#1c9bef] hover:bg-sky-600 text-lg font-semibold px-3 py-2 w-full rounded-full">
                <FaXTwitter />
              </button>
            </div>
          </div>
        </div>

        {user && (
          <div className="absolute bottom-5 flex gap-2 items-center hover:bg-gray-800 rounded-full px-3 py-2 sm:pr-14 cursor-pointer">
            {user?.profileImageURL && (
              <Image
                className="rounded-full"
                src={user?.profileImageURL}
                alt="user-image"
                height={40}
                width={40}
              />
            )}
            <div className="hidden sm:block">
              <h3 className="text-xl">{user.firstName} {user.lastName}</h3>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 sm:col-span-6 border-r-[1px] border-l-[1px] border-gray-700 h-screen overflow-scroll">
        {props.children}
      </div>

      <div className="hidden sm:block sm:col-span-3 p-5">
        {!user ? (
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-xl">New to X</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        ) : (
          <div className="px-5 py-3 bg-slate-800 rounded-lg">
            <h1 className="my-2 text-xl mb-5">Users you may know</h1>
            {user?.recommendedUsers?.map((el) => (
              <div className="flex items-center gap-3 mt-2" key={el?.id}>
                {el?.profileImageURL && (
                  <Image
                    src={el?.profileImageURL}
                    alt="user-image"
                    className="rounded-full"
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <div className="text-lg">
                    {el?.firstName} {el?.lastName}
                  </div>
                  <Link
                    href={`/${el?.id}`}
                    className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sm:hidden fixed bottom-0 w-full bg-black border-t border-gray-700 flex justify-around py-3">
  {!user ? (
    <GoogleLogin onSuccess={handleLoginWithGoogle} />
  ) : (
    sidebarMenuItems.map((item) => (
      <Link key={item.title} href={item.link} className="text-white text-2xl">
        {item.icon}
      </Link>
    ))
  )}
</div>


    </div>
  );
};

export default Xlayout;
