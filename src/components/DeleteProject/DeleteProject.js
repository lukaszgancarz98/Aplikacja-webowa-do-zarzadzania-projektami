import { React } from 'react';
import { Dropdown, Button, Menu, Tag } from 'antd';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

const DeleteProject = ({ item = [], getProjects, mode }) => {
  const textColor = mode ? 'white' : 'black';
  const backgroundColor = mode ? 'rgb(26, 26, 26)' : 'white';
  const deleteTask = (value) => {
    fetch('http://localhost:3000/deleteproject', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: value.name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
    fetch('http://localhost:3000/deleteprojecttask', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectname: value.name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
    getProjects();
  };

  const onClick = ({ key }) => {
    if (key === '1') {
      deleteTask(item);
    }
  };
  return (
    <Dropdown
      overlay={
        <Button
          type="text"
          style={{ backgroundColor, color: textColor }}
          color="red"
          onClick={() => onClick()}
        >
          Usuń
        </Button>
      }
      overlayStyle={{ borderRadius: '20px' }}
      trigger={['click']}
    >
      <Button type="text">
        <PlusOutlined style={{ color: textColor }} />
      </Button>
    </Dropdown>
  );
};

DeleteProject.propTypes = {
  item: PropTypes.object,
  getProjects: PropTypes.func,
  mode: PropTypes.bool,
};

export default DeleteProject;
