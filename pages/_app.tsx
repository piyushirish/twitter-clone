import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import {GoogleOAuthProvider} from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';


const inter =  Inter({ subsets:["latin"]});

export default function App({ Component, pageProps }: AppProps) {
  return (<div className={inter.className}>
    <GoogleOAuthProvider clientId="715409976993-g17lvl933tbbh8laes8iovvi7divo32g.apps.googleusercontent.com">
    <Component {...pageProps} />
    <Toaster />
    </GoogleOAuthProvider>
  </div>
  );
}
