import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header';
import SignUp from './SignUp';
import LogIn from './LogIn';
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Switch>
          <Route path={'/signup'} component={SignUp} />
          <Route path={'/login'} component={LogIn} />
          <Route component={Header} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
