import { React, useState, useEffect, useContext } from 'react';
import { Button, Row, Col, Space, Form, Input, Popover } from 'antd';
import {
  PlusSquareOutlined,
  PlusCircleOutlined,
  CloseSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../ChatListOfFriends/Chat.module.css';
import ChatText from '../ChatText/ChatText';
import FindNameByEmail from '../FindNameByEmail/FindNameByEmail';
import { ChatContext } from '../ChatContext/ChatContext';

const ChatOpenWindow = ({ users = [], email, deleteWindowChat, messages, getMessages, mode }) => {
  const [messageToSaveOne] = useState();
  const [messageToSaveTwo] = useState();
  const [receiver, setReceiver] = useState();
  const [form] = Form.useForm();
  const textColor = mode ? 'white' : 'black';
  const backgroundColor = mode ? 'black' : 'white';
  const { modalOne, modalTwo, openChat, changeFlagOne, changeFlagTwo } = useContext(ChatContext);
  const chatStyles = {
    chatStylesOne: {
      position: 'fixed',
      right: '17%',
      bottom: '1%',
      height: '30%',
      width: '15%',
      alignItems: 'center',
      border: '3px solid gray',
      backgroundColor: 'rgb(224, 224, 224)',
    },
    chatStylesTwo: {
      position: 'fixed',
      right: '33%',
      bottom: '1%',
      height: '30%',
      width: '15%',
      alignItems: 'center',
      border: '3px solid gray',
      backgroundColor: 'rgb(224, 224, 224)',
    },
    buttonsendOne: {
      position: 'fixed',
      bottom: '2%',
      right: '17.00%',
      color: textColor,
    },
    buttonsendTwo: {
      position: 'fixed',
      bottom: '2%',
      right: '33.02%',
      color: textColor,
    },
    buttonCloseModalOne: {
      position: 'fixed',
      bottom: '28.25%',
      right: '17%',
      fontSize: 'large',
    },
    buttonCloseModalTwo: {
      position: 'fixed',
      bottom: '28.25%',
      right: '33%',
      fontSize: 'large',
    },
    buttonModalOne: {
      position: 'fixed',
      bottom: '28.25%',
      right: '18.5%',
      fontSize: 'large',
    },
    buttonModalTwo: {
      height: 'auto',
      width: 'auto',
      position: 'fixed',
      bottom: '28.25%',
      right: '34.5%',
      fontSize: 'large',
    },
  };
  const mainStyles = [chatStyles.chatStylesOne, chatStyles.chatStylesTwo];
  const secondaryStyles = [chatStyles.buttonsendOne, chatStyles.buttonsendTwo];
  const buttonStyles = [chatStyles.buttonModalOne, chatStyles.buttonModalTwo];
  const buttonCloseStyles = [chatStyles.buttonCloseModalOne, chatStyles.buttonCloseModalTwo];
  const onClick = (receiver) => {
    setReceiver(receiver);
  };
  const addMessage = (message) => {
    let stringToSend;
    if (message.messageToSaveOne !== undefined) {
      stringToSend = message.messageToSaveOne;
    } else if (message.messageToSaveTwo !== undefined) {
      stringToSend = message.messageToSaveTwo;
    }
    const findUserEMail = users.find((user) => user.email === receiver);
    if (message !== null && message !== '') {
      fetch('http://localhost:3000/addmessage', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          receiver: findUserEMail.email,
          message: stringToSend,
        }),
      }).then((data) => {
        if (data === 'success') {
          console.log('pop1', data);
        } else if (data === 'erorr') {
          console.log('pop2', data);
        }
      });
      form.resetFields();
      getMessages();
    }
  };
  const messageSeen = (person) => {
    fetch('http://localhost:3000/messageseen', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        person,
      }),
    }).then((data) => console.log(data));
  };
  let openchatsOne = <></>;
  let openchatsTwo = <></>;
  if (openChat !== '') {
    const openChatArray = openChat.split(',').filter((item) => item !== '');
    if (modalOne === true) {
      if (openChatArray[0]) {
        if (messages) {
          if (
            messages.filter(
              (message) =>
                message.receiver === email &&
                message.seen === 'no' &&
                message.sender === openChatArray[0]
            ).length !== 0
          ) {
            messageSeen(openChatArray[0]);
          }
        }
        openchatsOne = (
          <div style={mainStyles[0]}>
            <Row className={mode ? styles.userstylesdark : styles.userstyleslight}>
              <Col span={8}>
                <h5 style={{ paddingLeft: '10%', width: '150%', color: textColor }}>
                  <FindNameByEmail users={users} email={openChatArray[0]} />
                </h5>
              </Col>
              <Col style={buttonStyles[0]}>
                <Button
                  size="small"
                  type="text"
                  onClick={() => changeFlagOne(modalOne)}
                  style={{ fontSize: 'large' }}
                >
                  <MinusSquareOutlined style={{ color: textColor }} />
                </Button>
              </Col>
              <Col style={buttonCloseStyles[0]}>
                <Button
                  size="small"
                  type="text"
                  onClick={() => deleteWindowChat(openChatArray[0])}
                  style={{ fontSize: 'large' }}
                >
                  <CloseSquareOutlined style={{ color: textColor }} />
                </Button>
              </Col>
            </Row>
            <ChatText
              mode={mode}
              messages={messages}
              users={users}
              email={email}
              userName={users.find((user) => user.email === openChatArray[0])}
              getMessages={getMessages}
            />
            <Row style={{ height: '15%', backgroundColor }}>
              <Form
                initialValues={{
                  messageToSaveOne,
                }}
                form={form}
                onFinish={addMessage}
              >
                <Form.Item name="messageToSaveOne">
                  <Input className={mode ? styles.inputlight : styles.inputdark} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    style={secondaryStyles[0]}
                    onClick={() => onClick(openChatArray[0])}
                  >
                    <PlusCircleOutlined style={{ fontSize: 'x-large' }} />
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </div>
        );
      }
    } else if (openChatArray[0]) {
      openchatsOne = (
        <>
          <Button
            className={mode ? styles.firstClosedChatdark : styles.firstClosedChatlight}
            onClick={() => changeFlagOne(modalOne)}
          >
            <Row>
              <Col>
                <h6 style={{ position: 'fixed', bottom: '1%', color: textColor }}>
                  <FindNameByEmail users={users} email={openChatArray[0]} />
                </h6>
              </Col>
              <Col>
                <PlusSquareOutlined
                  style={{
                    position: 'fixed',
                    right: '17.5%',
                    bottom: '1.75%',
                    fontSize: 'large',
                    color: textColor,
                  }}
                />
              </Col>
            </Row>
          </Button>
          <Button size="small" type="text" onClick={() => deleteWindowChat(openChatArray[0])}>
            <CloseSquareOutlined
              style={{
                position: 'fixed',
                right: '19%',
                bottom: '1.75%',
                fontSize: 'large',
                color: textColor,
              }}
            />
          </Button>
        </>
      );
    }
    if (modalTwo === true) {
      if (openChatArray[1]) {
        openchatsTwo = (
          <div style={mainStyles[1]}>
            <Row className={mode ? styles.userstylesdark : styles.userstyleslight}>
              <Col span={8}>
                <h5 style={{ paddingLeft: '10%', width: '150%', color: textColor }}>
                  <FindNameByEmail users={users} email={openChatArray[1]} />
                </h5>
              </Col>
              <Col style={buttonStyles[1]}>
                <Button
                  size="small"
                  type="text"
                  onClick={() => changeFlagTwo(modalTwo)}
                  style={{ fontSize: 'large' }}
                >
                  <MinusSquareOutlined style={{ color: textColor }} />
                </Button>
              </Col>
              <Col style={buttonCloseStyles[1]}>
                <Button
                  size="small"
                  type="text"
                  onClick={() => deleteWindowChat(openChatArray[1])}
                  style={{ fontSize: 'large' }}
                >
                  <CloseSquareOutlined style={{ color: textColor }} />
                </Button>
              </Col>
            </Row>
            <ChatText
              mode={mode}
              messages={messages}
              users={users}
              email={email}
              userName={users.find((user) => user.email === openChatArray[1])}
              getMessages={getMessages}
            />
            <Row style={{ height: '15%', backgroundColor }}>
              <Form
                initialValues={{
                  messageToSaveTwo,
                }}
                form={form}
                onFinish={addMessage}
              >
                <Form.Item name="messageToSaveTwo">
                  <Input className={mode ? styles.inputlight : styles.inputdark} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    style={secondaryStyles[1]}
                    onClick={() => onClick(openChatArray[1])}
                  >
                    <PlusCircleOutlined style={{ fontSize: 'x-large' }} />
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </div>
        );
      }
    } else if (openChatArray[1]) {
      openchatsTwo = (
        <>
          <Button
            className={mode ? styles.secoundClosedChatdark : styles.secoundClosedChatlight}
            onClick={() => changeFlagTwo(modalTwo)}
          >
            <Row>
              <Col>
                <h6 style={{ position: 'fixed', bottom: '1%', color: textColor }}>
                  <FindNameByEmail users={users} email={openChatArray[1]} />
                </h6>
              </Col>
              <Col>
                <PlusSquareOutlined
                  style={{
                    position: 'fixed',
                    right: '33.5%',
                    bottom: '1.75%',
                    fontSize: 'large',
                    color: textColor,
                  }}
                />
              </Col>
            </Row>
          </Button>
          <Button size="small" type="text" onClick={() => deleteWindowChat(openChatArray[1])}>
            <CloseSquareOutlined
              style={{
                position: 'fixed',
                right: '35%',
                bottom: '1.75%',
                fontSize: 'large',
                color: textColor,
              }}
            />
          </Button>
        </>
      );
    }
  }
  return (
    <>
      {openchatsOne}
      {openchatsTwo}
    </>
  );
};

ChatOpenWindow.propTypes = {
  users: PropTypes.object,
  email: PropTypes.string,
  deleteWindowChat: PropTypes.func,
  messages: PropTypes.object,
  getMessages: PropTypes.func,
  mode: PropTypes.bool,
};

export default ChatOpenWindow;
