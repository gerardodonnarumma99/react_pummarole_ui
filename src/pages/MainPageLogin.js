import React from "react";
import { withRouter } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import Image from 'material-ui-image'
import logo from './../images/logo_login.png'

class MainPageLogin extends React.Component {

  render () {
    const { children } = this.props;

    console.log(children);

    return (
        <main>

          <div style={{
              padding: 50
          }}></div>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant={'h2'} color={'primary'}>Timetoes</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <img alt="Timetoes" src={logo} width={300} height={300}/>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              {children}
            </Grid>
            
          </Grid>

        </main>
    )
  }
}

export default withRouter(MainPageLogin);