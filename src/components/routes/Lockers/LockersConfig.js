import React, { Component } from 'react';
import { socket as io } from '../../../services/io';
import { listLockers, updateRemoteUsers, updateEKeyUsers } from '../../../services/api/lockers';
import { listUsers } from '../../../services/api/users';
import {
  Header,
  Icon,
  Button,
  Card,
  List,
  Placeholder,
  Modal,
  Segment,
  Label
} from 'semantic-ui-react';

import { AppContext } from '../../AppContext';
io.on('updateKeyWith');

class LockersConfig extends Component {
  state = {
    isLoadingLockers: false,
    isOpenModalRemote: false,
    isOpenModalEKey: false,
    isLoadingUsers: false,
    lockers: [],
    users: [],
    lockerSelected: null
  };

  async componentDidMount() {
    this.subscribeIOEvents();
    this.fetchLocker();
  }
  fetchLocker = async () => {
    this.setState({ isLoadingLockers: true });
    let { lockerSelected } = this.state;
    console.log('lockerSelected', lockerSelected);
    try {
      const { data } = await listLockers();
      if (lockerSelected) {
        data.forEach(l => {
          if (lockerSelected._id === l._id) {
            lockerSelected = l;
          }
        });
      }
      this.setState({ lockers: data, isLoadingLockers: false, lockerSelected, users: [] });
    } catch (err) {
      console.log(err.message);
    }
  };
  componentWillUnmount() {
    this.unsubscribeIOEvents();
  }

  toggleSelectLocker = locker => {
    const { lockerSelected } = this.state;
    if (lockerSelected) {
      if (lockerSelected._id === locker._id) {
        this.setState({ lockerSelected: null, users: [] });
      } else {
        this.setState({ lockerSelected: Object.assign(locker), users: [] });
      }
    } else {
      this.setState({ lockerSelected: Object.assign(locker), users: [] });
    }
  };

  //Modals - Access Remote and Access EKey
  prepareUsers = () => {
    let { lockerSelected, users } = this.state;
    let usersRemote = lockerSelected.remoteUsers;
    let usersEKey = lockerSelected.eKeyUsers;
    users.forEach(u => {
      u.ar = false;
      u.ak = false;
    });
    usersRemote.forEach(u => (u.ar = true));
    usersEKey.forEach(u => (u.ak = true));

    users.forEach(u => {
      usersRemote.forEach(ur => {
        if (ur._id === u._id) {
          u.ar = true;
        }
      });
      usersEKey.forEach(uk => {
        if (uk._id === u._id) {
          u.ak = true;
        }
      });
    });
    this.setState({ users, lockerSelected });
  };

  //Modal Remote
  toggleAccesUserRemote = user => {
    console.log('toogleAccesUserRemote', user);
    const users = this.state.users;
    users.forEach(u => {
      if (u._id === user._id) {
        u.ar = !u.ar;
      }
    });
    this.setState({ users });
  };
  openModalRemote = () => {
    this.setState({ isOpenModalRemote: true, isLoadingUsers: true }, async () => {
      const { data } = await listUsers();
      this.setState({ users: data, isLoadingUsers: false }, this.prepareUsers);
    });
  };
  closeModalRemote = () => {
    this.setState({ isOpenModalRemote: false, users: [] });
  };
  saveUsersRemote = async () => {
    const { lockerSelected, users } = this.state;
    const remoteUsers = users.filter(u => u.ar === true);
    try {
      const { data } = await updateRemoteUsers(lockerSelected._id, remoteUsers);
      console.log('remoteUsersUpdated', data);
      this.setState({ isOpenModalRemote: false }, this.fetchLocker);
    } catch (error) {
      console.log('Error', error);
    }
  };

  //Modal EKey
  openModalEKey = () => {
    this.setState({ isOpenModalEKey: true, isLoadingUsers: true }, async () => {
      const { data } = await listUsers();
      this.setState({ users: data, isLoadingUsers: false }, this.prepareUsers);
    });
  };

