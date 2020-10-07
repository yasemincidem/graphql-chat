import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ChannelLists from './List';
const CHANNELS_QUERY = gql`
  query {
    channels {
      _id
      name
    }
  }
`;
const Channels = () => {
  const { loading, error, data } = useQuery(CHANNELS_QUERY);
  if (loading) return <div>Channels loading ...</div>;
  if (error) return <div>Error in fetching channels</div>;
  return data.channels.map((channel) => <div>{channel.name}</div>);
};
export default Channels;
