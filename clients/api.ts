import {GraphQLClient} from 'graphql-request';
import { QueryClient } from '@tanstack/react-query';

const isClient = typeof window !=="undefined";

export const graphqlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_API_URL as string,
    {
        headers: {
            Authorization: isClient
                ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
                : "",
        },
    }
);