  closeModalEKey = () => {
    this.setState({ isOpenModalEKey: false, users: [] });
  };

  saveEKeyUsers = async () => {
    const { lockerSelected, users } = this.state;
    const eKeyUsers = users.filter(u => u.ak && u.ekey.trim() !== '');
    try {
      const { data } = await updateEKeyUsers(lockerSelected._id, eKeyUsers);
      console.log('eKeyUsersUpdated', data);
      this.setState({ isOpenModalEKey: false }, this.fetchLocker);
    } catch (error) {
      console.log('Error', error);
    }
  };

  handleSaveConfig = () => {
    this.setState({ lockerSelected: null });
  };

  toggleAccesEKeyUser = user => {
    console.log('toggleAccesEKeyUser', user);
    const users = this.state.users;
    users.forEach(u => {
      if (u._id === user._id) {
        u.ak = !u.ak;
      }
    });
    this.setState({ users });
  };

  //Lockers
  mountStateIcon = locker => {
    if (locker.codeState === '111' || locker.codeState === '110') {
      return <Icon name="lock" color="green" />;
    } else if (locker.codeState === '101' || locker.codeState === '101') {
      return <Icon name="unlock" color="orange" />;
    } else if (locker.codeState === '000') {
      return <Icon name="lock open" color="red" />;
    } else {
      return <Icon name="thumbs down" color="red" />;
    }
  };

  defineColorLockerByState = locker => {
    if (locker.codeState === '111' || locker.codeState === '110') {
      return 'green';
    } else if (locker.codeState === '101' || locker.codeState === '101') {
      return 'orange';
    } else if (locker.codeState === '000') {
      return 'red';
    } else {
      return 'red';
    }
  };

  //IO Events
  subscribeIOEvents = () => {
    io.on('updateLockerState', lockerState => {
      //console.log('updateLockerState', lockerState);
      let { lockers } = this.state;
      lockers.forEach(l => {
        if (l.mac === lockerState.locker.mac) {
          l.pins = lockerState.locker.pins;
          l.codeState = lockerState.locker.codeState;
        }
      });
      this.setState({ lockers });
    });

    io.on('errorEvent', error => {
      console.log('Erro em uma ação com socket', error);
    });
  };

  unsubscribeIOEvents = () => {
    io.removeAllListeners();
  };

