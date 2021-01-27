import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Avatar, Divider, ListItem, ListItemText, Typography } from '@material-ui/core';

export const GET_USER_QUERY = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      surname
      name
    }
  }
`;
const Message = (props) => {
  const { index, classes, message} = props;
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { id: message.from },
  });

  return (
    <div key={index}>
      <ListItem alignItems="flex-start">
        <div style={{ marginRight: 15 }}>
          <Avatar src="/static/images/avatar/1.jpg" />
        </div>
        <ListItemText
          secondary={message.text}
          primary={
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textPrimary"
            >
              {`${data?.getUser?.name || '--'} ${data?.getUser?.surname || '--'}`}
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </div>
  );
};
export default Message;
