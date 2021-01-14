import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Navbar from '../Navbar';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Grid,
  Card,
  TextField,
  FormControl,
  withStyles,
  Divider,
  Avatar,
  ListItemAvatar,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useStyles, ValidationTextField } from './styles';

const CHANNELS_QUERY = gql`
  query {
    channels {
      _id
      name
      posts(last: 20) {
        pageInfo {
          hasPreviousPage
          matchCount
        }
        edges {
          node {
            to
            from
            text
            created_at
          }
        }
      }
    }
  }
`;

const Channels = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [channelId, setChannel] = useState('');

  const { loading, error, data } = useQuery(CHANNELS_QUERY);
  if (loading) return <div>Channels loading ...</div>;
  if (error) return <div>Error in fetching channels</div>;

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      messages.push();
      setMessages([...messages, { from: 0, message: e.target.value }]);
      setMessage('');
    }
  };

  const selectChannel = (channelId) => {
    setChannel(channelId);
    const channel =
      data && data.channels.length
        ? data.channels.find((channel) => channel._id === channelId)
        : {};
    const posts = channel && Object.keys(channel).length ? channel.posts.edges.map(i => i.node) : [];
    setMessages(posts);
  };

  console.log('messages', messages);

  return (
    <div className={classes.container}>
      <Navbar />
      <Grid container>
        <Grid item xs={3}>
          <Card className={classes.paper}>
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
              <ListItem button onClick={handleClick}>
                <ListItemText primary="Channels" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {data.channels.map((channel) => (
                    <ListItem
                      button
                      onClick={() => selectChannel(channel._id)}
                      selected={channelId === channel._id}
                    >
                      <ListItemText primary={channel.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card className={classes.paper}>
            <div className={classes.buttonWrapper}>
              <List className={classes.messagesGroup}>
                {messages && messages.length
                  ? messages.map((message) => (
                      <>
                        <ListItem alignItems="flex-start">
                          <div style={{ marginRight: 15 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
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
                                {message.from}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </>
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
                  value={message}
                  variant="outlined"
                  id="validation-outlined-input"
                />
              </FormControl>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
export default Channels;
