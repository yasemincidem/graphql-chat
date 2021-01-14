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
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '800px',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 800,
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