  render() {
    const {
      isLoadingLockers,
      isLoadingUsers,
      isOpenModalRemote,
      isOpenModalEKey,
      lockers,
      lockerSelected,
      users
    } = this.state;
    return (
      <div>
        <Header as="h1">
          <Header.Content>
            Lockers
            <Header.Subheader>Gerenciamento dos lockers</Header.Subheader>
          </Header.Content>
        </Header>

        <Segment padded>
          <Card.Group stackable itemsPerRow={4}>
            {isLoadingLockers ? (
              <Card>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line length="medium" />
                      <Placeholder.Line length="full" />
                    </Placeholder.Header>
                  </Placeholder>
                </Card.Content>
              </Card>
            ) : (
              lockers.map(locker => (
                <Card
                  color={this.defineColorLockerByState(locker)}
                  key={locker._id}
                  fluid
                  onClick={this.toggleSelectLocker.bind(this, locker)}
                >
                  <Card.Content>
                    <Card.Header size="small">
                      {locker.name} {this.mountStateIcon(locker)}
                    </Card.Header>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Group>
        </Segment>

        {lockerSelected && (
          <>
            <Segment>
              <Header as="h3">{lockerSelected.name}</Header>

              <List>
                <List.Item>
                  Nome:
                  <List.Header>{lockerSelected.name}</List.Header>
                </List.Item>
                <List.Item>
                  Mac Address:
                  <List.Header>{lockerSelected.mac}</List.Header>
                </List.Item>
              </List>
              <Header as="h4" dividing>
                Usuários
              </Header>
              <Segment>
                <Button.Group widths="2" size="tiny">
                  <Button onClick={this.openModalRemote} color="green">
                    Usuários Remoto
                  </Button>
                  <Button onClick={this.openModalEKey} color="orange">
                    Usuários E-Key
                  </Button>
                </Button.Group>
              </Segment>

              <List>
                <List.Item>
                  <Segment loading={false}>
                    <Label color="green" attached="top left">
                      Acesso Remoto:
                    </Label>
                    <Label.Group color="green" size="mini">
                      {lockerSelected.remoteUsers.map(u => (
                        <Label key={u._id} size="big">
                          {u.name}
                        </Label>
                      ))}
                    </Label.Group>
                  </Segment>
                </List.Item>

                <List.Item>
                  <Segment loading={false}>
                    <Label color="orange" attached="top left">
                      Acesso E-Key:
                    </Label>
                    <Label.Group color="orange" size="mini">
                      {lockerSelected.eKeyUsers.map(u => (
                        <Label key={u._id}>{u.name}</Label>
                      ))}
                    </Label.Group>
                  </Segment>
                </List.Item>
              </List>
            </Segment>

            <Modal open={isOpenModalRemote} onClose={this.handleCloseModalRemote}>
              <Modal.Header>Adicionar Usuário Remoto</Modal.Header>
              <Modal.Content>
                <Segment loading={isLoadingUsers}>
                  <Label color="grey" size="mini" attached="top left">
                    Usuários disponíveis
                  </Label>
                  <Label.Group color="grey" size="tiny">
                    {users
                      .filter(ur => ur.ar === false)
                      .map(u => (
                        <Label
                          as="a"
                          key={u._id}
                          content={u.name}
                          onClick={this.toggleAccesUserRemote.bind(this, u)}
                        />
                      ))}
                  </Label.Group>
                </Segment>

                <Segment loading={isLoadingUsers}>
                  <Label color="green" size="mini" attached="top left">
                    Usuários selecionados
                  </Label>
                  <Label.Group color="green" size="tiny">
                    {users
                      .filter(ur => ur.ar === true)
                      .map(u => (
                        <Label
                          as="a"
                          key={u._id}
                          content={u.name}
                          onClick={this.toggleAccesUserRemote.bind(this, u)}
                        />
                      ))}
                  </Label.Group>
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.closeModalRemote} negative>
                  Cancelar
                </Button>
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Salvar"
                  onClick={this.saveUsersRemote}
                />
              </Modal.Actions>
            </Modal>

            <Modal open={isOpenModalEKey} onClose={this.handleCloseModalEKey}>
              <Modal.Header>Adicionar Usuário - E-Key</Modal.Header>
              <Modal.Content>
                <Segment loading={isLoadingUsers}>
                  <Label color="grey" size="mini" attached="top left">
                    Usuários disponíveis
                  </Label>
                  <Label.Group color="grey" size="tiny">
                    {users
                      .filter(u => u.ak === false && u.ekey !== '')
                      .map(u => (
                        <Label
                          as="a"
                          key={u._id}
                          content={u.name}
                          onClick={this.toggleAccesEKeyUser.bind(this, u)}
                        />
                      ))}
                  </Label.Group>
                </Segment>

                <Segment loading={isLoadingUsers}>
                  <Label color="orange" size="mini" attached="top left">
                    Usuários selecionados
                  </Label>
                  <Label.Group color="green" size="tiny">
                    {users
                      .filter(u => u.ak === true && u.ekey !== '')
                      .map(u => (
                        <Label
                          as="a"
                          key={u._id}
                          content={u.name}
                          onClick={this.toggleAccesEKeyUser.bind(this, u)}
                        />
                      ))}
                  </Label.Group>
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.closeModalEKey} negative>
                  Cancelar
                </Button>
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Salvar"
                  onClick={this.saveEKeyUsers}
                />
              </Modal.Actions>
            </Modal>
          </>
        )}
      </div>
    );
  }
}

LockersConfig.contextType = AppContext;

export { LockersConfig };
