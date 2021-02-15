import { Button, Dialog, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_USER_TO_CHANNEL, CHANNELS_QUERY, GET_USERS_QUERY } from './queryAndMutations';

const AddNewYear = (props) => {
  const { classes, openModalDirectMessages, toggleModalDirectMessages, user, directMessages, selectedChannelIdForAddingUser } = props;
  const [selectedUserId, setUserId] = useState('');
  const [addUserToChannel] = useMutation(ADD_USER_TO_CHANNEL, {
    refetchQueries: [{ query: CHANNELS_QUERY, variables: { userId: user._id } }],
  });
  const { loading, error, data } = useQuery(GET_USERS_QUERY);
  const allUsers = data && Object.keys(data).length ? data.getUsers : [];
  const filteredAllUsers =
    allUsers && allUsers.length ? allUsers.filter((u) => u._id !== user._id) : [];
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
  return (
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
  );
};
export default AddNewYear;
