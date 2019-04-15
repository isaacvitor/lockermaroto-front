import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { socket as io } from '../../../services/io';
import { listLockers } from '../../../services/api/lockers';
import { Button, Card, Label } from 'semantic-ui-react';

import { AppContext } from '../../AppContext';
io.on('updateKeyWith');

class Lockers extends Component {
  state = {
    lockers: [],
    lastKeyWith: null,
    user: null
  };

  async componentDidMount() {
    const { user } = this.context;
    this.setState({ user });
    try {
      const { data } = await listLockers();
      this.subscribeIOEvents();
      data.forEach(locker => (locker.keyWith ? locker.keyWith : null));
      this.setState({ lockers: data });
      console.log('lockers', this.state.lockers);
    } catch (err) {
      console.log(err.message);
    }
  }

  componentWillUnmount() {
    this.unsubscribeIOEvents();
  }

  lockRemote = locker => {
    const { user } = this.state;
    io.emit('lockLocker', { userID: user._id, ekey: user.ekey, _id: locker._id, mac: locker.mac });
  };
  unlockRemote = locker => {
    const { user } = this.state;
    io.emit('unlockLocker', {
      userID: user._id,
      ekey: user.ekey,
      _id: locker._id,
      mac: locker.mac
    });
  };

  updateStateButton = locker => {
    const user = this.state.user;
    let disableLocker = true;
    locker.remoteUsers.forEach(u => {
      if (u._id === user._id) {
        disableLocker = false;
      }
    });
    if (locker.codeState === '111') {
      return (
        <Button
          color="green"
          disabled={disableLocker}
          onClick={this.unlockRemote.bind(this, locker)}
          icon
        >
          <Icon name="unlock" />
        </Button>
      );
    } else if (locker.codeState === '101') {
      return (
        <Button
          color="red"
          disabled={disableLocker}
          onClick={this.lockRemote.bind(this, locker)}
          icon
        >
          <Icon name="lock" />
        </Button>
      );
    } else if (locker.codeState === '000') {
      return (
        <Button disabled={disableLocker} color="orange" icon>
          <Icon name="lock open" size="large" />
        </Button>
      );
    }
  };

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

  handleKeyWith = locker => {
    const { keyWith } = locker;
    const { user } = this.state;
    if (keyWith) {
      if (keyWith.user._id !== user._id)
        return (
          <Label color="red">
            Maria
            <Label.Detail>
              <Icon name="key" size="small" />
            </Label.Detail>
          </Label>
        );
    }
  };

  //IO Events
  subscribeIOEvents = () => {
    io.on('updateLockerState', lockerState => {
      let { lockers } = this.state;
      console.log('updateLockerState', lockerState);
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
    const { lockers } = this.state;
    return (
      <div>
        <Header as="h1">Lockers</Header>
        <Card.Group>
          {lockers.map(locker => (
            <Card color={this.defineColorLockerByState(locker)} key={locker._id}>
              {this.handleKeyWith(locker)}
              <Card.Content>
                <Card.Header>
                  {locker.name} - {this.mountStateIcon(locker)}
                </Card.Header>
                <Card.Meta>{locker.mac}</Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">{this.updateStateButton(locker)}</div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  }
}

Lockers.contextType = AppContext;

export { Lockers };
