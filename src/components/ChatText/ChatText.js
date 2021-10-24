import { React, useState, useEffect } from 'react';
import { Row, Col, Space, Popover, Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ChatText.module.css';

const ChatText = ({ userName, users = [], email, messages, getMessages }) => {
  const [hasMore, setHasMore] = useState(true);
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
        <div className={styles.divChatLeft}>
          <Popover
            placement="left"
            content={<h6>{moment(new Date(message.time)).format('HH:mm')}</h6>}
          >
            <Row>
              <p className={styles.leftSite}>{searchUser(message.sender)}</p>
            </Row>
            <Row>
              <p className={styles.leftSiteMessage}>{message.message}</p>
            </Row>
          </Popover>
        </div>
      );
      const rightSite = (
        <>
          <div className={styles.divChatRight}>
            <Popover
              placement="right"
              content={<h6>{moment(new Date(message.time)).format('HH:mm')}</h6>}
            >
              <Row>
                <p className={styles.rightSite}>Me</p>
              </Row>
              <Row>
                <p className={styles.rightSiteMessage}>{message.message}</p>
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
        return moment(new Date(connectSearchedMessages[listLength - 1].time)).format('HH:mm');
      }
      return <></>;
    };
    return (
      <>
        <Row>
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
                paddingBottom: '5px',
                paddingTop: '5px',
                fontSize: 'x-small',
                height: '2px',
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
};

export default ChatText;
