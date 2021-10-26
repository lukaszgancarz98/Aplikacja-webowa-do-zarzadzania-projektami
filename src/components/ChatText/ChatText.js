import { React, useState, useEffect } from 'react';
import { Row, Col, Space, Popover, Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ChatText.module.css';

const ChatText = ({ userName, users = [], email, messages, getMessages, mode }) => {
  const [hasMore, setHasMore] = useState(true);
  const textColor = mode ? 'white' : 'black';
  const backgroundColor = mode ? 'black' : 'white';
  useEffect(() => {
    getMessages();
  }, []);
  if (messages) {
    const searchMessagesasSender = messages.filter(
      (item) => item.sender === email && item.receiver === userName.email
    );
    const searchMessagesasReceiver = messages.filter(
      (item) => item.receiver === email && item.sender === userName.email
    );
    const connectSearchedMessages = searchMessagesasSender
      .concat(searchMessagesasReceiver)
      .sort((messageA, messageB) => messageA.time.localeCompare(messageB.time))
      .filter((message) => message.message !== null);
    const placeMessages = (message) => {
      let sender;
      const searchUser = (name) => {
        const findEmail = users.find((user) => user.email === name);
        return findEmail.user;
      };
      if (message.sender === email) {
        sender = false;
      } else {
        sender = true;
      }
      const leftSite = (
        <div className={mode ? styles.divChatLeftdark : styles.divChatLeftlight}>
          <Popover
            placement="left"
            content={<h6>{moment(new Date(message.time)).format('HH:mm')}</h6>}
          >
            <Row>
              <p className={mode ? styles.leftSitedark : styles.leftSitelight}>
                {searchUser(message.sender)}
              </p>
            </Row>
            <Row>
              <p className={mode ? styles.leftSiteMessagedark : styles.leftSiteMessagelight}>
                {message.message}
              </p>
            </Row>
          </Popover>
        </div>
      );
      const rightSite = (
        <>
          <div className={mode ? styles.divChatRightdark : styles.divChatRightlight}>
            <Popover
              placement="right"
              content={<h6>{moment(new Date(message.time)).format('HH:mm')}</h6>}
            >
              <Row>
                <p className={mode ? styles.rightSitedark : styles.rightSitelight}>Me</p>
              </Row>
              <Row>
                <p className={mode ? styles.rightSiteMessagedark : styles.rightSiteMessagelight}>
                  {message.message}
                </p>
              </Row>
            </Popover>
          </div>
        </>
      );
      return <>{sender ? leftSite : rightSite}</>;
    };
    const handleInfinitedOnLoad = () => {
      if (connectSearchedMessages.lenght > 2) {
        setHasMore((previous) => !previous);
      }
    };
    const timeOfLastMessage = () => {
      const listLength = connectSearchedMessages.length;
      if (connectSearchedMessages === undefined) {
        console.log(moment(new Date(connectSearchedMessages[listLength - 1].time)).format('HH:mm'));
        return moment(new Date(connectSearchedMessages[listLength - 1].time)).format('HH:mm');
      }
      return <></>;
    };
    return (
      <>
        <Row style={{ height: '21.7vh', backgroundColor }}>
          <InfiniteScroll
            dataLength={connectSearchedMessages.length}
            next={handleInfinitedOnLoad}
            hasMore={hasMore}
            useWindow="false"
            height="21vh"
            style={{ width: '14.7vw', display: 'flex', flexDirection: 'column-reverse' }}
          >
            <p
              style={{
                textAlign: 'center',
                fontSize: 'x-small',
                height: '3px',
                color: textColor,
              }}
            >
              {timeOfLastMessage()}
            </p>
            <Space direction="vertical">
              {connectSearchedMessages.map((message) => (
                <div style={{ paddingLeft: '2%', paddingRight: '2%' }}>
                  {placeMessages(message)}
                </div>
              ))}
            </Space>
          </InfiniteScroll>
        </Row>
      </>
    );
  }
  return <></>;
};

ChatText.propTypes = {
  users: PropTypes.object,
  userName: PropTypes.object,
  email: PropTypes.string,
  messages: PropTypes.object,
  getMessages: PropTypes.func,
  mode: PropTypes.bool,
};

export default ChatText;
