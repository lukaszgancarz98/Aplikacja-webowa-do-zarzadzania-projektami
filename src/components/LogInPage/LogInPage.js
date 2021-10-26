import { React, useState, useContext } from 'react';
import { Button, Row, Col, Input, Form, Space, Tooltip } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { githubProvider, googleProvider } from '../config/authMethods';
import socialMediaAuth from '../service/socialMediaAuth';
import Auth from '../AuthCheck/Auth';
import styles from './LogInPage.module.css';
import { EmailContext } from '../EmailContext/EmailContext';
import { VariableContext } from '../VariableContext/VariableContext';

const LogInPage = () => {
  const { newEmail } = useContext(EmailContext);
  const { newName } = useContext(VariableContext);
  const history = useHistory();
  const handleonClick = () => {
    history.push('/');
  };
  const handleOnClickGithub = async (provider) => {
    const res = await socialMediaAuth(provider);
    fetch('http://localhost:3000/checkuser', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: res.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data !== 'false') {
          Auth.login(() => {
            history.push('/projectplanner');
          });
          newEmail(res.email);
          newName(data.user);
        } else {
          history.push('/registeracc');
          newEmail(res.email);
        }
      });
  };
  const [email, onEmailChange] = useState('');
  const [password, onPasswordChange] = useState('');
  const LogIn = (values) => {
    onEmailChange(values.email);
    onPasswordChange(values.password);
    fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data !== 'fail') {
          newEmail(values.email);
          newName(data.user);
          console.log(data.user);
          history.push('/projectplanner');
        } else {
          console.log('błędny login lub hasło');
        }
      });
  };
  const configLogin = {
    rules: [
      {
        required: true,
        message: 'Email wymagany!',
      },
    ],
  };
  return (
    <>
      <Header>
        <Row>
          <Col>
            <Button shape="round" onClick={handleonClick}>
              Powrót
            </Button>
          </Col>
        </Row>
      </Header>
      <div className={styles.div}>
        <Col offset={10} className={styles.loginwindow}>
          <Row>
            <Col span={8} style={{ width: '150%' }}>
              <h1 style={{ paddingLeft: '100px' }}>Logowanie</h1>
              <Form
                onFinish={LogIn}
                labelCol={{
                  span: 10,
                }}
                wrapperCol={{
                  span: 10,
                }}
                initialValues={{
                  email,
                  password,
                }}
              >
                <Form.Item
                  label="Email"
                  tooltip="Wprowadź email użytkownika"
                  name="email"
                  {...configLogin}
                >
                  <Input maxLength={50} style={{ width: 180 }} />
                </Form.Item>
                <Form.Item
                  label="Hasło"
                  tooltip="Wprowadź hasło użytkownika"
                  name="password"
                  {...configLogin}
                >
                  <Input.Password maxLength={50} style={{ width: 180 }} />
                </Form.Item>
                <Form.Item>
                  <Button type="round" htmlType="submit" className={styles.loginbutton}>
                    Zaloguj się
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={10} style={{ width: '150%', paddingTop: '1%' }}>
              <h3>Inne opcje logowania</h3>
              <Space
                size={20}
                direction="vertical"
                style={{ paddingLeft: '18%', paddingTop: '5%' }}
              >
                <Tooltip placement="right" title="Zaloguj się kontem GitHub">
                  <Button
                    onClick={() => handleOnClickGithub(githubProvider)}
                    color="#8c8c8c"
                    size="large"
                    type="round"
                    style={{ background: 'lightslategray' }}
                  >
                    <GithubOutlined />
                    GitHub
                  </Button>
                </Tooltip>
                <Tooltip placement="right" title="Zaloguj się kontem Google">
                  <Button
                    onClick={() => handleOnClickGithub(googleProvider)}
                    color="#f5222d"
                    size="large"
                    type="round"
                    style={{ background: 'lightblue' }}
                  >
                    <GoogleOutlined />
                    Google
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Col>
      </div>
    </>
  );
};

LogInPage.propTypes = {
  history: PropTypes.object,
};

export default LogInPage;
