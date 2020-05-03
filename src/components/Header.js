import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    IconButton
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import UserInfo from "./UserInfo";
import logo from "./../images/logo.png";

class Header extends React.Component {
  render () {
    const { history } = this.props;

    //const profil =  ( localStorage.getItem('timetoes_user') ) ? JSON.parse( localStorage.getItem('timetoes_user') ) : '';

    const profil = JSON.parse( localStorage.getItem('timetoes_user') );

    return (
      <AppBar position="static">
        <Toolbar>
          <Grid alignItems={'left'} xs={12} md={1} lg={1}>
            <Button onClick={() => history.push('/') } color="primary"> 
              <img alt="Timetoes" src={logo} width={48} height={48}/>
            </Button>
          </Grid>
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            >
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Button onClick={() => history.push('/') } color="inherit"> Dashboard</Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Button onClick={() => history.push('/tomatoes') } color="inherit">Tomatoes</Button>
            </Grid>
          </Grid>
          { profil  ? (
          <Grid alignItems={'right'} xs={12} md={4} lg={2}>
            <UserInfo profil={profil} />
          </Grid> ) : ('') 
          }
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Header);