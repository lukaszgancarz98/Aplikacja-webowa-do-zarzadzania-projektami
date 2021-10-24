import { React, useState } from 'react';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const NewProjectModal = ({ email, toggle, getProjects }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const saveToDatabase = (values) => {
    fetch('http://localhost:3000/createproject', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        projectName: values.projectName,
        projectDescription: values.projectDescription,
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

  const createNewProject = (values) => {
    setProjectName(values.projectName);
    setProjectDescription(values.projectDescription);
    saveToDatabase(values);
    getProjects();
    toggle();
  };

  return (
    <>
      <Form
        onFinish={createNewProject}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          projectName,
          projectDescription,
        }}
      >
        <Form.Item
          label="Nazwa projektu"
          name="projectName"
          rules={[
            {
              required: true,
              message: 'Wprowadź nazwę projektu!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Opis projektu"
          name="projectDescription"
          rules={[
            {
              required: true,
              message: 'Opisz swój projekt!',
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            Stwórz
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

NewProjectModal.propTypes = {
  email: PropTypes.string,
  toggle: PropTypes.func,
  getProjects: PropTypes.func,
};

export default NewProjectModal;
