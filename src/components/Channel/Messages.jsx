import React, { useEffect, useRef, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  FormControl,
  List,
  CircularProgress,
  Divider,
  Typography,
  Box,
  IconButton,
  Dialog,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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
      node {
        text
        to
        from
        created_at
      }
      cursor
    }
  }
`;

const Messages = (props) => {
  const { classes, fetchMore, subscribeToMore, data, channelId, user, addUserToChannel } = props;
  const messageEl = useRef(null);
  const [message, setMessage] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState('false');
  const [allUsersOfChannel, toggleAllUsersOfChannel] = useState(false);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editor = React.useRef(null);
  useEffect(() => {
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        const channels = prev.channels.map((i) => {
          if (i._id === subscriptionData.data.newMessage.node.to) {
            return {
              ...i,
              posts: {
                pageInfo: prev.channels.find((t) => t._id === i._id).posts.pageInfo,
                edges: [...i.posts.edges, subscriptionData.data.newMessage],
              },
            };
          } else {
            return i;
          }
        });
        return { channels };
      },
    });
  }, []);

  const channel =
    data && data.channels.length ? data.channels.find((channel) => channel._id === channelId) : {};
  const messages =
    channel && Object.keys(channel).length ? channel.posts.edges.map((i) => i.node) : [];
  const pageInfo = channel && Object.keys(channel).length ? channel.posts.pageInfo : {};

  useEffect(() => {
    messageEl.current.addEventListener('scroll', handleScroll);
    return () => messageEl.current.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', scrollToTheBottom);
    }
    return () => messageEl.current.removeEventListener('DOMNodeInserted', scrollToTheBottom);
  });

  const scrollToTheBottom = (event) => {
    const { currentTarget: target } = event;
    if (messageSuccess) {
      target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      setMessageSuccess(false);
    }
  };

  const handleScroll = () => {
    if (messageEl.current.scrollTop === 0 && pageInfo.hasPreviousPage) {
      const cursors =
        channel && Object.keys(channel).length ? channel.posts.edges.map((i) => i.cursor) : [];
      const cursor = cursors && cursors.length ? cursors[cursors.length - 1] : '';
      setLoadingMessages(true);
      return fetchMore({
        variables: {
          before: cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const channels = prev.channels.map((i) => ({
            ...i,
            posts: {
              pageInfo: {
                hasPreviousPage: fetchMoreResult.channels.find((t) => t._id === i._id).posts
                  .pageInfo.hasPreviousPage,
                matchCount:
                  fetchMoreResult.channels.find((t) => t._id === i._id).posts.edges.length +
                  i.posts.edges.length,
              },
              edges: [
                ...i.posts.edges,
                ...fetchMoreResult.channels.find((m) => m._id === i._id).posts.edges,
              ],
            },
          }));
          setLoadingMessages(false);
          return { channels };
        },
      });
    }
  };


  const keyPress = (e) => {
    if (e.keyCode == 13) {
      sendMessage({
        variables: {
          from: user._id,
          to: channelId,
          text: editorState,
        },
      });
      setMessageSuccess(true);
      setMessage('');
    }
  };
  const focusEditor = () => {
    editor.current.focus();
  };
  return (
    <div className={classes.buttonWrapper}>
      <div className={classes.messagesGroup} ref={messageEl}>
        {loadingMessages === true ? <CircularProgress color="secondary" /> : null}
        <div
          style={{
            flexDirection: 'row',
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography component="div">
            <Box
              fontWeight="fontWeightBold"
              fontSize="h6.fontSize"
              color="black"
              style={{ paddingLeft: 16 }}
            >
              {channel?.name ? `# ${channel.name}` : ''}
            </Box>
            <Box fontSize="normal" color="black" style={{ paddingLeft: 16 }}>
              {channel?.description || ''}
            </Box>
          </Typography>
          <div>
            {channel && channel.isDirectMessage === true ? null : (
              <IconButton onClick={() => addUserToChannel(channel._id)}>
                <PersonAddIcon />
              </IconButton>
            )}
            {channel && channel.isDirectMessage === true ? null : (
              <IconButton onClick={() => toggleAllUsersOfChannel(true)}>
                <PeopleIcon />
              </IconButton>
            )}
          </div>
        </div>
        <Divider />
        <List>
          {messages && messages.length
            ? messages
                .sort((a, b) => a.created_at - b.created_at)
                .map((message, index) => (
                  <Message index={index} message={message} classes={classes} />
                ))
            : null}
        </List>
      </div>
      <Editor
        defaultEditorState={editorState}
        onEditorStateChange={setEditorState}
        keyBindingFn={(event) => console.log('event', event)}
        wrapperClassName={classes.wrapperClass}
        editorClassName={classes.editorClass}
        toolbarClassName={classes.toolbarClass}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
        }}
      />
      <Dialog
        className={classes.modal}
        open={allUsersOfChannel}
        onClose={() => toggleAllUsersOfChannel(false)}
      >
        <div className={classes.paperModal}>
          <h2 id="transition-modal-title">{`${channel && channel.users.length} members in #${
            channel && channel.name
          }`}</h2>
          <div style={{ marginTop: '5%' }}>
            <FormControl variant="outlined" fullWidth>
              {channel && channel.users.length
                ? channel.users.map((u) => <div key={u._id}>{`${u.name} ${u.surname}`}</div>)
                : []}
            </FormControl>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default Messages;
