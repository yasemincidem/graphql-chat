import styled from 'styled-components';
import { makeStyles, TextField, withStyles } from '@material-ui/core';

export const StyledChannelListWrapper = styled.div``;
export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  paper: {
    color: '#ffffff',
    height: '874px',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 874,
  },
  paper2: {
    height: '874px',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 874,
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '300px',
  },
  container: {
    flexGrow: 1,
    margin: -8,
  },
  margin: theme.spacing(1),
  buttonWrapper: { position: 'absolute', bottom: 0, width: '99%' },
  iconButton: {
    padding: 10,
  },
  messagesGroup: {
    overflow: 'auto',
    height: '705px',
  },
  list: {
    paddingLeft: '10%',
  },
  clickableIcons: {
    width: '15%',
    right: 10,
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
  boldChannel: {
    fontWeight: 600,
  },
  wrapperClass: {
    padding: '0.7rem 0rem 0.7rem 0.7rem',
  },
  editorClass: {
    border: '1px solid #ccc',
    padding: '0px 0px 0px 5px',
    borderRadius: '0px 0px 5px 5px',
    borderColor: 'transparent black black',
  },
  toolbarClass: {
    borderRadius: '5px 5px 0px 0px',
    borderColor: 'black black #d6d6d6',
    backgroundColor: '#f1f1f1',
    marginBottom: 0,
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
