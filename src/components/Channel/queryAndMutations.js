import { gql } from '@apollo/client';

export const CHANNELS_QUERY = gql`
  query channels($userId: String!, $before: String) {
    channels(userId: $userId) {
      _id
      name
      description
      isDirectMessage
      posts(last: 25, before: $before) {
        pageInfo {
          hasPreviousPage
          matchCount
        }
        edges {
          cursor
          node {
            to
            from
            text
            created_at
          }
        }
      }
      users {
        _id
        email
        name
        surname
      }
    }
  }
`;
export const GET_USERS_QUERY = gql`
  query {
    getUsers {
      _id
      email
      name
      surname
    }
  }
`;
export const CREATE_CHANNEL = gql`
  mutation CreateChannel($name: String!, $description: String, $email: String!) {
    createChannel(input: { name: $name, description: $description, email: $email }) {
      _id
      name
      description
    }
  }
`;
export const ADD_USER_TO_CHANNEL = gql`
  mutation AddPeopleToChannel($channelId: ID, $name: String, $owner: String, $email: String!) {
    addPeopleToChannel(
      input: { email: $email, owner: $owner, channelId: $channelId, name: $name }
    ) {
      _id
      name
      users {
        _id
        name
      }
    }
  }
`;
export const NEW_USER_ADDED_SUBSCRIPTION = gql`
  subscription {
    newUserAddedToChannel {
      _id
      name
      description
      isDirectMessage
    }
  }
`;
