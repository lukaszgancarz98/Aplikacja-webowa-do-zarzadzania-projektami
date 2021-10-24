import React, { useContext, useState, useEffect } from 'react';
import { Button, Space, Typography, Col, Row, Card, Popover, List, Tabs } from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ProjectSettings from '../ProjectSettings/ProjectSettings';
import ProjectFile from '../ProjectFile/ProjectFile';
import { VariableContext } from '../VariableContext/VariableContext';
import AddingNewTask from '../AddingNewTask/AddingNewTask';
import ChangeTaskType from '../ChangeTaskType/ChangeTaskType';
import ProjectPageActions from '../ProjectPageActions/ProjectPageActions';
import { EmailContext } from '../EmailContext/EmailContext';
import styles from './ProjectPage.module.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectPage = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState();
  const { project, newProject, setUsers } = useContext(VariableContext);
  console.log(project);
  const { email } = useContext(EmailContext);
  const [secoundModal, setSecoundModal] = useState();
  const secoundToggle = () => {
    setSecoundModal((previous) => !previous);
  };

  const backToProjects = () => {
    history.push('/projectplanner');
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
          newProject(
            data.find((proj) => proj.name === project.name && proj.owner === project.owner)
          );
        }
      });
  };
  const getTasks = () => {
    fetch('http://localhost:3000/gettasks', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        } else {
          setTasks(data);
        }
      });
  };
  const getTaskForView = (tasks = []) => tasks.filter((task) => task.projectname === project.name);
  const isNew = (tasks = []) => tasks.filter((task) => task.type === 'new');
  const isInProgress = (tasks = []) => tasks.filter((task) => task.type === 'inprogress');
  const isDone = (tasks = []) => tasks.filter((task) => task.type === 'done');
  let projectName;
  if (project) {
    projectName = `Ustawienia ${project.name}`;
  } else {
    projectName = `;c`;
  }

  useEffect(() => {
    getTasks();
    getProjects();
    getUsers();
  }, []);

  const answer = (value) => {
    if (value === 0) {
      return <>mniej godzinę temu</>;
    }
    if (value === 1) {
      return <>godzinę temu</>;
    }
    if (value >= 2 && value <= 21) {
      return <>{value} godziny temu</>;
    }
    if (value >= 22 && value <= 23) {
      return <>{value} godziny temu</>;
    }
    if (value >= 24 && value <= 47) {
      return <>dzień temu</>;
    }
    if (value >= 48 && value <= 71) {
      return <>dwa dni temu</>;
    }
    if (value >= 72 && value <= 96) {
      return <>trzy dni temu</>;
    }
  };
  const createdBy = (userName) => {
    if (userName !== '') {
      return <>Stworzone przez {userName}</>;
    }
    return <></>;
  };
  const [hasMoreisNew, setHasMoreisNew] = useState(true);
  const [hasMoreisDone, setHasMoreisDone] = useState(true);
  const [hasMoreisInProgress, setHasMoreisInProgress] = useState(true);
  const handleInfinitedOnLoadisNew = (value) => {
    if (value.lenght > 4) {
      setHasMoreisNew((previous) => !previous);
    }
  };
  const handleInfinitedOnLoadisDone = (value) => {
    if (value.lenght > 4) {
      setHasMoreisDone((previous) => !previous);
    }
  };
  const handleInfinitedOnLoadisInProgress = (value) => {
    if (value.lenght > 8) {
      setHasMoreisInProgress((previous) => !previous);
    }
  };
  return (
    <>
      <Button
        type="primary"
        shape="round"
        style={{ background: 'green', borderColor: 'green' }}
        onClick={() => backToProjects()}
      >
        Powrót
      </Button>
      <Modal isOpen={secoundModal} toggle={secoundToggle}>
        <ModalHeader toggle={secoundToggle}>{project.name}</ModalHeader>
        <ModalBody>
          <AddingNewTask
            email={email}
            getTasks={getTasks}
            secoundToggle={secoundToggle}
            project={project}
          />
        </ModalBody>
      </Modal>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Projekt" key="1">
          <div>
            <Col className={styles.mainCol}>
              <Row gutter={30}>
                <Col className={styles.scroll}>
                  <Card>
                    <Row>
                      <Title level={3}>Zaplanowane</Title>
                    </Row>
                    <InfiniteScroll
                      dataLength={isNew(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisNew(isNew(getTaskForView(tasks)))}
                      hasMore={hasMoreisNew}
                      useWindow="false"
                      height={700}
                    >
                      {isNew(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={styles.card}>
                            <Row justify="end">
                              <ProjectPageActions item={item} getTasks={getTasks} />
                            </Row>
                            <Popover placement="left" content="xd" trigger="hover">
                              <h6>{item.taskname}</h6>
                            </Popover>
                            <p>
                              Utworzono:{' '}
                              {answer(
                                Math.floor(
                                  moment
                                    .duration(
                                      moment(new Date()).diff(moment(new Date(item.createtime)))
                                    )
                                    .asHours()
                                )
                              )}
                            </p>
                            <p>{createdBy(item.createdby)}</p>
                            <ChangeTaskType item={item} getTasks={getTasks} />
                          </Card>
                        </List.Item>
                      ))}
                    </InfiniteScroll>
                  </Card>
                  <Button
                    type="primary"
                    shape="round"
                    style={{ background: 'green', borderColor: 'green' }}
                    onClick={secoundToggle}
                  >
                    Utwórz zadanie
                  </Button>
                </Col>
                <Space />
                <Col className={styles.scroll}>
                  <Card>
                    <Title level={3}>Realizowane</Title>
                    <InfiniteScroll
                      dataLength={isInProgress(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisInProgress(isInProgress(getTaskForView(tasks)))}
                      hasMore={hasMoreisDone}
                      useWindow="false"
                      height={700}
                    >
                      {isInProgress(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={styles.card}>
                            <Row justify="end">
                              <ProjectPageActions item={item} getTasks={getTasks} />
                            </Row>
                            <Popover placement="left" content="xd" trigger="hover">
                              <h6>{item.taskname}</h6>
                            </Popover>
                            <p>
                              Utworzono:{' '}
                              {answer(
                                Math.floor(
                                  moment
                                    .duration(
                                      moment(new Date()).diff(moment(new Date(item.createtime)))
                                    )
                                    .asHours()
                                )
                              )}
                            </p>
                            <p>{createdBy(item.createdby)}</p>
                            <ChangeTaskType item={item} getTasks={getTasks} />
                          </Card>
                        </List.Item>
                      ))}
                    </InfiniteScroll>
                  </Card>
                </Col>
                <Space />
                <Col className={styles.scroll}>
                  <Card>
                    <Title level={3}>Zrealizowane</Title>
                    <InfiniteScroll
                      dataLength={isDone(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisDone(isDone(getTaskForView(tasks)))}
                      hasMore={hasMoreisInProgress}
                      useWindow="false"
                      height={700}
                    >
                      {isDone(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={styles.card}>
                            <Row justify="end">
                              <ProjectPageActions item={item} getTasks={getTasks} />
                            </Row>
                            <Popover placement="left" content="xd" trigger="hover">
                              <h6>{item.taskname}</h6>
                            </Popover>
                            <p>
                              Utworzono:{' '}
                              {answer(
                                Math.floor(
                                  moment
                                    .duration(
                                      moment(new Date()).diff(moment(new Date(item.createtime)))
                                    )
                                    .asHours()
                                )
                              )}
                            </p>
                            <p>{createdBy(item.createdby)}</p>
                            <ChangeTaskType item={item} getTasks={getTasks} />
                          </Card>
                        </List.Item>
                      ))}
                    </InfiniteScroll>
                  </Card>
                </Col>
              </Row>
            </Col>
          </div>
        </TabPane>
        <TabPane tab={projectName} key="2">
          <ProjectSettings project={project} getProjects={getProjects} getUsers={getUsers} />
        </TabPane>
        <TabPane tab="txt" key="3">
          <ProjectFile project={project} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ProjectPage;
