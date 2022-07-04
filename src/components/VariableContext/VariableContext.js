import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const VariableContext = createContext();

export const VariableProvider = ({ children }) => {
  const emergencyProject = {
    name: 'undefined',
    owner: 'undefined',
    description: 'undefined',
    file: null,
    newFile: null,
    update: null,
    users: '',
  };
  const emergencyName = 'undefined';
  const [users, setUsers] = useState();
  const projectStorage = JSON.parse(localStorage.getItem('project'));
  const [project, setProject] = useState(
    projectStorage === null || projectStorage.length === 0 ? emergencyProject : projectStorage
  );
  const nameStorage = JSON.parse(localStorage.getItem('name'));
  const [name, setName] = useState(
    nameStorage === null || nameStorage === '' ? emergencyName : nameStorage
  );
  const newName = (value) => {
    localStorage.setItem('name', JSON.stringify(value));
    setName(value);
  };
  const newProject = (value) => {
    localStorage.setItem('project', JSON.stringify(value));
    setProject(value);
  };
  return (
    <VariableContext.Provider value={{ project, newProject, name, newName, users, setUsers }}>
      {children}
    </VariableContext.Provider>
  );
};

VariableProvider.propTypes = {
  children: PropTypes.any,
};
