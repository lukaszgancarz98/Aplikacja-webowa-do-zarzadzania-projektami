import React, { useContext, useState, useEffect } from 'react';
import { Button, Input, Form, Card, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { EmailContext } from '../EmailContext/EmailContext';
import { VariableContext } from '../VariableContext/VariableContext';
import styles from './GithubGoggleLogIn.module.css';

const GGLogIn = () => {
  const history = useHistory();
  const { email } = useContext(EmailContext);
  const { newName } = useContext(VariableContext);
  const [nameok] = useState();
  const [users, setUsers] = useState('');
  const Register = (values) => {
    const nickIsInUsage = users.find((user) => user.user === values.name);
    if (nickIsInUsage === undefined) {
      fetch('http://localhost:3000/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: 'generatedpassword',
          name: values.nameok,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user !== 'fail') {
            newName(user.user);
            history.push('/projectplanner');
          }
        });
    } else {
      console.log('pop');
    }
  };
  const configName = {
    rules: [
      {
        required: true,
        message: 'Nazwa użytkowanika wymagana!',
      },
    ],
  };
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
  return (
    <div className={styles.div}>
      <h3 className={styles.title}>
        Tworzenie nowego konta w aplikacji za pomocą konta Github lub Google
      </h3>
      <Card>
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 14,
          }}
          initialValues={{
            nameok,
          }}
          onFinish={Register}
        >
          <Form.Item label="Nazwa użytkownika:" name="nameok">
            <Input {...configName} />
          </Form.Item>
          <Form.Item>
            <Button type="round" htmlType="submit">
              Utwórz
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GGLogIn;
