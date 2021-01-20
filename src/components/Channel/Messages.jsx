import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
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
import { CHANNELS_QUERY } from './index';
const SEND_MESSAGE = gql`
  mutation SendMessage($to: String!, $from: String!, $text: String!) {
    sendMessage(input: { to: $to, from: $from, text: $text }) {
      text
      created_at
      from {
        name
      }
      to {
        name
      }
    }
  }
`;
const Messages = (props) => {
  const { classes, fetchMore, data, channelId, loading } = props;
  const messageEl = useRef(null);
  const [message, setMessage] = useState('');
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    refetchQueries: [{ query: CHANNELS_QUERY }],
  });

  const channel =
    data && data.channels.length ? data.channels.find((channel) => channel._id === channelId) : {};
  const messages =
    channel && Object.keys(channel).length ? channel.posts.edges.map((i) => i.node) : [];
  const pageInfo = channel && Object.keys(channel).length ? channel.posts.pageInfo : {};

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
          from: '5f7244fa7b845a22eeeeade1',
          to: '5f7245377b845a22eeeeade2',
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
                          {`${message.from.name} ${message.from.surname}`}
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
