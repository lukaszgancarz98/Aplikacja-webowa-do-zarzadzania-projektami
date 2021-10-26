import React, { useContext } from 'react';
import { Button, Row, Col, Input, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VariableContext } from '../VariableContext/VariableContext';

const MoveToProject = ({ project, name, mode }) => {
  const { newProject } = useContext(VariableContext);
  const textColor = mode ? 'white' : 'black';
  const history = useHistory();
  const openProject = () => {
    newProject(project);
    history.push('/project');
  };
  return (
    <>
      <Button style={{ color: textColor, fontSize: 'x-large' }} type="text" onClick={openProject}>
        {name}
      </Button>
    </>
  );
};

MoveToProject.propTypes = {
  project: PropTypes.object,
  name: PropTypes.string,
  mode: PropTypes.bool,
};

export default MoveToProject;
