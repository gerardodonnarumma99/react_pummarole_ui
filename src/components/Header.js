import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

class Header extends React.Component {
  render () {
    const { history } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            TIMETOES
          </Typography>
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            >
            <Grid item>
              <Button onClick={() => history.push('/') } color="inherit"> Dashboard</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push('/tomatoes') } color="inherit">Tomatoes</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Header);