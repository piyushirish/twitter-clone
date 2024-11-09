import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { graphql } from "@/gql"; // Assuming this is the correct path to your graphql setup

export const getAllTweetsQuery = graphql(`
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      author {
        firstName
        lastName
        profileImageURL
      }
    }
  }
`);
