import React, { useState, useContext } from 'react';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { VariableContext } from '../VariableContext/VariableContext';

const ChangeNamePassw = ({ pass, email, getUsers }) => {
  const [password] = useState();
  const [repPassword] = useState();
  const [newPassword] = useState();
  const [newNameUser] = useState();
  const { newName } = useContext(VariableContext);
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
        <Form.Item label="Stare hasło" name="password">
          <Input />
        </Form.Item>
        <Form.Item label="Powtórz stare hasło" name="repPassword">
          <Input />
        </Form.Item>
        <Form.Item label="Nowe hasło" name="newPassword">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">OK</Button>
        </Form.Item>
      </Form>
      <Form
        onFinish={changeName}
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
        <Form.Item label="Nowa nazwa użytkownika" name="newNameUser">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">OK</Button>
        </Form.Item>
      </Form>
    </>
  );
};

ChangeNamePassw.propTypes = {
  email: PropTypes.string,
  getUsers: PropTypes.func,
  pass: PropTypes.string,
};

export default ChangeNamePassw;
