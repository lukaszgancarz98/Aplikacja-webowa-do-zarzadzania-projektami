import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const falseFlag = false;
  const trueFlag = true;
  const storageShow = JSON.parse(localStorage.getItem('show'));
  const storageModalOne = JSON.parse(localStorage.getItem('modalOne'));
  const storageModalTwo = JSON.parse(localStorage.getItem('modalTwo'));
  const storageOpenChat = JSON.parse(localStorage.getItem('openChat'));
  const [show, setFlag] = useState(storageShow === null ? falseFlag : storageShow);
  const [modalOne, setModalOne] = useState(storageModalOne === null ? trueFlag : storageModalOne);
  const [modalTwo, setModalTwo] = useState(storageModalTwo === null ? trueFlag : storageModalTwo);
  const [openChat, newOpenChat] = useState(storageOpenChat === null ? '' : storageOpenChat);
  const changeFlag = (value) => {
    localStorage.setItem('show', JSON.stringify(!value));
    setFlag(!value);
  };
  const changeFlagOne = (value) => {
    localStorage.setItem('modalOne', JSON.stringify(!value));
    setModalOne(!value);
  };
  const changeFlagTwo = (value) => {
    localStorage.setItem('modalTwo', JSON.stringify(!value));
    setModalTwo(!value);
  };
  const setOpenChat = (value) => {
    localStorage.setItem('openChat', JSON.stringify(value));
    newOpenChat(value);
  };
  return (
    <ChatContext.Provider
      value={{
        show,
        modalOne,
        modalTwo,
        openChat,
        changeFlag,
        changeFlagOne,
        changeFlagTwo,
        setOpenChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.any,
};
