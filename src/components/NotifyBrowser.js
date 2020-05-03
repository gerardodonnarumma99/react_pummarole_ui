import React from 'react';
import ReactNotifications from 'react-browser-notifications';
 
class NotifyBrowser extends React.Component {
    constructor() {
        super();
        this.showNotifications = this.showNotifications.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    showNotifications() {
    // If the Notifications API is supported by the browser
    // then show the notification
        if(this.n.supported()) this.n.show();
    }
    
    handleClick(event) {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")
    
    // Lastly, Close the notification
        this.n.close(event.target.tag);
    }
 
  render() {
    return (
      <React.Fragment>
 
        <ReactNotifications
          onRef={ref => (this.n = ref)} // Required
          title="Hai terminato un timer!" // Required
          body="Timer terminato con successo."
          icon="icon.png"
          tag="abcdef"
          timeout="5000"
          onClick={event => this.handleClick(event)}
        />
        
      </React.Fragment>
    )
  }
}

export default NotifyBrowser;