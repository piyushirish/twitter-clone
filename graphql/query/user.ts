import exp from "constants";
import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      lastName
    }
  }
`)