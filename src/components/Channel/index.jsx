import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Grid,
  Card,
  TextField,
  FormControl,
  Button,
  Dialog,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Add } from '@material-ui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStyles } from './styles';
import Messages from './Messages';
import Navbar from '../Navbar';

export const CHANNELS_QUERY = gql`
  query channels($userId: String!, $before: String) {
    channels(userId: $userId) {
      _id
      name
      description
      isDirectMessage
      posts(last: 25, before: $before) {
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
      users {
        _id
        email
        name
        surname
      }
    }
  }
`;
export const GET_USERS_QUERY = gql`
  query {
    getUsers {
      _id
      email
      name
      surname
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
const ADD_USER_TO_CHANNEL = gql`
  mutation AddPeopleToChannel($channelId: ID, $name: String, $owner: String, $email: String!) {
    addPeopleToChannel(
      input: { email: $email, owner: $owner, channelId: $channelId, name: $name }
    ) {
      _id
      name
      users {
        _id
        name
      }
    }
  }
`;
const NEW_USER_ADDED_SUBSCRIPTION = gql`
  subscription {
    newUserAddedToChannel {
      _id
      name
      description
      isDirectMessage
    }
  }
`;
const Channels = (props) => {
  const user = props.location?.state?.params || {};
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openDirectMessages, setOpenDirectMessages] = useState(true);
  const [channelId, setChannel] = useState('');
  const [openModal, toggleModal] = useState(false);
  const [openModalDirectMessages, toggleModalDirectMessages] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [descriptionName, setDescriptionName] = useState('');
  const [selectedUserId, setUserId] = useState('');
  const [selectedChannelIdForAddingUser, setChannelIdForAddingUser] = useState(null);
  const [notificationIds, setNotificationId] = useState([]);

  const [createChannel, { data: dataCreatedChannel }] = useMutation(CREATE_CHANNEL, {
    refetchQueries: [{ query: CHANNELS_QUERY, variables: { userId: user._id } }],
  });

  const [addUserToChannel, { data: dataAddUserToChannel }] = useMutation(ADD_USER_TO_CHANNEL, {
    refetchQueries: [{ query: CHANNELS_QUERY, variables: { userId: user._id } }],
  });

  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(GET_USERS_QUERY);
  const allUsers = dataUsers && Object.keys(dataUsers).length ? dataUsers.getUsers : [];
  const filteredAllUsers =
    allUsers && allUsers.length ? allUsers.filter((u) => u._id !== user._id) : [];
  const { loading, error, data, fetchMore, subscribeToMore } = useQuery(CHANNELS_QUERY, {
    variables: { userId: user._id },
  });

  useEffect(() => {
    subscribeToMore({
      document: NEW_USER_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        let channels = [];
        if (!prev.channels.find((channel) => channel._id === subscriptionData._id)) {
          channels = [...prev.channels, subscriptionData];
        }
        return { channels };
      },
    });
  }, []);
  if (loading)
    return (
      <div className={classes.channelLoading}>
        <CircularProgress color="primary" />
      </div>
    );
  if (error) return <div>Error in fetching channels</div>;

  const allChannels =
    data && data.channels ? data.channels.filter((channel) => !channel.isDirectMessage) : [];

  const directMessages =
    data && data.channels ? data.channels.filter((channel) => channel.isDirectMessage) : [];

  if (allChannels && allChannels.length && !channelId) {
    setChannel(allChannels[0]._id);
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickDirectMessages = () => {
    setOpenDirectMessages(!openDirectMessages);
  };

  const selectChannel = (channelId) => {
    setNotificationId(notificationIds.filter((item) => item.to !== channelId));
    setChannel(channelId);
  };

  const createNewChannel = () => {
    createChannel({
      variables: { name: channelName, description: descriptionName, email: user.email },
    });
    toggleModal(false);
  };

  const createNewDirectMessageGroup = () => {
    const channelId = selectedChannelIdForAddingUser;
    const selectedUser = filteredAllUsers.find((user) => user._id === selectedUserId);
    if (channelId) {
      addUserToChannel({
        variables: {
          email: selectedUser.email,
          channelId,
        },
      });
    } else {
      if (
        !directMessages.find(
          (i) =>
            i.name === `${selectedUser.name}, ${user.name}` ||
            i.name === `${user.name}, ${selectedUser.name}`,
        )
      ) {
        addUserToChannel({
          variables: {
            name: `${selectedUser.name}, ${user.name}`,
            owner: user.email,
            email: selectedUser.email,
          },
        });
      }
    }
    toggleModalDirectMessages(false);
  };

  const handleChangeUser = (event) => {
    setUserId(event.target.value);
  };

  console.log('channel');
  return (
    <div className={classes.container}>
      <Navbar userName={`${user.name} ${user.surname}`} />
      <Grid container>
        <Grid item xs={2}>
          <Card className={classes.paper} style={{ backgroundColor: 'rgb(97 68 94)' }}>
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
              <ListItem>
                <ListItem button onClick={handleClick} className={classes.clickableIcons}>
                  {open ? (
                    <ExpandLess style={{ color: 'rgb(211, 203, 210)' }} />
                  ) : (
                    <ExpandMore style={{ color: 'rgb(211, 203, 210)' }} />
                  )}
                </ListItem>
                <ListItemText
                  primary="Channels"
                  disableTypography
                  className={classes.drawerItems}
                />
                <ListItem
                  button
                  className={classes.clickableIcons}
                  onClick={() => toggleModal(true)}
                >
                  <Add style={{ color: 'rgb(211, 203, 210)' }} />
                </ListItem>
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.list}>
                  {allChannels.map((channel) => (
                    <ListItem
                      button
                      onClick={() => selectChannel(channel._id)}
                      selected={channelId === channel._id}
                      style={
                        channelId === channel._id
                          ? { backgroundColor: 'rgb(140, 88, 136)' }
                          : { backgroundColor: 'transparent' }
                      }
                      key={channel._id}
                    >
                      <ListItemText
                        secondary={`#\t${channel.name}`}
                        disableTypography
                        className={classes.drawerItems}
                        style={{
                          color: notificationIds.find(
                            (i) => i.to === channel._id && i.from !== user._id,
                          )
                            ? 'white'
                            : 'rgb(211,203,210)',
                          fontWeight: notificationIds.find(
                            (i) => i.to === channel._id && i.from !== user._id,
                          )
                            ? 'bold'
                            : '400',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
              <ListItem>
                <ListItem
                  button
                  onClick={handleClickDirectMessages}
                  className={classes.clickableIcons}
                >
                  {openDirectMessages ? (
                    <ExpandLess style={{ color: 'rgb(211, 203, 210)' }} />
                  ) : (
                    <ExpandMore style={{ color: 'rgb(211, 203, 210)' }} />
                  )}
                </ListItem>
                <ListItemText
                  primary="Direct Messages"
                  disableTypography
                  className={classes.drawerItems}
                />
                <ListItem
                  button
                  className={classes.clickableIcons}
                  onClick={() => toggleModalDirectMessages(true)}
                >
                  <Add style={{ color: 'rgb(211, 203, 210)' }} />
                </ListItem>
              </ListItem>
              <Collapse in={openDirectMessages} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className={classes.list}>
                  {directMessages.map((channel) => (
                    <ListItem
                      button
                      style={
                        channelId === channel._id
                          ? { backgroundColor: 'rgb(140, 88, 136)' }
                          : { backgroundColor: 'transparent' }
                      }
                      onClick={() => selectChannel(channel._id)}
                      selected={channelId === channel._id}
                      key={channel._id}
                    >
                      <ListItemText
                        secondary={`#\t${channel.name}`}
                        disableTypography
                        className={classes.drawerItems}
                        style={{
                          color: notificationIds.find(
                            (i) => i.to === channel._id && i.from !== user._id,
                          )
                            ? 'white'
                            : 'rgb(211,203,210)',
                          fontWeight: notificationIds.find(
                            (i) => i.to === channel._id && i.from !== user._id,
                          )
                            ? 'bold'
                            : '400',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </List>
          </Card>
        </Grid>
        <Grid item xs={10}>
          <Card className={classes.paper2}>
            {!channelId && <div className={classes.channelNotFound}>Channel is not found</div>}
            {channelId && (
              <Messages
                user={props.location?.state?.params || ''}
                classes={classes}
                fetchMore={fetchMore}
                subscribeToMore={subscribeToMore}
                data={data}
                loading={loading}
                channelId={channelId}
                addUserToChannel={(id) => {
                  setChannelIdForAddingUser(id);
                  toggleModalDirectMessages(true);
                }}
                setNotificationId={(node) => {
                  notificationIds.push(node);
                  if (
                    node.from !== user._id &&
                    data.channels.find((channel) => node.to === channel._id)
                  ) {
                    toast(node.text);
                  }
                  setNotificationId(notificationIds);
                }}
              />
            )}
          </Card>
        </Grid>
      </Grid>
      <Dialog className={classes.modal} open={openModal} onClose={() => toggleModal(false)}>
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
            <Button variant="contained" color="default">
              Create
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        className={classes.modal}
        open={openModalDirectMessages}
        onClose={() => toggleModalDirectMessages(false)}
      >
        <div className={classes.paperModal}>
          <h2 id="transition-modal-title">Add user to send a direct message</h2>
          <div style={{ marginTop: '5%' }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">User</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectedUserId || ''}
                onChange={handleChangeUser}
                label="User"
              >
                {filteredAllUsers.length
                  ? filteredAllUsers.map((u) => (
                      <MenuItem value={u._id} key={u._id}>{`${u.name} ${u.surname}`}</MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </div>
          <div
            className={classes.createBtnGroup}
            onClick={() => (selectedUserId ? createNewDirectMessageGroup() : null)}
          >
            <Button variant="contained" color="default">
              Add
            </Button>
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </div>
  );
};
export default Channels;
