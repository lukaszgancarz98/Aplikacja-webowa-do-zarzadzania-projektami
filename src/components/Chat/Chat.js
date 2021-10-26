import React, { useContext, useEffect, useState } from 'react';
import { EmailContext } from '../EmailContext/EmailContext';
import ChatListOfFriends from '../ChatListOfFriends/ChatListOfFriends';

const Chat = () => {
  const { email } = useContext(EmailContext);
  const [users, setUsers] = useState();
  const getUsers = () => {
    fetch('http://localhost:3000/getusers', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        } else {
          setUsers(data);
        }
      });
  };
  useEffect(() => {
    getUsers();
  }, []);
  if (users) {
    const user = users.find((item) => item.email === email);
    console.log(user);
    if (user.friends !== null && user.friends !== '') {
      const friends = user.friends.split(',').filter((friend) => friend !== '');
      return (
        <>
          <ChatListOfFriends users={users} friends={friends} email={email} />
        </>
      );
    }
  }
  return <></>;
};

export default Chat;
