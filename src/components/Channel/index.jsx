import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Navbar from '../Navbar';
import { useStyles } from './styles';
import {
  Grid,
  Paper,
  ListSubheader,
  ListItemIcon,
  ListItem,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, List, StarBorder } from '@material-ui/icons';

const CHANNELS_QUERY = gql`
  query {
    channels {
      _id
      name
    }
  }
`;
const Channels = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { loading, error, data } = useQuery(CHANNELS_QUERY);
  if (loading) return <div>Channels loading ...</div>;
  if (error) return <div>Error in fetching channels</div>;
  const handleClick = () => {
    setOpen(!open);
  };
  console.log('data', data);
  return (
    <div>
      <Navbar />
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <Paper className={classes.paper}>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Nested List Items
                </ListSubheader>
              }
              className={classes.root}
            >
              <ListItem button onClick={handleClick}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Channels" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Paper>
        </Grid>
        <Grid item sm={8}>
          <Paper className={classes.paper}>xs=12 sm=6</Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Channels;
