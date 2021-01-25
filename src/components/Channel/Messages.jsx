import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, gql, useSubscription } from '@apollo/client';
import {
  Avatar,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ValidationTextField } from './styles';

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
  }, [JSON.stringify(messages) !== JSON.stringify(initMessages)]);

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
  let allMessages = messages;
  if (
    messageAdded &&
    messageAdded.newMessage &&
    channelId === messageAdded.newMessage.to) {
    allMessages = [...allMessages, messageAdded.newMessage];
  }
  return (
    <div className={classes.buttonWrapper}>
      {loading && <div>Loading</div>}
      <List className={classes.messagesGroup} ref={messageEl}>
        {allMessages && allMessages.length
          ? allMessages
              .sort((a, b) => a.created_at - b.created_at)
              .map((message, index) => (
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <div style={{ marginRight: 15 }}>
                      <Avatar src="/static/images/avatar/1.jpg" />
                    </div>
                    <ListItemText
                      secondary={message.text}
                      primary={
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`${user.name} ${user.surname}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
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
