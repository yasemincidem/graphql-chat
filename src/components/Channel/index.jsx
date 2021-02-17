import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Grid, Card, CircularProgress } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStyles } from './styles';
import Messages from './Messages';
import Navbar from '../Navbar';
import Drawer from './Drawer';
import CreateChannel from './CreateChannel';
import { CHANNELS_QUERY, CREATE_CHANNEL, NEW_USER_ADDED_SUBSCRIPTION } from './queryAndMutations';
import AddNewUser from './AddNewUser';

const Channels = (props) => {
  const user = props.location?.state?.params || {};
  const classes = useStyles();
  const [channelId, setChannel] = useState('');
  const [openModal, toggleModal] = useState(false);
  const [openModalDirectMessages, toggleModalDirectMessages] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [descriptionName, setDescriptionName] = useState('');
  const [notificationIds, setNotificationId] = useState([]);
  const [selectedChannelIdForAddingUser, setChannelIdForAddingUser] = useState(null);

  const { loading, error, data, fetchMore, subscribeToMore } = useQuery(CHANNELS_QUERY, {
    variables: { userId: user._id },
  });
  let [createChannel, { loading: loadingCreateChannel, error: errorCreateChannel }] = useMutation(
    CREATE_CHANNEL,
    {
      refetchQueries: [{ query: CHANNELS_QUERY, variables: { userId: user._id } }],
    },
  );

  useEffect(() => {
    if (errorCreateChannel && Object.keys(errorCreateChannel).length) {
      toast.error(errorCreateChannel.message);
    }
  }, [errorCreateChannel && Object.keys(errorCreateChannel).length]);

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

  return (
    <div className={classes.container}>
      <Navbar userName={`${user.name} ${user.surname}`} />
      <Grid container>
        <Grid item xs={2}>
          <Drawer
            classes={classes}
            setNotificationId={(item) => setNotificationId(item)}
            notificationIds={notificationIds}
            setChannel={(channelId) => setChannel(channelId)}
            toggleModalDirectMessages={(item) => toggleModalDirectMessages(item)}
            toggleModal={(item) => toggleModal(item)}
            directMessages={directMessages}
            allChannels={allChannels}
            user={user}
            channelId={channelId}
          />
        </Grid>
        <Grid item xs={10}>
          <Card className={classes.paper2}>
            {!(directMessages.length || allChannels.length) && (
              <div className={classes.channelNotFound}>Channel is not found</div>
            )}
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
      <CreateChannel
        classes={classes}
        channelName={channelName}
        descriptionName={descriptionName}
        user={user}
        openModal={openModal}
        toggleModal={(item) => toggleModal(item)}
        setChannelName={(name) => setChannelName(name)}
        setDescriptionName={(name) => setDescriptionName(name)}
        channels={data.channels}
        createChannel={(variables) => createChannel(variables)}
      />
      <AddNewUser
        classes={classes}
        openModalDirectMessages={openModalDirectMessages}
        toggleModalDirectMessages={(item) => toggleModalDirectMessages(item)}
        user={user}
        directMessages={directMessages}
        selectedChannelIdForAddingUser={selectedChannelIdForAddingUser}
      />
      <ToastContainer />
    </div>
  );
};
export default Channels;
