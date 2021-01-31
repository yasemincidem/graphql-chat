import styled from 'styled-components';
import { makeStyles, TextField, withStyles } from '@material-ui/core';

export const StyledChannelListWrapper = styled.div``;
export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '850px',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 850,
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '300px',
  },
  container: {
    flexGrow: 1,
  },
  margin: theme.spacing(1),
  buttonWrapper: { position: 'absolute', bottom: 20, width: '97%' },
  iconButton: {
    padding: 10,
  },
  messagesGroup: {
    overflow: 'auto',
    height: '680px',
  },
  list: {
    paddingLeft: '10%',
  },
  clickableIcons: {
    width: '15%',
  },
  channelIcon: {
    paddingRight: 10,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnGroup: {
    float: 'right',
    marginTop: '10%',
  },
}));
export const ValidationTextField = withStyles({
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
