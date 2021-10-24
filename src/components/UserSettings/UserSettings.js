import React, { useState } from 'react';
import { Typography, Button, Input, Form, Row, Col, Space, Card } from 'antd';
import { Modal, ModalBody } from 'reactstrap';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './UserSettings.module.css';
import ChangeNamePassw from '../ChangeNamePassw/ChangeNamePassw';
import FriendList from '../FriendList/FriendList';

const { Text } = Typography;

const UserSettings = ({ users = [], getUsers, email }) => {
  const [modal, setModal] = useState(false);
  const [friendEmail] = useState();
  const [serchedEmail, setSerchedEmail] = useState();
  const toggle = () => {
    setModal((previous) => !previous);
    setSerchedEmail(null);
  };
  const userData = (users = []) => users.filter((user) => user.email === email);
  const currentData = userData(users);
  const userPassword = currentData[0].password;
  let requestListArray;
  if (currentData[0].friendsrequest === null) {
    currentData[0].friendsrequest = '';
  }
  if (currentData[0].friendsrequest) {
    requestListArray = currentData[0].friendsrequest.split(',');
    requestListArray = requestListArray.filter((item) => item !== '');
  }
  const sendInvite = (newFriend) => {
    const recipient = users.find((user) => newFriend === user.email);
    if (recipient.friendsrequest !== null) {
      const checkRequest = recipient.friendsrequest.split(',').find((request) => request === email);
      if (checkRequest !== email) {
        const check = `${recipient.friendsrequest}${email},`;
        const deleteNull = check.replace(`null`, '');
        fetch('http://localhost:3000/invite', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: newFriend,
            friendsrequest: deleteNull,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === 'fail') {
              console.log('err');
            }
          });
        getUsers();
      } else {
        console.log('pop');
      }
    } else {
      const friendsToString = toString(recipient.friendsrequest);
      const checkRequest = friendsToString.replace('[object Undefined]klaudia@wp.pl,', '');
      const check = `${checkRequest}${email},`;
      fetch('http://localhost:3000/invite', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newFriend,
          friendsrequest: check,
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
  const addFriend = (value) => {
    const checkLength = requestListArray.length;
    let requests;
    if (checkLength === 1) {
      requests = currentData[0].friendsrequest.replace(`${value},`, '');
    } else {
      requests = currentData[0].friendsrequest.replace(`${value},`, '');
    }
    const friends = `${currentData[0].friends}${value},`;
    const recipient = users.find((user) => value === user.email);
    const recipientFriends = `${recipient.friends}${email},`;
    const recipientRequest = `${recipient.friendsrequest}`;
    const deleteNullF = friends.replace(`null`, '');
    const deleteNullFR = recipientFriends.replace(`null`, '');
    fetch('http://localhost:3000/addfriend', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        friends: deleteNullF,
        requests,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        }
      });
    fetch('http://localhost:3000/addfriend', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: value,
        friends: deleteNullFR,
        requests: recipientRequest,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        }
      });
    getUsers();
  };
  const deleteRequest = (value) => {
    const deleteR = users.find((user) => email === user.email);
    const checkLength = deleteR.friendsrequest.split(',').length;
    let check;
    if (checkLength === 1) {
      check = deleteR.friendsrequest.replace(`${value},`, '');
    } else {
      check = deleteR.friendsrequest.replace(`${value},`, '');
    }
    fetch('http://localhost:3000/invite', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        friendsrequest: check,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        }
      });
    getUsers();
  };
  let foundEmail = <></>;
  const checkEmail = (value) => {
    const isEmail = users.find((user) => value.friendEmail === user.email);
    setSerchedEmail(isEmail);
  };
  if (serchedEmail === undefined) {
    foundEmail = <>Nie znaleziono użytkownika o takim emailu!</>;
  }
  if (serchedEmail) {
    foundEmail = (
      <>
        <Row>
          <Col>
            <Row>
              <Text>Email: {serchedEmail.email}</Text>
            </Row>
            <Row>
              <Text>Nazwa użytkownika: {serchedEmail.user}</Text>
            </Row>
          </Col>
          <Col>
            <Button onClick={() => sendInvite(serchedEmail.email)}>Dodaj</Button>
          </Col>
        </Row>
      </>
    );
  }
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
  let friendsrequestlist = <></>;
  if (requestListArray !== null && requestListArray !== '' && requestListArray !== undefined) {
    friendsrequestlist = (
      <div className={styles.invite}>
        <Card>
          <Space direction="vertical">
            <h5>Zaproszenia:</h5>
            {requestListArray.map((item) => (
              <Row>
                <Col>
                  <Text>{searchName(item)}</Text>
                </Col>
                <Col style={{ position: 'absolute', right: '0px' }}>
                  <Button type="text" onClick={() => addFriend(item)}>
                    <CheckOutlined style={{ color: '#00ff00' }} />
                  </Button>
                  <Button type="text" onClick={() => deleteRequest(item)}>
                    <CloseOutlined style={{ color: '#ff0000' }} />
                  </Button>
                </Col>
              </Row>
            ))}
          </Space>
        </Card>
      </div>
    );
  }
  return (
    <>
      <Row>
        <Col span={8}>
          <ChangeNamePassw email={email} getUsers={getUsers} pass={userPassword} />
        </Col>
        <Col span={7}>
          <FriendList email={email} users={users} getUsers={getUsers} />
        </Col>
        <Col span={8}>
          <Row>
            <Button type="round" onClick={() => toggle()}>
              Dodaj znajomego
            </Button>
          </Row>
          <Row>{friendsrequestlist}</Row>
        </Col>
        <Col>
          <Modal isOpen={modal} toggle={toggle} onCancel={toggle}>
            <ModalBody>
              <Text>Wyszukaj po emailu</Text>
              <Form
                onFinish={checkEmail}
                labelCol={{
                  span: 5,
                }}
                wrapperCol={{
                  span: 14,
                }}
                initialValues={{
                  friendEmail,
                }}
              >
                <Form.Item name="friendEmail">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="round">
                    Szukaj użytkownika
                  </Button>
                </Form.Item>
              </Form>
              {foundEmail}
            </ModalBody>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

UserSettings.propTypes = {
  users: PropTypes.object,
  getUsers: PropTypes.func,
  email: PropTypes.string,
};

export default UserSettings;
