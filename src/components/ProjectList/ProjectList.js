import { React, useState } from 'react';
import { List, Card, Row, Col } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import styles from './ProjectList.module.css';
import MoveToProject from '../MoveToProject/MoveToProject';
import UsersInProjectList from '../UsersInProjectList/UsersInProjectList';
import LastTimeUpdateDisplay from '../LastTimeUpdateDisplay/LastTimeUpdateDisplay';
import DeleteProject from '../DeleteProject/DeleteProject';
import Chat from '../Chat/Chat';

const ProjectList = ({ projects = [], getProjects }) => {
  const [hasMore, setHasMore] = useState(true);
  const handleInfinitedOnLoad = () => {
    if (projects.lenght > 4) {
      setHasMore((previous) => !previous);
    }
  };
  return (
    <div>
      <div className={styles.list}>
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
                <Card className={styles.card}>
                  <Row>
                    <Col>
                      <MoveToProject project={item} name={item.name} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>{item.description}</p>
                      <DeleteProject item={item} getProjects={getProjects} />
                    </Col>
                    <Col>
                      <UsersInProjectList project={item} />
                    </Col>
                    <Col>
                      <LastTimeUpdateDisplay update={item.update} />
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
