import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const DarkLightContext = createContext();

export const DarkLightModeProvider = ({ children }) => {
  const startMode = true;
  const modeStorage = JSON.parse(localStorage.getItem('mode'));
  const [mode, setMode] = useState(modeStorage === null ? startMode : modeStorage);
  const newMode = (value) => {
    localStorage.setItem('mode', JSON.stringify(!value));
    setMode(!value);
  };
  return (
    <DarkLightContext.Provider value={{ mode, newMode }}>{children}</DarkLightContext.Provider>
  );
};

DarkLightModeProvider.propTypes = {
  children: PropTypes.any,
};
