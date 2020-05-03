import { Switch, Route, Redirect } from "react-router-dom";
import Login from '../pages/Login'

export default PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      props.isLoggedIn === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            component: {Login},
            state: { from: props.location }
          }}
        />
      )
    }
  />
);