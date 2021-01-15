import React, { useCallback, useEffect, useRef } from 'react';
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

const Messages = (props) => {
  const { classes, messages, fetchMore, setMessages, data, channelId } = props;
  const loader = useRef(null);
  const channel =
    data && data.channels.length ? data.channels.find((channel) => channel._id === channelId) : {};
  const cursor = 'NWY3MzBiMzA2NGIxYzQzMmJmYmJkODFk';
  const pageInfo = channel && Object.keys(channel).length ? channel.posts.pageInfo : {};
  // here we handle what happens when user scrolls to Load More div
  // in this case we just update page variable
  const loadMore = useCallback((entries) => {
    const target = entries[0];
    console.log('pageInfo', pageInfo);
    console.log('target', target.intersectionRatio);
    if (target.intersectionRatio === 0 && pageInfo.hasPreviousPage) {
      console.log('s', cursor);
      fetchMore({
        variables: {
          before: cursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          console.log('prev', prev);
          console.log('fetchMoreResult', fetchMoreResult);
        }
      });
    }
  });
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(loadMore, options);
    if (loader && loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.unobserve(loader.current);
  }, [loader, loadMore]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      messages.push();
      setMessages([...messages, { from: 0, message: e.target.value }]);
    }
  };

  return (
    <div className={classes.buttonWrapper}>
      <List className={classes.messagesGroup}>
        {messages && messages.length
          ? messages.map((message) => (
              <>
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
              </>
            ))
          : null}
        <div className="loading" ref={loader}>
          <h2>Load More</h2>
        </div>
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
