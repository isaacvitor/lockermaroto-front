import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

import { AppContext } from '../AppContext';

class MainMenu extends Component {
  state = {
    showMe: false,
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
  componentDidMount() {
    const path = this.props.location.pathname;
    const menu = this.state.menus.filter(m => m.path === path);

    if (menu.length) {
      this.setState({ activeMenu: menu[0], showMe: true });
    } else {
      this.setState({ activeMenu: null, showMe: false });
    }
    this.onChangeSideBar(this.context.verticalMenu.visible);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      const path = nextProps.location.pathname;
      const menu = this.state.menus.filter(m => m.path === path);

      if (menu.length) {
        this.setState({ activeMenu: menu[0], showMe: true });
      } else {
        this.setState({ activeMenu: null, showMe: false });
      }
    }
    this.onChangeSideBar(this.context.verticalMenu.visible);
  }

  onChangeSideBar = visible => {
    const menus = this.state.menus;
    menus.forEach(m => {
      if (m.name === 'config') {
        m.disabled = visible;
      }
    });
    this.setState({ menus });
  };

  logout = () => {
    localStorage.clear(); //talvez seja radical demais..
    this.props.history.push('/');
  };

  handleItemClick = (e, { name }) => {
    const menu = this.state.menus.filter(m => m.name === name)[0];
    if (menu.path !== '') {
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

  render() {
    const { activeMenu, showMe, menus } = this.state;
    return (
      <div>
        {showMe && (
          <Menu icon="labeled" fixed="top" pointing widths={menus.length}>
            {menus.map(menu => (
              <Menu.Item
                key={menu.name}
                name={menu.name}
                active={activeMenu.name === menu.name}
                disabled={menu.disabled}
                color="grey"
                onClick={this.handleItemClick}
              >
                <Icon name={menu.icon} />
                {menu.text}
              </Menu.Item>
            ))}
          </Menu>
        )}
      </div>
    );
  }
}

MainMenu.contextType = AppContext;

export default withRouter(MainMenu);
