import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Navbar from '../Navbar';
import { List, ListItem, ListItemText, Collapse, Grid, Card } from '@material-ui/core';
import { ExpandLess, ExpandMore, Add, BlurOnSharp } from '@material-ui/icons';
import { useStyles } from './styles';
import Messages from './Messages';
import Modal from '@material-ui/core/Modal/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField/TextField';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Button from '@material-ui/core/Button/Button';

export const CHANNELS_QUERY = gql`
  query channels($userId: String!, $before: String) {
    channels(userId: $userId) {
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
const CREATE_CHANNEL = gql`
  mutation CreateChannel($name: String!, $description: String, $email: String!) {
    createChannel(input: { name: $name, description: $description, email: $email }) {
      _id
      name
      description
    }
  }
`;
const Channels = (props) => {
  const user = props.location?.state?.params || {};
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [channelId, setChannel] = useState('');
  const [openModal, toggleModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [descriptionName, setDescriptionName] = useState('');

  const [createChannel] = useMutation(CREATE_CHANNEL);
  const { loading, error, data, fetchMore, subscribeToMore } = useQuery(CHANNELS_QUERY, {
    variables: { userId: user._id },
  });
  if (loading) return <div>Channels loading ...</div>;
  if (error) return <div>Error in fetching channels</div>;

  const handleClick = () => {
    setOpen(!open);
  };

  const selectChannel = (channelId) => {
    setChannel(channelId);
  };

  const createNewChannel = () => {
    createChannel({
      variables: { name: channelName, description: descriptionName, email: user.email },
    });
  };

  return (
    <div className={classes.container}>
      <Navbar />
      <Grid container>
        <Grid item xs={3}>
          <Card className={classes.paper}>
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
              <ListItem>
                <ListItem button onClick={handleClick} className={classes.clickableIcons}>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <ListItemText primary="Channels" />
                <ListItem
                  button
                  className={classes.clickableIcons}
                  onClick={() => toggleModal(true)}
                >
                  <Add />
                </ListItem>
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.list}>
                  {data.channels.map((channel) => (
                    <ListItem
                      button
                      onClick={() => selectChannel(channel._id)}
                      selected={channelId === channel._id}
                      key={channel._id}
                    >
                      <BlurOnSharp className={classes.channelIcon} />
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
            <Messages
              user={props.location?.state?.params || ''}
              classes={classes}
              fetchMore={fetchMore}
              subscribeToMore={subscribeToMore}
              data={data}
              loading={loading}
              channelId={channelId}
            />
          </Card>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={() => toggleModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paperModal}>
            <h2 id="transition-modal-title">Create Channel</h2>
            <FormControl fullWidth>
              <TextField
                id="channel-name"
                label="Name"
                variant="outlined"
                color="secondary"
                onChange={(event) => setChannelName(event.target.value)}
              />
            </FormControl>
            <div style={{ marginTop: '5%' }}>
              <FormControl fullWidth>
                <TextField
                  id="channel-description"
                  label="Description (Optional)"
                  variant="outlined"
                  color="secondary"
                  onChange={(event) => setDescriptionName(event.target.value)}
                />
              </FormControl>
            </div>
            <div className={classes.createBtnGroup} onClick={() => createNewChannel()}>
              <Button variant="contained" color="primary">
                Create
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
export default Channels;
