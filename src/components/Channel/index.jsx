import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ChannelLists from './List';
import Navbar from '../Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
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
  return (
    <div>
      <Navbar />
      <div>
        {data.channels.map((channel) => (
          <div>{channel.name}</div>
        ))}
      </div>
    </div>
  );
};
export default Channels;
