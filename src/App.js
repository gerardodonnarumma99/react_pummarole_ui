import React from 'react';
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles'
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';
import Tomatoes from './pages/Tomatoes';
import Login from './pages/Login';
import PrivateRoute from './pages/PrivateRoute';
import MainPageLogin from "./pages/MainPageLogin";

const config = {
  themeName: "Test",
  palette: {
    primary: {
      main: '#E53D35'
    },
    background: {
      default: 'red'
    }
  }
};

const theme = createMuiTheme(config);

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  responseLoginGoogle = (response) => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn();
    const profil = JSON.stringify(response.profileObj);
    localStorage.setItem('timetoes_user', profil);
    this.redirect();
  }

  redirect = () => {
    this.props.history.push('/tomatoes');
  }

  render () {
    console.log("DATI",JSON.parse(localStorage.getItem('timetoes_user')));

    return (
      <React.Fragment>
          <MuiThemeProvider theme={theme}>
              <Switch>
                <PrivateRoute component={() => (
                  <MainPage> 
                    <Dashboard />
                  </MainPage>)} path="/" exact 
                />
                <PrivateRoute component={() => (
                  <MainPage> 
                    <Tomatoes />
                  </MainPage>)} path="/tomatoes" exact 
                />
                <Route key='login' path="/login"  exact render={ () => (
                      <MainPageLogin>
                        <Login responseLoginGoogle={this.responseLoginGoogle} />
                      </MainPageLogin>
                    )} 
                  />
              </Switch>
          </MuiThemeProvider>
      </React.Fragment>
    );
  } 
}

export default withRouter((App));
