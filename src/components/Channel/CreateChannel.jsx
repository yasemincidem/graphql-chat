import React from 'react';
import { Button, Dialog, FormControl, TextField } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CREATE_CHANNEL, CHANNELS_QUERY } from './queryAndMutations';

const CreateChannel = (props) => {
  const {
    classes,
    channelName,
    descriptionName,
    user,
    toggleModal,
    openModal,
    setChannelName,
    setDescriptionName,
  } = props;
  const [createChannel] = useMutation(CREATE_CHANNEL, {
    refetchQueries: [{ query: CHANNELS_QUERY, variables: { userId: user._id } }],
  });

  const createNewChannel = () => {
    createChannel({
      variables: { name: channelName, description: descriptionName, email: user.email },
    });
    toggleModal(false);
  };
  return (
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
  );
};
export default CreateChannel;
