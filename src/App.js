import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import StartPage from './components/StartPage/StartPage';
import LogInPage from './components/LogInPage/LogInPage';
import MainPage from './components/MainPage/MainPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProjectPage from './components/ProjectPage/ProjectPage';
import { EmailProvider } from './components/EmailContext/EmailContext';
import { VariableProvider } from './components/VariableContext/VariableContext';
import GGLogIn from './components/GithubGoggleLogIn/GithubGoggleLogIn';
import { ChatProvider } from './components/ChatContext/ChatContext';
import { DarkLightModeProvider } from './components/ContextDarkLightMode/ContextDarkLightMode';

class App extends Component {
  componentDidMount = () => {
    fetch('http://localhost:3001')
      .then((response) => response.json())
      .then((database) => console.log(database));
  };

  render() {
    return (
      <DarkLightModeProvider>
        <EmailProvider>
          <VariableProvider>
            <ChatProvider>
              <BrowserRouter>
                <Switch>
                  <Route exact path="/" component={StartPage} />
                  <Route exact path="/login" component={LogInPage} />
                  <Route exact path="/registeracc" component={GGLogIn} />
                  <Route exact path="/register" component={RegisterPage} />
                  <Route exact path="/projectplanner" component={MainPage} />
                  <Route exact path="/project" component={ProjectPage} />
                  <Route path="*" component={() => '404 Not Found'} />
                </Switch>
              </BrowserRouter>
            </ChatProvider>
          </VariableProvider>
        </EmailProvider>
      </DarkLightModeProvider>
    );
  }
}

export default App;
