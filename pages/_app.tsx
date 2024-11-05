import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Inter, Quicksand } from "next/font/google";
import {GoogleOAuthProvider} from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';


const inter =  Inter({ subsets:["latin"]});
const quickSand = Quicksand({ subsets: ["latin"]});

const queryClient = new QueryClient()


export default function App({ Component, pageProps }: AppProps) {
  return (<div className={inter.className}>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="715409976993-g17lvl933tbbh8laes8iovvi7divo32g.apps.googleusercontent.com">
        <Component {...pageProps} />
         <Toaster />
         <ReactQueryDevtools />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </div>
  );
}
