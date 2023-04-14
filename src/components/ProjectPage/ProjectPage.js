import React, { useContext, useState, useEffect } from 'react';
import { Button, Space, Typography, Col, Row, Card, Popover, List, Tabs } from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Header } from 'antd/lib/layout/layout';
import ProjectSettings from '../ProjectSettings/ProjectSettings';
import ProjectFile from '../ProjectFile/ProjectFile';
import { VariableContext } from '../VariableContext/VariableContext';
import AddingNewTask from '../AddingNewTask/AddingNewTask';
import ChangeTaskType from '../ChangeTaskType/ChangeTaskType';
import ProjectPageActions from '../ProjectPageActions/ProjectPageActions';
import { EmailContext } from '../EmailContext/EmailContext';
import styles from './ProjectPage.module.css';
import { DarkLightContext } from '../ContextDarkLightMode/ContextDarkLightMode';
import Chat from '../Chat/Chat';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectPage = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState();
  const { project, newProject, setUsers } = useContext(VariableContext);
  const { mode } = useContext(DarkLightContext);
  const { email } = useContext(EmailContext);
  const [secoundModal, setSecoundModal] = useState();
  const textColor = mode ? 'white' : 'black';
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
      return <>/{userName}</>;
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
    <div className={mode ? styles.divdark : styles.divlight}>
      <Header>
        <Button
          type="primary"
          shape="round"
          style={{ background: 'green', borderColor: 'green' }}
          onClick={() => backToProjects()}
        >
          Powrót
        </Button>
      </Header>
      <Modal isOpen={secoundModal} toggle={secoundToggle}>
        <ModalHeader className={mode ? styles.modaldark : styles.modallight} toggle={secoundToggle}>
          <span style={{ color: textColor }}>{project.name}</span>
        </ModalHeader>
        <ModalBody className={mode ? styles.modaldark : styles.modallight}>
          <AddingNewTask
            mode={mode}
            email={email}
            getTasks={getTasks}
            secoundToggle={secoundToggle}
            project={project}
          />
        </ModalBody>
      </Modal>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span style={{ color: textColor }}>Projekt</span>} key="1">
          <div>
            <Col className={mode ? styles.mainColdark : styles.mainCollight}>
              <Row gutter={30}>
                <Col className={styles.scroll}>
                  <Card className={mode ? styles.carddark : styles.cardlight}>
                    <Row>
                      <Title level={3} style={{ color: textColor }}>
                        Zaplanowane
                      </Title>
                    </Row>
                    <InfiniteScroll
                      dataLength={isNew(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisNew(isNew(getTaskForView(tasks)))}
                      hasMore={hasMoreisNew}
                      useWindow="false"
                      height={600}
                    >
                      {isNew(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={mode ? styles.itemsdark : styles.itemslight}>
                            <Row>
                              <Col span={18}>
                                <Popover placement="left" content="xd" trigger="hover">
                                  <h6>{item.taskname}</h6>
                                </Popover>
                              </Col>
                              <Col>
                                <ProjectPageActions
                                  mode={textColor}
                                  item={item}
                                  getTasks={getTasks}
                                />
                              </Col>
                            </Row>
                            <p style={{ color: textColor }}>
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
                            <p style={{ color: textColor }}>{createdBy(item.createdby)}</p>
                            <ChangeTaskType mode={textColor} item={item} getTasks={getTasks} />
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
                  <Card className={mode ? styles.carddark : styles.cardlight}>
                    <Title level={3} style={{ color: textColor }}>
                      Realizowane
                    </Title>
                    <InfiniteScroll
                      dataLength={isInProgress(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisInProgress(isInProgress(getTaskForView(tasks)))}
                      hasMore={hasMoreisDone}
                      useWindow="false"
                      height={600}
                    >
                      {isInProgress(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={mode ? styles.itemsdark : styles.itemslight}>
                            <Row>
                              <Col span={18}>
                                <Popover placement="left" content="xd" trigger="hover">
                                  <h6>{item.taskname}</h6>
                                </Popover>
                              </Col>
                              <Col>
                                <ProjectPageActions
                                  mode={textColor}
                                  item={item}
                                  getTasks={getTasks}
                                />
                              </Col>
                            </Row>
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
                            <ChangeTaskType mode={textColor} item={item} getTasks={getTasks} />
                          </Card>
                        </List.Item>
                      ))}
                    </InfiniteScroll>
                  </Card>
                </Col>
                <Space />
                <Col className={styles.scroll}>
                  <Card className={mode ? styles.carddark : styles.cardlight}>
                    <Title level={3} style={{ color: textColor }}>
                      Zrealizowane
                    </Title>
                    <InfiniteScroll
                      dataLength={isDone(getTaskForView(tasks)).length}
                      next={handleInfinitedOnLoadisDone(isDone(getTaskForView(tasks)))}
                      hasMore={hasMoreisInProgress}
                      useWindow="false"
                      height={600}
                    >
                      {isDone(getTaskForView(tasks)).map((item) => (
                        <List.Item>
                          <Card className={mode ? styles.itemsdark : styles.itemslight}>
                            <Row>
                              <Col span={18}>
                                <Popover placement="left" content="xd" trigger="hover">
                                  <h6>{item.taskname}</h6>
                                </Popover>
                              </Col>
                              <Col>
                                <ProjectPageActions
                                  mode={textColor}
                                  item={item}
                                  getTasks={getTasks}
                                />
                              </Col>
                            </Row>
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
                            <ChangeTaskType mode={textColor} item={item} getTasks={getTasks} />
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
        <TabPane tab={<span style={{ color: textColor }}>{projectName}</span>} key="2">
          <ProjectSettings
            mode={mode}
            project={project}
            getProjects={getProjects}
            getUsers={getUsers}
          />
        </TabPane>
        <TabPane tab={<span style={{ color: textColor }}>Plik</span>} key="3">
          <ProjectFile project={project} />
        </TabPane>
      </Tabs>
      <Chat />
    </div>
  );
};

export default ProjectPage;
