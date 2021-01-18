import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Navbar from '../Navbar';
import { List, ListItem, ListItemText, Collapse, Grid, Card } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useStyles } from './styles';
import Messages from './Messages';

const CHANNELS_QUERY = gql`
  query channels($before: String) {
    channels {
      _id
      name
      posts(last: 10, before: $before) {
        pageInfo {
          hasPreviousPage
          matchCount
        }
        edges {
          cursor
          node {
            to {
              _id
              name
              surname
            }
            from {
              _id
              name
              surname
            }
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
  const [channelId, setChannel] = useState('');

  const { loading, error, data, fetchMore } = useQuery(CHANNELS_QUERY);
  if (loading) return <div>Channels loading ...</div>;
  if (error) return <div>Error in fetching channels</div>;

  const handleClick = () => {
    setOpen(!open);
  };

  const selectChannel = (channelId) => {
    setChannel(channelId);
  };

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
            <Messages classes={classes} fetchMore={fetchMore} data={data} channelId={channelId || data.channels[0]._id} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
export default Channels;
