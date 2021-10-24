import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

const ChangeTaskType = ({ item = [], getTasks }) => {
  const typeInProgress = 'inprogress';
  const typeDone = 'done';
  const changeType = (event) => {
    fetch('http://localhost:3000/updatetask', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectname: item.projectname,
        taskname: item.taskname,
        type: event,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        }
        getTasks();
      });
  };
  let action = <></>;
  if (item.type === 'new') {
    action = (
      <Row>
        <Button type="primary" onClick={() => changeType(typeInProgress)}>
          <RightOutlined />
        </Button>
      </Row>
    );
  } else if (item.type === 'inprogress') {
    action = (
      <Row>
        <Button type="primary" onClick={() => changeType(typeDone)}>
          <RightOutlined />
        </Button>
      </Row>
    );
  } else if (item.type === 'done') {
    action = (
      <Row>
        <Button type="primary" onClick={() => changeType(typeInProgress)}>
          <LeftOutlined />
        </Button>
      </Row>
    );
  }
  return <>{action}</>;
};

ChangeTaskType.propTypes = {
  item: PropTypes.object,
  getTasks: PropTypes.func,
};

export default ChangeTaskType;
