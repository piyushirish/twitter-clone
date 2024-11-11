import { getCurrentUserQuery } from "@/graphql/query/user"
import { graphqlClient } from "@/clients/api";
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['currentuser'],
        queryFn: () => graphqlClient.request(getCurrentUserQuery),
    });

    return { ...query, user: query.data?.getCurrentUser };
};
