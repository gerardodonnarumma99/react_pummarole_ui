import React from "react";
import Header from "./../components/Header";
import { withRouter } from "react-router-dom";

class MainPage extends React.Component {
  render () {
    const { children } = this.props;

    return (
      <main>
        <Header />
        <div style={{
          padding: 20
        }}>
          {children}
        </div>
      </main>
        
    )
  }
}

export default withRouter(MainPage);