import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row, Col, Typography, Space, Tooltip, Tabs, Card } from 'antd';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { EmailContext } from '../EmailContext/EmailContext';
import { VariableContext } from '../VariableContext/VariableContext';
import styles from './ProjectSettings.module.css';

const { Text } = Typography;
const { TabPane } = Tabs;

const Users = ({
  items = [],
  users,
  restOfUsers,
  restOfFriends,
  list,
  projectName,
  owner,
  getProjects,
  getUsers,
  mode,
}) => {
  console.log(restOfFriends);
  const { email } = useContext(EmailContext);
  const [modal, setModal] = useState(false);
  const arrFilter = items.filter((value) => value !== '');
  const toggle = () => {
    setModal((previous) => !previous);
  };
  const deleteUser = (string) => {
    const action = list.replace(` ${string}`, '');
    fetch('http://localhost:3000/newusers', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOwner: owner,
        name: projectName,
        users: action,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
    getProjects();
    getUsers();
  };
  const addUser = (value) => {
    if (typeof value === 'string') {
      const findUser = users.find((user) => value === user.email);
      if (findUser) {
        const createUsers = `${list} ${findUser.email}`;
        fetch('http://localhost:3000/newusers', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailOwner: owner,
            name: projectName,
            users: createUsers,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === 'fail') {
              console.log('błędny login lub hasło');
            }
          });
        toggle();
        getProjects();
        getUsers();
      }
    } else {
      const findUser = users.find((user) => value.user === user.user && value.email === user.email);
      if (findUser) {
        const createUsers = `${list} ${findUser.email}`;
        fetch('http://localhost:3000/newusers', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailOwner: owner,
            name: projectName,
            users: createUsers,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === 'fail') {
              console.log('błędny login lub hasło');
            }
          });
        toggle();
        getProjects();
        getUsers();
      }
    }
  };
  const displayUsers = (item) => {
    const isThisUser = users.find((user) => user.email === item);
    if (isThisUser) {
      return isThisUser.user;
    }
  };
  let disusersList = <></>;
  if (email === owner && arrFilter !== '') {
    disusersList = (
      <Row className={mode ? styles.inputdark : styles.inputlight}>
        <Space direction="vertical">
          {arrFilter.map((item) => (
            <Text>
              {displayUsers(item)}
              <Tooltip title={`Usuń użytkownika ${displayUsers(item)}`}>
                <Button type="text" onClick={() => deleteUser(item)}>
                  <CloseOutlined style={{ color: '#ff0000' }} />
                </Button>
              </Tooltip>
            </Text>
          ))}
        </Space>
      </Row>
    );
  } else if (email !== owner && arrFilter !== '') {
    disusersList = (
      <Row className={mode ? styles.inputdark : styles.inputlight}>
        <Space direction="vertical">
          {arrFilter.map((item) => (
            <Text>{displayUsers(item)}</Text>
          ))}
        </Space>
      </Row>
    );
  } else {
    disusersList = (
      <span className={mode ? styles.formtextdark : styles.formtextlight}>
        Tutaj nikogo nie ma!{' '}
      </span>
    );
  }
  let friendList = <></>;
  if (restOfFriends.length === undefined || restOfFriends.length === 0) {
    friendList = (
      <span className={mode ? styles.formtextdark : styles.formtextlight}>
        Nie masz żadnych znajomych
      </span>
    );
  } else {
    friendList = (
      <span className={mode ? styles.inputdark : styles.inputlight}>
        {restOfFriends.map((user) => (
          <>
            <Space direction="horizontal">
              <Text className={mode ? styles.formtextdark : styles.formtextlight}>{user}</Text>
              <Tooltip title="Dodaj" placement="right">
                <Button type="text" onClick={() => addUser(user)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
            </Space>
          </>
        ))}
      </span>
    );
  }
  let addUserButton = <></>;
  if (email === owner) {
    addUserButton = (
      <>
        <Button type="text" onClick={() => toggle()}>
          Dodaj użytkownika
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalBody toggle={toggle} className={mode ? styles.inputdark : styles.inputlight}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span className={mode ? styles.formtextdark : styles.formtextlight}>Znajomi</span>
                }
                key="1"
                style={{ width: '200%' }}
              >
                <Space direction="vertical">{friendList}</Space>
              </TabPane>
              <TabPane
                tab={
                  <span className={mode ? styles.formtextdark : styles.formtextlight}>
                    Użytkownicy
                  </span>
                }
                key="2"
              >
                <Space direction="vertical">
                  {restOfUsers.map((user) => (
                    <Row>
                      <Space direction="horizontal">
                        <Text className={mode ? styles.formtextdark : styles.formtextlight}>
                          {user.email}
                        </Text>
                        <Tooltip title="Dodaj" placement="right">
                          <Button type="text" onClick={() => addUser(user)}>
                            <PlusOutlined />
                          </Button>
                        </Tooltip>
                      </Space>
                    </Row>
                  ))}
                </Space>
              </TabPane>
            </Tabs>
          </ModalBody>
        </Modal>
      </>
    );
  }
  return (
    <div>
      <Card
        className={mode ? styles.divdark : styles.divlight}
        title={
          <span className={mode ? styles.formtextdark : styles.formtextlight}>Użytkownicy</span>
        }
      >
        {disusersList}
        {addUserButton}
      </Card>
    </div>
  );
};

