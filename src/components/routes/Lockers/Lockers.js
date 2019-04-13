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
    this.subscribeIOEvents();
    const { user } = this.context;
    this.setState({ user });
    try {
      const { data } = await listLockers();
      data.forEach(locker => (locker.keyWith ? locker.keyWith : null));
      this.setState({ lockers: data });
      console.log('lockers', this.state.lockers);
    } catch (err) {
      console.log(err.message);
    }
  }

  /* getKeyLocker = async locker => {
    const { lastKeyWith } = this.state;
    const keyWith = {
      user: this.state.user,
      id: locker._id
    };
    if (lastKeyWith) {
      //&& lastKeyWith._id !== locker._id
    }
    //await setKeyWith(locker._id, keyWith); 

    console.log('getKeyLocker', keyWith);
  }; */

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
    if (locker.codeState === '111') {
      return (
        <Button color="green" onClick={this.unlockRemote.bind(this, locker)} icon>
          <Icon name="unlock" />
        </Button>
      );
    } else if (locker.codeState === '101') {
      return (
        <Button color="red" onClick={this.lockRemote.bind(this, locker)} icon>
          <Icon name="lock" />
        </Button>
      );
    } else if (locker.codeState === '000') {
      return (
        <Button color="orange" icon>
          <Icon name="heartbeat" size="large" />
        </Button>
      );
    }
  };

  updateStateIcon = locker => {
    if (locker.codeState === '111' || locker.codeState === '110') {
      return <Icon name="lock" color="green" size="large" />;
    } else if (locker.codeState === '101' || locker.codeState === '101') {
      return <Icon name="unlock" color="orange" size="large" />;
    } else if (locker.codeState === '000') {
      return <Icon name="heartbeat" color="red" size="large" />;
    } else {
      return <Icon name="thumbs down" color="red" size="large" />;
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
    io.on('updateLocker', lockerUpdated => {
      /* const lockers = this.state.lockers;
      lockers.forEach(l => {
        if (l._id === lockerUpdated._id) {
          l = lockerUpdated;
        }
      });
      this.setState({ lockers }); */
    });

    io.on('updateLockerState', lockerState => {
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

  render() {
    const { lockers } = this.state;
    return (
      <div>
        <Header as="h1">Lockers</Header>
        <Card.Group>
          {lockers.map(locker => (
            <Card centered key={locker._id}>
              {this.handleKeyWith(locker)}
              <Card.Content>
                <Card.Header>
                  {locker.name} - {this.updateStateIcon(locker)}
                </Card.Header>
                <Card.Meta>{locker.mac}</Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">{this.updateStateButton(locker)}</div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>

        {/* <Icon name="box" size="large" />
          <Icon name="key" size="large" />
          <Icon name="heartbeat" size="large" />
          <Icon name="lock" color="green" size="large" />
          <Icon name="lock open" color="red" size="large" />
          <Icon name="unlock" color="orange" size="large" />
          <Icon name="unlock alternate" color="orange" size="large" />
          <Icon name="exclamation triangle" color="yellow" size="large" />
          <Icon name="id badge" size="large" />
          <Icon name="user" size="large" />
          <Icon name="user plus" size="large" />
          <Icon name="user times" size="large" />
          <Icon name="block layout" size="large" />
          <Icon name="browser" size="large" />
          <Icon name="grid layout" size="large" />
          <Icon name="options" size="large" />
          <Icon name="sidebar" size="large" /> */}
      </div>
    );
  }
}

Lockers.contextType = AppContext;

export { Lockers };
