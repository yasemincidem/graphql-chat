import React, { useEffect, useRef, useState } from 'react';
import { useMutation, gql, useSubscription } from '@apollo/client';
import { FormControl, List } from '@material-ui/core';
import { ValidationTextField } from './styles';
import Message from './Message';

const SEND_MESSAGE = gql`
  mutation SendMessage($to: String!, $from: String!, $text: String!) {
    sendMessage(input: { to: $to, from: $from, text: $text }) {
      text
      created_at
      from
      to
    }
  }
`;
const MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      text
      to
      from
      created_at
    }
  }
`;
const Messages = (props) => {
  const { classes, fetchMore, data, channelId, loading, user } = props;
  console.log('channelId', channelId);
  const messageEl = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const { data: messageAdded, loading: loadingSubscription, error } = useSubscription(
    MESSAGES_SUBSCRIPTION,
  );
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const channel =
    data && data.channels.length ? data.channels.find((channel) => channel._id === channelId) : {};
  const initMessages =
    channel && Object.keys(channel).length ? channel.posts.edges.map((i) => i.node) : [];
  const pageInfo = channel && Object.keys(channel).length ? channel.posts.pageInfo : {};

  useEffect(() => {
    setMessages(initMessages);
  }, [initMessages && initMessages.length]);

  useEffect(() => {
    console.log('messageAdded', messageAdded);
    if (messageAdded && messageAdded.newMessage && messageAdded.newMessage.to) {
      const channel1 =
        data && data.channels.length ? data.channels.find((channel) => channel._id === messageAdded.newMessage.to) : {};
      const initMessages1 =
        channel1 && Object.keys(channel1).length ? channel1.posts.edges.map((i) => i.node) : [];
      const allMessages = [...initMessages1, messageAdded.newMessage];
      setMessages(allMessages);
    }
  }, [messageAdded]);

  useEffect(() => {
    messageEl.current.addEventListener('scroll', handleScroll);
    return () => messageEl.current.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    if (messageEl.current.scrollTop === 0 && pageInfo.hasPreviousPage) {
      const cursors =
        channel && Object.keys(channel).length ? channel.posts.edges.map((i) => i.cursor) : [];
      const cursor = cursors && cursors.length ? cursors[cursors.length - 1] : '';
      return fetchMore({
        variables: {
          before: cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const channels = prev.channels.map((i) => ({
            name: i.name,
            _id: i._id,
            posts: {
              pageInfo: fetchMoreResult.channels.find((t) => t._id === i._id).posts.pageInfo,
              edges: [
                ...i.posts.edges,
                ...fetchMoreResult.channels.find((m) => m._id === i._id).posts.edges,
              ],
            },
          }));
          return { channels };
        },
      });
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      sendMessage({
        variables: {
          from: user._id,
          to: channelId,
          text: message,
        },
      });
    }
  };
  return (
    <div className={classes.buttonWrapper}>
      {loading && <div>Loading</div>}
      <List className={classes.messagesGroup} ref={messageEl}>
        {messages && messages.length
          ? messages
              .sort((a, b) => a.created_at - b.created_at)
              .map((message, index) => (
                <Message index={index} message={message} classes={classes} />
              ))
          : null}
      </List>
      <FormControl fullWidth className={classes.margin}>
        <ValidationTextField
          className={classes.margin}
          label="Text Message"
          onKeyDown={keyPress}
          onChange={handleChange}
          required
          variant="outlined"
          id="validation-outlined-input"
        />
      </FormControl>
    </div>
  );
};
export default Messages;
