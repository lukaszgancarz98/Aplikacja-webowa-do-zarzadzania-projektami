import { React, useState, useContext, useEffect } from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { EmailContext } from '../EmailContext/EmailContext';
import styles from './RegisterPage.module.css';
import { VariableContext } from '../VariableContext/VariableContext';

const RegisterPage = () => {
  const history = useHistory();
  const { newEmail } = useContext(EmailContext);
  const { newName } = useContext(VariableContext);
  const [newEmailReg] = useState('');
  const [users, setUsers] = useState();
  const [newNameReg, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const configEmail = {
    rules: [
      {
        required: true,
        message: 'Email wymagany!',
      },
    ],
  };
  const configPassword = {
    rules: [
      {
        required: true,
        message: 'Hasło wymagane!',
      },
    ],
  };
  const configName = {
    rules: [
      {
        required: true,
        message: 'Nazwa użytkowanika wymagana!',
      },
    ],
  };
  const handleonClick = () => {
    history.push('/');
  };
  const Register = (values) => {
    if (values.newEmailReg !== '') {
      console.log(users);
      const findUser = users.find((user) => user.user === values.newNameReg);
      const findEmail = users.find((user) => user.email === values.newEmailReg);
      if (findUser === undefined && findEmail === undefined) {
        setNewPassword(values.newPassword);
        newName(values.newNameReg);
        newEmail(values.newEmailReg);
        fetch('http://localhost:3000/register', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.newEmailReg,
            password: values.newPassword,
            name: values.newNameReg,
          }),
        })
          .then((response) => response.json())
          .then((user) => {
            console.log(user);
            if (user !== 'fail') {
              history.push('/projectplanner');
            } else {
              console.log('pop');
            }
          });
      }
    }
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
    <>
      <Header>
        <Row>
          <Col>
            <Button className={styles.button} shape="round" onClick={handleonClick}>
              Powrót
            </Button>
          </Col>
        </Row>
      </Header>
      <div className={styles.div}>
        <Col offset={10}>
          <Row>
            <Col span={10} style={{ width: '100%', paddingTop: '20%' }}>
              <h1 style={{ paddingLeft: '8%' }}>Rejestracja</h1>
              <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                initialValues={{
                  newNameReg,
                  newEmailReg,
                  newPassword,
                }}
                onFinish={Register}
              >
                <Form.Item label="Nazwa użytkownika:" name="newNameReg">
                  <Input {...configName} className={styles.input} />
                </Form.Item>
                <Form.Item label="Email:" name="newEmailReg">
                  <Input type="email" {...configEmail} className={styles.input} />
                </Form.Item>
                <Form.Item label="Hasło:" name="newPassword">
                  <Input.Password
                    className={styles.passinput}
                    {...configPassword}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="round" htmlType="submit" className={styles.button}>
                    Zarejestruj się
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </div>
    </>
  );
};

export default RegisterPage;
