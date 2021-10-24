import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Row, Col, Typography, Space, Tooltip, Tabs, Card } from 'antd';
import { Modal, ModalHeader } from 'reactstrap';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { EmailContext } from '../EmailContext/EmailContext';
import { VariableContext } from '../VariableContext/VariableContext';

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
      <Row>
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
      <Row>
        <Space direction="vertical">
          {arrFilter.map((item) => (
            <Text>{displayUsers(item)}</Text>
          ))}
        </Space>
      </Row>
    );
  } else {
    disusersList = <>Tutaj nikogo nie ma! </>;
  }
  let friendList = <></>;
  if (restOfFriends.length === undefined || restOfFriends.length === 0) {
    friendList = <>Nie masz żadnych znajomych</>;
  } else {
    friendList = (
      <>
        {restOfFriends.map((user) => (
          <>
            <Space direction="horizontal">
              <Text>{user}</Text>
              <Tooltip title="Dodaj" placement="right">
                <Button type="text" onClick={() => addUser(user)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
            </Space>
          </>
        ))}
      </>
    );
  }
  let addUserButton = <></>;
  if (email === owner) {
    addUserButton = (
      <>
        <Button onClick={() => toggle()}>Dodaj użytkownika</Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Znajomi" key="1">
                <Space direction="vertical">{friendList}</Space>
              </TabPane>
              <TabPane tab="Użytkownicy" key="2">
                <Space direction="vertical">
                  {restOfUsers.map((user) => (
                    <Row>
                      <Space direction="horizontal">
                        <Text>{user.email}</Text>
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
          </ModalHeader>
        </Modal>
      </>
    );
  }
  return (
    <>
      <Space direction="vertical">
        <Card title="Użytkownicy">
          {disusersList}
          {addUserButton}
        </Card>
      </Space>
    </>
  );
};

const ProjectSettings = ({ project, getProjects, getUsers }) => {
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
        <Col>
          Edytuj projekt
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
            <Form.Item label="Nazwa projektu" name="projectName">
              <Input />
            </Form.Item>
            <Form.Item label="Opis projektu" name="projectDescription">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                Zapisz
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Users
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
};

ProjectSettings.propTypes = {
  project: PropTypes.object,
  getProjects: PropTypes.func,
  getUsers: PropTypes.func,
};
export default ProjectSettings;
