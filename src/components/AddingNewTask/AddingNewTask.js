import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './AddingNewTask.module.css';

const AddingNewTask = ({ project, secoundToggle, getTasks, email, mode }) => {
  const [taskName] = useState();
  const createTask = (value) => {
    fetch('http://localhost:3000/createtask', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectname: project.name,
        name: value.taskName,
        owner: project.owner,
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
    secoundToggle();
    getTasks();
  };
  return (
    <>
      <Form
        onFinish={createTask}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 14,
        }}
        initialValues={{
          taskName,
        }}
      >
        <Form.Item
          label={<span className={mode ? styles.divdark : styles.divlight}>Nazwa zadania</span>}
          name="taskName"
        >
          <Input className={mode ? styles.inputdark : styles.inputlight} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            style={{ background: 'green', borderColor: 'green' }}
          >
            Utwórz
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

AddingNewTask.propTypes = {
  project: PropTypes.string,
  secoundToggle: PropTypes.func,
  getTasks: PropTypes.func,
  email: PropTypes.string,
  mode: PropTypes.bool,
};

export default AddingNewTask;
