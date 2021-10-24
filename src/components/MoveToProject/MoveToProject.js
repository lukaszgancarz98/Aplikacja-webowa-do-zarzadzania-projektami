import React, { useContext } from 'react';
import { Button, Row, Col, Input, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VariableContext } from '../VariableContext/VariableContext';

const MoveToProject = ({ project, name }) => {
  const { newProject } = useContext(VariableContext);
  const history = useHistory();
  const openProject = () => {
    newProject(project);
    history.push('/project');
  };
  return (
    <>
      <Button type="text" onClick={openProject}>
        <h5>{name}</h5>
      </Button>
    </>
  );
};

MoveToProject.propTypes = {
  project: PropTypes.object,
  name: PropTypes.string,
};

export default MoveToProject;
