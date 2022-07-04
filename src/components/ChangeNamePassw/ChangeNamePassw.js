import React, { useState, useContext } from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import PropTypes from 'prop-types';
import { VariableContext } from '../VariableContext/VariableContext';
import styles from '../UserSettings/UserSettings.module.css';

const { Text } = Typography;

const ChangeNamePassw = ({ pass, email, getUsers, mode }) => {
  const [password] = useState();
  const [repPassword] = useState();
  const [newPassword] = useState();
  const [newNameUser] = useState();
  const { newName } = useContext(VariableContext);
  const textColor = mode ? 'white' : 'black';
  const changePassword = (values) => {
    if (pass === values.password && pass === values.repPassword) {
      const AddNewPassword = values.newPassword;
      fetch('http://localhost:3000/changeuser', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: AddNewPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === 'fail') {
            console.log('err');
          }
        });
    } else {
      console.log('wrong pass');
    }
  };
  const changeName = (value) => {
    newName(value.newNameUser);
    const AddNewName = value.newNameUser;
    fetch('http://localhost:3000/changeuser', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: AddNewName,
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
  return (
    <>
      <Form
        onFinish={changePassword}
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 14,
        }}
        initialValues={{
          password,
          repPassword,
          newPassword,
        }}
      >
        <Form.Item label={<span style={{ color: textColor }}>Stare hasło</span>} name="password">
          <Input className={mode ? styles.buttonlight : styles.buttondark} />
        </Form.Item>
        <Form.Item
          label={<span style={{ color: textColor }}>Powtórz hasło</span>}
          name="repPassword"
        >
          <Input className={mode ? styles.buttonlight : styles.buttondark} />
        </Form.Item>
        <Form.Item label={<span style={{ color: textColor }}>Nowe hasło</span>} name="newPassword">
          <Input className={mode ? styles.buttonlight : styles.buttondark} />
        </Form.Item>
        <Form.Item>
          <Button className={mode ? styles.buttonlight : styles.buttondark} htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>
      <Form
        onFinish={changeName}
        className={mode ? styles.modallight : styles.modaldark}
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 14,
        }}
        initialValues={{
          newNameUser,
        }}
      >
        <Form.Item
          label={<span style={{ color: textColor }}>Nowa nazwa użytkownika</span>}
          name="newNameUser"
        >
          <Input className={mode ? styles.inputlight : styles.inputdark} />
        </Form.Item>
        <Form.Item>
          <Button className={mode ? styles.buttonlight : styles.buttondark} htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

ChangeNamePassw.propTypes = {
  email: PropTypes.string,
  getUsers: PropTypes.func,
  pass: PropTypes.string,
  mode: PropTypes.bool,
};

export default ChangeNamePassw;
