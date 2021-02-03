import React from 'react';
import { StyledChannelListWrapper } from './styles';
const ChannelList = () => {
  const mock_channels = [
    {
      _id: '5f7245377b845a22eeeeade2',
      name: 'pets',
      posts: {
        edges: [
          {
            node: {
              text: 'Hi new messagess343434',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmU2NGIxYzQzMmJmYmJkODE4',
          },
          {
            node: {
              text: 'Hi new messagesse35545545453',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmU2NGIxYzQzMmJmYmJkODE3',
          },
          {
            node: {
              text: 'Hi new messagess12123123',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmU2NGIxYzQzMmJmYmJkODE2',
          },
          {
            node: {
              text: 'Hi new messagess1121115666',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmQ2NGIxYzQzMmJmYmJkODE1',
          },
          {
            node: {
              text: 'Hi new messagess4',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmQ2NGIxYzQzMmJmYmJkODE0',
          },
          {
            node: {
              text: 'Hi new messagess3',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmI2NGIxYzQzMmJmYmJkODEz',
          },
          {
            node: {
              text: 'Hi new messagess2',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MzBiMmE2NGIxYzQzMmJmYmJkODEy',
          },
          {
            node: {
              text: 'Hi new message1',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MjQ2MjY3Yjg0NWEyMmVlZWVhZGU2',
          },
          {
            node: {
              text: 'Hi new message from yasemin33333',
              from: '5f7244fa7b845a22eeeeade1',
            },
            cursor: 'NWY3MjQ2MWE3Yjg0NWEyMmVlZWVhZGU1',
          },
        ],
        pageInfo: {
          hasPreviousPage: false,
        },
      },
    },
    {
      _id: '5f72453e7b845a22eeeeade3',
      name: 'kids',
      posts: {
        edges: [],
        pageInfo: {
          hasPreviousPage: false,
        },
      },
    },
  ];
  return (
    <StyledChannelListWrapper>
      {mock_channels.map((channel) => (
        <div>{channel.name}</div>
      ))}
    </StyledChannelListWrapper>
  );
};
export default ChannelList;
