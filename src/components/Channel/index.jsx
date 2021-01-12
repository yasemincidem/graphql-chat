import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import ChannelLists from './List';
import Navbar from '../Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import List from '@material-ui/core/List/List';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import InboxIcon from '@material-ui/core/SvgIcon/SvgIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Collapse from '@material-ui/core/Collapse/Collapse';
import { ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons';
import { useStyles } from './styles';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import Card from '@material-ui/core/Card/Card';
import TextField from '@material-ui/core/TextField/TextField';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input/Input';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput/OutlinedInput';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider/Divider';
import Avatar from '@material-ui/core/Avatar/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar/ListItemAvatar';
import Typography from '@material-ui/core/Typography/Typography';

const CHANNELS_QUERY = gql`
  query {
    channels {
      _id
      name
    }
  }
`;
const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      padding: '4px !important', // override inline-style
    },
  },
})(TextField);
const mockMessages = [
  { from: 0, message: 'ssss' },
  { from: 1, message: 'asdsdadad' },
  { from: 1, message: 'kljhsdlkhjglkgkklhg' },
  { from: 0, message: 'lkhjsdklfhsdlkhdslkfh' },
  { from: 1, message: 'ljdşfhjsşkdlfjşdsfşdsfljsdflş' },
];
const Channels = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const [message, setMessage] = useState('');
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
    if(e.keyCode == 13){
      messages.push();
      setMessages([...messages, {from: 0, message: e.target.value}]);
      setMessage('');
    }
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
                    <ListItem button>
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
                {messages.map((m) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={m.message}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              Ali Connors
                            </Typography>
                            {" — I'll be in your neighborhood doing errands this…"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))}
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
