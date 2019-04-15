import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';

import { AppContext } from '../AppContext';

class VerticalMenu extends Component {
  state = {
    animation: 'push', //push, slide out, slide along
    direction: 'left',
    onHide: this.props.handleVerticalMenuHide,
    menus: [
      {
        name: 'lockers',
        text: 'Lockers',
        icon: 'boxes',
        path: '/config/lockers',
        disabled: false,
        restrict: false
      },
      {
        name: 'users',
        text: 'Usuários',
        icon: 'users',
        path: '/config/users',
        disabled: false,
        restrict: true
      },
      {
        name: 'logout',
        text: 'Sair',
        icon: 'sign-out',
        path: '',
        disabled: false,
        restrict: false
      }
    ],
    activeMenu: null
  };

  logout = () => {
    localStorage.clear(); //talvez seja radical demais..
    this.props.handleSidebarHide();
    this.props.history.push('/login');
  };

  handleItemClick = menu => {
    if (menu.path !== '') {
      this.props.handleSidebarHide();
      this.props.history.push(menu.path);
    } else {
      switch (menu.name) {
        case 'config':
          this.props.handleShowClick();
          break;
        case 'logout':
          this.logout();
          break;
        default:
          break;
      }
    }
  };

  //= function({ visible, reference, handleVerticalMenuHide })
  render() {
    const { animation, direction, menus } = this.state;
    const { visible, reference } = this.context.verticalMenu;
    return (
      <Sidebar
        as={Menu}
        animation={animation}
        direction={direction}
        target={reference}
        vertical
        inverted
        icon="labeled"
        width="thin"
        visible={visible}
      >
        {menus.map(m => (
          <Menu.Item key={m.name} as="a" onClick={this.handleItemClick.bind(this, m)}>
            <Icon name={m.icon} />
            {m.text}
          </Menu.Item>
        ))}
      </Sidebar>
    );
  }
}
VerticalMenu.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

VerticalMenu.contextType = AppContext;

export default withRouter(VerticalMenu);