const ProjectSettings = ({ project, getProjects, getUsers, mode }) => {
  const { email } = useContext(EmailContext);
  const { users } = useContext(VariableContext);
  const [projectName] = useState(project.name);
  const [projectDescription] = useState(project.description);
  const editProject = () => {
    console.log(project.users, 'edit');
  };
  const list = project.users;
  const splitList = list.split(' ').filter((item) => item !== '');
  console.log(splitList);
  let restOfUsers = users;
  const ownerData = users.find((user) => user.email === email);
  let splitFriends;
  if (ownerData.friends !== null) {
    splitFriends = ownerData.friends.split(',').filter((item) => item !== '');
  } else {
    splitFriends = '';
  }
  let restOfFriends = splitFriends;
  const usersFilter = (restOfUsers = [], item) => restOfUsers.filter((user) => user.email !== item);
  const friendsFilter = (restOfFriends = [], item) =>
    restOfFriends.filter((friend) => friend !== item);
  if (users && splitList) {
    splitList.forEach((item) => {
      users.forEach((user) => {
        if (user.email === item) {
          restOfUsers = usersFilter(restOfUsers, item);
        }
      });
    });
  }
  if (splitFriends && splitList) {
    splitList.forEach((item) => {
      splitFriends.forEach((friend) => {
        if (friend === item) {
          restOfFriends = friendsFilter(restOfFriends, item);
        }
      });
    });
  }
  return (
    <>
      <Row>
        <Col className={mode ? styles.colformdark : styles.colformlight}>
          <h4 className={mode ? styles.formtextdark : styles.formtextlight}>Edytuj projekt</h4>
          <Form
            onFinish={editProject}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 14,
            }}
            initialValues={{
              projectName,
              projectDescription,
            }}
          >
            <Form.Item
              label={
                <span className={mode ? styles.formtextdark : styles.formtextlight}>
                  Nazwa projektu
                </span>
              }
              name="projectName"
            >
              <Input className={mode ? styles.inputdark : styles.inputlight} />
            </Form.Item>
            <Form.Item
              label={
                <span className={mode ? styles.formtextdark : styles.formtextlight}>
                  Opis projektu
                </span>
              }
              name="projectDescription"
            >
              <Input className={mode ? styles.inputdark : styles.inputlight} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                Zapisz
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Users
          mode={mode}
          items={splitList}
          users={users}
          list={list}
          restOfUsers={restOfUsers}
          restOfFriends={restOfFriends}
          projectName={projectName}
          owner={project.owner}
          getProjects={getProjects}
          getUsers={getUsers}
        />
      </Row>
    </>
  );
};

Users.propTypes = {
  items: PropTypes.object,
  users: PropTypes.array,
  restOfUsers: PropTypes.array,
  list: PropTypes.string,
  projectName: PropTypes.string,
  owner: PropTypes.string,
  getProjects: PropTypes.func,
  getUsers: PropTypes.func,
  restOfFriends: PropTypes.array,
  mode: PropTypes.bool,
};

ProjectSettings.propTypes = {
  project: PropTypes.object,
  getProjects: PropTypes.func,
  getUsers: PropTypes.func,
  mode: PropTypes.bool,
};
export default ProjectSettings;
