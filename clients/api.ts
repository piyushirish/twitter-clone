import {GraphQLClient} from 'graphql-request';
import { QueryClient } from '@tanstack/react-query';

const isClient = typeof window !=="undefined";

export const graphqlClient = new GraphQLClient(
    'http://localhost:8000/graphql',
    {
        headers: {
            Authorization: isClient
                ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
                : "",
        },
    }
);
