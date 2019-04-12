import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';

import { AppContext } from '../AppContext';

class VerticalMenu extends Component {
  state = {
    animation: 'overlay',
    direction: 'left',
    onHide: this.props.handleVerticalMenuHide
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  //= function({ visible, reference, handleVerticalMenuHide })
  render() {
    const { animation, direction } = this.state;
    const { visible, reference } = this.context.verticalMenu;
    return (
      <Sidebar
        as={Menu}
        animation={animation}
        direction={direction}
        onHide={this.props.handleVerticalMenuHide}
        target={reference}
        vertical
        size="huge"
        inverted
        visible={visible}
      >
        <Segment basic>
          <Header as="h4" color="green">
            <Icon name="lock" />
            <Header.Content>LockerMaroto</Header.Content>
          </Header>
        </Segment>

        <Menu.Item>
          <Icon name="boxes" />
          Lockers
          <Menu.Menu>
            <Menu.Item name="search" onClick={this.handleItemClick}>
              Listar
            </Menu.Item>
            <Menu.Item name="add" onClick={this.handleItemClick}>
              Configurar
            </Menu.Item>
            <Menu.Item name="about" onClick={this.handleItemClick}>
              Remove
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Icon name="users" />
          Usuários
          <Menu.Menu>
            <Menu.Item name="search" onClick={this.handleItemClick}>
              Listar
            </Menu.Item>
            <Menu.Item name="add" onClick={this.handleItemClick}>
              Configurar
            </Menu.Item>
            <Menu.Item name="about" onClick={this.handleItemClick}>
              Remove
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
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
