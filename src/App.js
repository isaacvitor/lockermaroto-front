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

  componentDidMount() {
    const vm = this.state.verticalMenu;
    vm.reference = createRef();
    this.setState({ verticalMenu: vm });
  }
  segmentRef = this.state.verticalMenu.reference;

  toggleVerticalMenu = () => {
    const vm = this.state.verticalMenu;
    vm.visible = !vm.visible;
    this.setState({ verticalMenu: vm });
  };
  handleVerticalMenuHide = () => {
    const vm = this.state.verticalMenu;
    vm.visible = false;
    this.setState({ verticalMenu: vm });
  };

  render() {
    //const { dimmed, verticalMenu } = this.state;

    return (
      <Router>
        <Responsive>
          <AppContext.Provider value={this.state}>
            <MainMenu toggleVerticalMenu={this.toggleVerticalMenu} />
            <VerticalMenu handleVerticalMenuHide={this.handleVerticalMenuHide} />

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
