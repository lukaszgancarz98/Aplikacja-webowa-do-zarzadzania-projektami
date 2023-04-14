import { React, useState, useContext, useEffect } from 'react';
import { Button, Row, Col, Space, Form, Input, Popover } from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './Chat.module.css';
import FindNameByEmail from '../FindNameByEmail/FindNameByEmail';
import ChatOpenWindow from '../ChatOpenWindow/ChatOpenWindow';
import { ChatContext } from '../ChatContext/ChatContext';
import { DarkLightContext } from '../ContextDarkLightMode/ContextDarkLightMode';

const ChatListOfFriends = ({ users = [], friends, email }) => {
  const { show, changeFlag, openChat, setOpenChat } = useContext(ChatContext);
  const { mode } = useContext(DarkLightContext);
  const textColor = mode ? 'white' : 'black';
  const [messages, setMessages] = useState();
  const getMessages = () => {
    fetch('http://localhost:3000/messages', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => setMessages(data));
  };
  useEffect(() => {
    getMessages();
  }, []);
  const chatWindow = (friend) => {
    const findUserByEmail = users.find((user) => user.email === friend);
    const isOpenChatAlready = openChat.split(',').find((item) => item === friend);
    if (isOpenChatAlready === undefined) {
      const saveEmail = findUserByEmail.email;
      setOpenChat(`${saveEmail},${openChat}`);
    } else {
      console.log('pop');
    }
  };
  const deleteWindowChat = (somebody) => {
    setOpenChat(openChat.replace(`${somebody},`, ''));
  };
  let friendsLength;
  let friendsList;
  if (friends !== undefined && friends !== '' && friends !== null) {
    friendsLength = friends.length;
    friendsList = friends;
  }
  const isMessageSeen = (person) => {
    if (messages && person) {
      const unseenMessages = messages.filter(
        (message) =>
          message.receiver === email && message.seen === 'no' && message.sender === person
      ).length;
      if (unseenMessages > 0) {
        return <>{`(${unseenMessages})`}</>;
      }
    }
  };
  let title = <></>;
  if (messages) {
    if (
      messages.filter((message) => message.receiver === email && message.seen === 'no').length >= 1
    ) {
      title = `Chat (${
        messages.filter((message) => message.receiver === email && message.seen === 'no').length
      })`;
    } else {
      title = `Chat`;
    }
  }
  let chat = <></>;
  if (show === false) {
    chat = (
      <>
        <Button
          className={mode ? styles.friendlistcloseddark : styles.friendlistclosedlight}
          onClick={() => changeFlag(show)}
        >
          <Row style={{ height: '20px' }}>
            <Col>
              <h6 style={{ position: 'fixed', bottom: '1%', color: textColor }}>{title}</h6>
            </Col>
            <Col>
              <PlusSquareOutlined
                style={{
                  position: 'fixed',
                  right: '1.5%',
                  bottom: '1.75%',
                  fontSize: 'large',
                  color: textColor,
                }}
              />
            </Col>
          </Row>
        </Button>
      </>
    );
  } else if (show === true) {
    chat = (
      <div className={mode ? styles.friendlistopendark : styles.friendlistopenlight}>
        <Row className={mode ? styles.userstylesdark : styles.userstyleslight}>
          <Col>
            <h5 style={{ paddingLeft: '10%', width: '150%', color: textColor }}>{title}</h5>
          </Col>
          <Col style={{ paddingLeft: '55%' }}>
            <Button
              type="text"
              onClick={() => changeFlag(show)}
              style={{ position: 'fixed', right: '1%', bottom: '27.75%', fontSize: 'large' }}
            >
              <MinusSquareOutlined style={{ color: textColor }} />
            </Button>
          </Col>
        </Row>
        <Space direction="vertical">
          {friendsList.map((friend) => (
            <Button
              className={styles.usernamebutton}
              type="text"
              onClick={() => chatWindow(friend)}
            >
              - <FindNameByEmail users={users} email={friend} /> {isMessageSeen(friend)}
            </Button>
          ))}
        </Space>
      </div>
    );
  }
  return (
    <>
      {chat}
      <ChatOpenWindow
        mode={mode}
        messages={messages}
        getMessages={getMessages}
        email={email}
        users={users}
        deleteWindowChat={deleteWindowChat}
      />
    </>
  );
};

ChatListOfFriends.propTypes = {
  friends: PropTypes.string,
  users: PropTypes.object,
  email: PropTypes.string,
};

export default ChatListOfFriends;
