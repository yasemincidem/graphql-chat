import React, { useState } from 'react';
import { Card, Collapse, List, ListItem, ListItemText } from '@material-ui/core';
import { Add, ExpandLess, ExpandMore } from '@material-ui/icons';

const Drawer = (props) => {
  const { classes, setNotificationId, notificationIds, setChannel, toggleModalDirectMessages, directMessages, user, allChannels, channelId, toggleModal } = props;
  const [open, setOpen] = useState(true);
  const [openDirectMessages, setOpenDirectMessages] = useState(true);
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

  return (
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
          <ListItemText primary="Channels" disableTypography className={classes.drawerItems} />
          <ListItem button className={classes.clickableIcons} onClick={() => toggleModal(true)}>
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
                    color: notificationIds.find((i) => i.to === channel._id && i.from !== user._id)
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
          <ListItem button onClick={handleClickDirectMessages} className={classes.clickableIcons}>
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
                    color: notificationIds.find((i) => i.to === channel._id && i.from !== user._id)
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
  );
};
export default Drawer;
