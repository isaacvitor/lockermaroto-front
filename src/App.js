import React, { Component, createRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { Login } from './components/routes/Login';
import Routes from './components/routes';
import { Ref, Segment, Sidebar, Responsive } from 'semantic-ui-react';
import { VerticalMenu } from './components/structure';
import MainMenu from './components/structure/MainMenu';

import { AppContext, context } from './components/AppContext';

class App extends Component {
  state = context;
  segmentRef;
  componentDidMount() {
    const vm = this.state.verticalMenu;
    vm.reference = createRef();
    this.segmentRef = this.state.verticalMenu.reference;
    this.setState({ verticalMenu: vm });
  }

  toggleVerticalMenu = () => {
    const verticalMenu = this.state.verticalMenu;
    /* verticalMenu.visible = !verticalMenu.visible;
    console.log('toggleVerticalMenu', verticalMenu.visible); */
    verticalMenu.visible = true;
    this.setState({ verticalMenu });
  };
  handleVerticalMenuHide = () => {
    const vm = this.state.verticalMenu;
    vm.visible = false;
    this.setState({ verticalMenu: vm });
  };

  handleHideClick = () => {
    const verticalMenu = this.state.verticalMenu;
    verticalMenu.visible = false;
    this.setState({ verticalMenu });
  };
  handleShowClick = () => {
    const verticalMenu = this.state.verticalMenu;
    verticalMenu.visible = true;
    this.setState({ verticalMenu });
  };

  handleSidebarHide = () => {
    const verticalMenu = this.state.verticalMenu;
    verticalMenu.visible = false;
    this.setState({ verticalMenu });
  };

  render() {
    //const { dimmed, verticalMenu } = this.state;

    return (
      <Router>
        <Responsive>
          <AppContext.Provider value={this.state}>
            <MainMenu handleShowClick={this.handleShowClick} />
            <VerticalMenu handleSidebarHide={this.handleSidebarHide} />
            <Sidebar.Pushable as={Segment} basic>
              <Sidebar.Pusher dimmed={false}>
                <Ref innerRef={this.segmentRef}>
                  <Segment className="main" basic>
                    <Switch>
                      {Routes.map(route => (
                        <PrivateRoute
                          key={route.path}
                          exact={route.exact}
                          path={route.path}
                          component={route.component}
                        />
                      ))}
                      <Route path="/login" component={Login} />
                    </Switch>
                  </Segment>
                </Ref>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </AppContext.Provider>
        </Responsive>
      </Router>
    );
  }
}

export default App;
