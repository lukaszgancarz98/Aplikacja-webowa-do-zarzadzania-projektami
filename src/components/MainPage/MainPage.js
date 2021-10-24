import { React, useContext, useState, useEffect } from 'react';
import { Button, Col, Row, Card, Tabs } from 'antd';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EditOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import { Header } from 'antd/lib/layout/layout';
import styles from './MainPageStyles.module.css';
import NewProjectModal from '../NewProjectModal/NewProjectModal';
import { EmailContext } from '../EmailContext/EmailContext';
import ProjectList from '../ProjectList/ProjectList';
import { VariableContext } from '../VariableContext/VariableContext';
import UserSettings from '../UserSettings/UserSettings';

const { TabPane } = Tabs;

const MainPage = () => {
  const { email } = useContext(EmailContext);
  const { name, setUsers, users } = useContext(VariableContext);
  const [modal, setModal] = useState();
  const [projects, setProjects] = useState();
  const toggle = () => {
    setModal((previous) => !previous);
  };
  const history = useHistory();
  const handleonClick = () => {
    history.push('/');
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
  const getProjects = () => {
    fetch('http://localhost:3000/getprojects', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        } else {
          setProjects(data);
        }
      });
  };
  useEffect(() => {
    getProjects();
    getUsers();
  }, []);
  const userCheck = (users) => {
    const split = users.split(' ');
    const findUser = split.find((item) => item === name);
    return findUser;
  };
  const getProjectsFotView = (projects = []) =>
    projects.filter((project) => project.owner === email || userCheck(project.users) === name);
  const title = <>Ustawienia {name}</>;
  return (
    <>
      <Header>
        <Row>
          <Col>
            <Button className={styles.button} shape="round" onClick={handleonClick}>
              Wyloguj się
            </Button>
          </Col>
        </Row>
      </Header>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Projekty" key="1">
          <Row>
            <Col className={styles.buttoncreate}>
              <Button
                type="primary"
                shape="round"
                style={{ background: 'green', borderColor: 'green' }}
                onClick={toggle}
              >
                Stwórz nowy projekt
                <EditOutlined />
              </Button>
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Nowy projekt</ModalHeader>
                <ModalBody>
                  <NewProjectModal getProjects={getProjects} toggle={toggle} email={email} />
                </ModalBody>
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col className={styles.projectlist}>
              <Card style={{ backgroundColor: 'grey' }}>
                <ProjectList projects={getProjectsFotView(projects)} getProjects={getProjects} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={title} key="2">
          <UserSettings getUsers={getUsers} users={users} name={name} email={email} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default MainPage;
