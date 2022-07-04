import React from 'react';
import { Col, Row, Button } from 'antd';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import { Header } from 'antd/lib/layout/layout';
import styles from './StartPageStyles.module.css';

const StartPage = () => {
  const history = useHistory();
  const handleonClick = () => {
    history.push('/login');
  };
  const onClickRegister = () => {
    history.push('/register');
  };
  return (
    <Header style={{ height: '100px' }}>
      <Row>
        <Col span={7} offset={8}>
          <h1 style={{ textAlign: 'center', color: 'white', padding: '22px' }}>
            Planowanie projektów
          </h1>
        </Col>
        <Col offset={5}>
          <Row>
            <Col className={styles.buttonCol}>
              <Button
                className={styles.button}
                type="primary"
                shape="round"
                style={{ background: 'green', borderColor: 'green' }}
                onClick={handleonClick}
              >
                Zaloguj się
              </Button>
            </Col>
          </Row>
          <Row>
            <Col style={{ height: '50px' }}>
              <Button className={styles.registerButton} type="text" onClick={onClickRegister}>
                Nie masz konta? Zarejestruj się
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default StartPage;
