import React from 'react';
import PropTypes from 'prop-types';

const NewMessage = ({ email, messages = [] }) => {
  const messageFilter = messages.filter((message) => message.receiver === email);
  return messageFilter.length;
};

NewMessage.propTypes = {
  email: PropTypes.string,
  messages: PropTypes.object,
};

export default NewMessage;
