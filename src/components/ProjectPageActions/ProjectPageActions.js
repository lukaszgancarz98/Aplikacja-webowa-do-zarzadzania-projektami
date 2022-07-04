import React from 'react';
import { Button, Tag, Dropdown, Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const ProjectPageActions = ({ item = [], getTasks, mode }) => {
  const deleteTask = (value) => {
    fetch('http://localhost:3000/deletetask', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskname: value.taskname,
        projectname: value.projectname,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
    getTasks();
  };
  const onClick = ({ key }) => {
    if (key === '1') {
      deleteTask(item);
    }
  };
  return (
    <Dropdown
      overlay={
        <Button type="text" style={{ backgroundColor: mode }}>
          Usuń
        </Button>
      }
      overlayStyle={{ backgroundColor: mode }}
      trigger={['click']}
    >
      <Button type="text">
        <PlusOutlined style={{ color: mode }} />
      </Button>
    </Dropdown>
  );
};

ProjectPageActions.propTypes = {
  item: PropTypes.object,
  getTasks: PropTypes.func,
  mode: PropTypes.string,
};

export default ProjectPageActions;
