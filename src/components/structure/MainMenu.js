import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

class MainMenu extends Component {
  state = {
    showMe: false,
    menus: [
      {
        name: 'lockers',
        text: 'Lockers',
        icon: 'boxes',
        path: '/',
        restrict: false
      },
      {
        name: 'users',
        text: 'Usuários',
        icon: 'users',
        path: '/config/users',
        restrict: true
      },
      {
        name: 'config',
        text: 'Configurações',
        icon: 'cogs',
        path: '',
        restrict: true
      },
      { name: 'logout', text: 'Sair', icon: 'sign-out', path: '', restrict: false, active: false }
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
  }

  logout = () => {
    localStorage.clear(); //talvez seja radical demais..
    this.props.history.push('/');
  };

  toggleSidebar() {
    this.props.toggleVerticalMenu();
  }

  handleItemClick = (e, { name }) => {
    const menu = this.state.menus.filter(m => m.name === name)[0];
    if (menu.path !== '') {
      this.props.history.push(menu.path);
    } else {
      switch (menu.name) {
        case 'config':
          this.toggleSidebar();
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
          <Menu icon="labeled" fixed="top" fluid={true} pointing widths={menus.length}>
            {menus.map(menu => (
              <Menu.Item
                key={menu.name}
                name={menu.name}
                active={activeMenu.name === menu.name}
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

export default withRouter(MainMenu);
