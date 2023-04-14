import { React, useState, useContext } from 'react';
import { List, Card, Row, Col } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import styles from './ProjectList.module.css';
import MoveToProject from '../MoveToProject/MoveToProject';
import UsersInProjectList from '../UsersInProjectList/UsersInProjectList';
import LastTimeUpdateDisplay from '../LastTimeUpdateDisplay/LastTimeUpdateDisplay';
import DeleteProject from '../DeleteProject/DeleteProject';
import Chat from '../Chat/Chat';
import { DarkLightContext } from '../ContextDarkLightMode/ContextDarkLightMode';

const ProjectList = ({ projects = [], getProjects }) => {
  const { mode } = useContext(DarkLightContext);
  const [hasMore, setHasMore] = useState(true);
  const textColor = mode ? 'white' : 'black';
  const handleInfinitedOnLoad = () => {
    if (projects.lenght > 4) {
      setHasMore((previous) => !previous);
    }
  };
  return (
    <div>
      <div className={mode ? styles.listlight : styles.listdark}>
        <InfiniteScroll
          dataLength={projects.length}
          next={handleInfinitedOnLoad}
          hasMore={hasMore}
          useWindow="false"
          height={400}
        >
          <List
            dataSource={projects}
            renderItem={(item) => (
              <List.Item>
                <Card className={mode ? styles.cardlight : styles.carddark}>
                  <Row>
                    <Col span={20}>
                      <MoveToProject mode={mode} project={item} name={item.name} />
                      <p style={{ color: textColor }}>{item.description}</p>
                    </Col>
                    <Col style={{ align: 'right' }}>
                      <DeleteProject mode={mode} item={item} getProjects={getProjects} />
                    </Col>
                  </Row>
                  <Row>
                    <Col offset={1}>
                      <UsersInProjectList mode={mode} project={item} />
                    </Col>
                    <Col offset={1}>
                      <LastTimeUpdateDisplay mode={mode} update={item.update} />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <Chat />
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.array,
  getProjects: PropTypes.func,
};

export default ProjectList;
