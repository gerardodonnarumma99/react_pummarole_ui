import React from 'react';
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles'
import { Route, Switch, withRouter } from "react-router-dom";
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';
import Tomatoes from './pages/Tomatoes';
import { red } from '@material-ui/core/colors';

const config = {
  themeName: "Test",
  palette: {
    primary: {
      main: '#E53D35'
    },
    background: {
      default: '#F2F2F2'
    }
  }
};

const theme = createMuiTheme(config)

class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <MainPage>
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/tomatoes" exact component={Tomatoes} />
            </Switch>
          </MainPage>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter((App));
