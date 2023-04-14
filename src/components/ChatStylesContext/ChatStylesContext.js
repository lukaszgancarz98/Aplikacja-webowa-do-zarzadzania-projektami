import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const ChatStylesContext = createContext();

export const ChatStylesProvider = ({ children }) => {
  const chatStyles = {
    chatStylesOne: {
      position: 'fixed',
      right: '17%',
      bottom: '1%',
      height: '30%',
      width: '15%',
      alignItems: 'center',
      border: '3px solid gray',
    },
    chatStylesTwo: {
      position: 'fixed',
      right: '33%',
      bottom: '1%',
      height: '30%',
      width: '15%',
      alignItems: 'center',
      border: '3px solid gray',
    },
    buttonsendOne: {
      position: 'fixed',
      bottom: '1.5%',
      right: '17.00%',
    },
    buttonsendTwo: {
      position: 'fixed',
      bottom: '1.5%',
      right: '33.02%',
    },
    buttonCloseModalOne: {
      position: 'fixed',
      bottom: '27.5%',
      right: '17%',
      fontSize: 'large',
    },
    buttonCloseModalTwo: {
      position: 'fixed',
      bottom: '27.5%',
      right: '33%',
      fontSize: 'large',
    },
    buttonModalOne: {
      position: 'fixed',
      bottom: '27.5%',
      right: '18.5%',
      fontSize: 'large',
    },
    buttonModalTwo: {
      height: 'auto',
      width: 'auto',
      position: 'fixed',
      bottom: '27.5%',
      right: '34.5%',
      fontSize: 'large',
    },
  };
  const mainStyles = [chatStyles.chatStylesOne, chatStyles.chatStylesTwo];
  const secondaryStyles = [chatStyles.buttonsendOne, chatStyles.buttonsendTwo];
  const buttonStyles = [chatStyles.buttonModalOne, chatStyles.buttonModalTwo];
  const buttonCloseStyles = [chatStyles.buttonCloseModalOne, chatStyles.buttonCloseModalTwo];
  return (
    <ChatStylesContext.Provider
      value={{ mainStyles, secondaryStyles, buttonStyles, buttonCloseStyles }}
    >
      {children}
    </ChatStylesContext.Provider>
  );
};

ChatStylesProvider.propTypes = {
  children: PropTypes.any,
};
