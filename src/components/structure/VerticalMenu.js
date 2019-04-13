import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
        path: '/',
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
        name: 'config',
        text: 'Configurações',
        icon: 'cogs',
        path: '',
        disabled: this.context.verticalMenu.visible,
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

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

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
        onHide={this.props.handleSidebarHide}
        vertical
        inverted
        icon="labeled"
        width="thin"
        visible={visible}
      >
        {menus.map(m => (
          <Menu.Item key={m.name} as="a">
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

export { VerticalMenu };
