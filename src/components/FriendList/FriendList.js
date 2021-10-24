import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Popover, List, Typography, Card, Space } from 'antd';
import styles from '../UserSettings/UserSettings.module.css';

const { Text } = Typography;

const FriendList = ({ users = [], email, getUsers }) => {
  const [hasMore, setHasMore] = useState(true);
  const userData = (users = []) => users.filter((user) => user.email === email);
  const currentData = userData(users);
  let friendListArray;
  if (currentData) {
    if (currentData[0].friends) {
      friendListArray = currentData[0].friends.split(',').filter((item) => item !== '');
      friendListArray.filter((item) => item !== '');
    }
  }
  const deleteunused = () => {
    fetch('http://localhost:3000/addfriend', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        friends: '',
        requests: '',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        }
      });
  };
  const deleteFriend = (value) => {
    const findUserToDelete = users.find((user) => user.email === value);
    let splitFriends;
    if (findUserToDelete) {
      const friendList = friendListArray.filter((item) => item !== findUserToDelete.email);
      let string = '';
      friendList.forEach((friend) => {
        string = `${string}${friend},`;
      });
      fetch('http://localhost:3000/deletefriend', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          friends: string,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === 'fail') {
            console.log('err');
          }
        });
    }
    if (findUserToDelete) {
      splitFriends = findUserToDelete.friends.split(',');
      const friendList = splitFriends.filter((item) => item !== email);
      let string = '';
      friendList.forEach((friend) => {
        string = `${string}${friend},`;
      });
      fetch('http://localhost:3000/deletefriend', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value,
          friends: string,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === 'fail') {
            console.log('err');
          }
        });
      getUsers();
    }
  };
  const searchName = (value) => {
    if (value) {
      const find = users.find((user) => user.email === value);
      let returning;
      if (find !== undefined) {
        returning = find.user;
      } else {
        returning = '';
      }
      return returning;
    }
  };
  let friendslist = <></>;
  const handleInfinitedOnLoad = () => {
    if (friendListArray.lenght > 4) {
      setHasMore((previous) => !previous);
    }
  };
  if (friendListArray !== null && friendListArray !== '' && friendListArray !== undefined) {
    if (friendListArray.length <= 6) {
      friendslist = (
        <>
          <Card className={styles.friendlist}>
            <h5>Znajomi:</h5>
            <Space direction="vertical">
              {friendListArray.map((item) => (
                <>
                  <Space size={25} direction="horizontal">
                    <Popover
                      placement="left"
                      content={
                        <>
                          <Button danger shape="round" onClick={() => deleteFriend(item)}>
                            Usuń znajmego
                          </Button>
                        </>
                      }
                      trigger="hover"
                    >
                      <Text>{searchName(item)}</Text>
                    </Popover>
                  </Space>
                </>
              ))}
            </Space>
          </Card>
        </>
      );
    } else if (friendListArray.length > 6) {
      friendslist = (
        <>
          <Card className={styles.friendlist}>
            <h5>Znajomi:</h5>
            <InfiniteScroll
              dataLength={friendListArray.length}
              next={handleInfinitedOnLoad}
              hasMore={hasMore}
              useWindow="false"
              height={400}
            >
              <List
                dataSource={friendListArray}
                renderItem={(item) => (
                  <List.Item>
                    <Popover
                      placement="left"
                      content={
                        <>
                          <Button danger shape="round" onClick={() => deleteFriend(item)}>
                            Usuń znajmego
                          </Button>
                        </>
                      }
                      trigger="hover"
                    >
                      <Text>{searchName(item)}</Text>
                    </Popover>
                    <Button shape="round" onClick={() => console.log('działa')}>
                      Chat
                    </Button>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </Card>
        </>
      );
    }
  } else {
    friendslist = <>Nie masz znajomych!</>;
  }
  return (
    <>
      {friendslist}
      {/* <Button onClick={() => deleteunused()}>Del</Button> */}
    </>
  );
};

FriendList.propTypes = {
  users: PropTypes.object,
  email: PropTypes.string,
  getUsers: PropTypes.func,
};

export default FriendList;
