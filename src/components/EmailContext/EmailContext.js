import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const emergencyEmail = 'error';
  const emailStorage = JSON.parse(localStorage.getItem('email'));
  const [email, setEmail] = useState(emailStorage === null ? emergencyEmail : emailStorage);
  const newEmail = (value) => {
    localStorage.setItem('email', JSON.stringify(value));
    setEmail(value);
  };
  return (
    <EmailContext.Provider value={{ email, setEmail, newEmail }}>{children}</EmailContext.Provider>
  );
};

EmailProvider.propTypes = {
  children: PropTypes.any,
};
