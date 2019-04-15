import React, { Component } from 'react';
import { socket as io } from '../../../services/io';
import { listLockers } from '../../../services/api/lockers';
import {
  Header,
  Icon,
  Button,
  Card,
  List,
  Placeholder,
  Checkbox,
  Input,
  Dropdown,
  Segment,
  Label
} from 'semantic-ui-react';

import { AppContext } from '../../AppContext';
io.on('updateKeyWith');

class ApplicationConfig extends Component {
  state = {
    isLoadingLockers: false,
    lockers: [],
    lockerSelected: null,
    lockerSelectedConfig: {
      controlByItem: { d: false, t: 0 }, //controlByItem
      doorOpenAlarm: { d: true, t: 0 }, //doorOpenAlarm
      lockOnClose: { d: true, t: 0 }, //lockOnClose
      users: []
    },
    timerOptions: [
      { key: 1, text: 'Segundos', value: '1000' },
      { key: 2, text: 'Minutos', value: '60000' }
    ]
  };

  async componentDidMount() {
    this.subscribeIOEvents();
    this.setState({ isLoadingLockers: true });
    try {
      const { data } = await listLockers();
      this.setState({ lockers: data, isLoadingLockers: false });
    } catch (err) {
      console.log(err.message);
    }
  }

  componentWillUnmount() {
    this.unsubscribeIOEvents();
  }

  toggleSelectLocker = locker => {
    const { lockerSelected } = this.state;
    if (lockerSelected) {
      if (lockerSelected._id === locker._id) {
        this.setState({ lockerSelected: null });
      } else {
        this.setState({ lockerSelected: Object.assign(locker) });
      }
    } else {
      this.setState({ lockerSelected: Object.assign(locker) });
    }
  };

  handleCancelConfig = () => {
    this.setState({ lockerSelected: null });
  };
  handleSaveConfig = () => {
    this.setState({ lockerSelected: null });
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
      return <Icon name="lock" color="green" />;
    } else if (locker.codeState === '101' || locker.codeState === '101') {
      return <Icon name="unlock" color="orange" />;
    } else if (locker.codeState === '000') {
      return <Icon name="lock open" color="red" />;
    } else {
      return <Icon name="thumbs down" color="red" />;
    }
  };

  colorByState = locker => {
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
      console.log('updateLockerState', lockerState);
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
    const { isLoadingLockers, lockers, lockerSelected, timerOptions } = this.state;
    return (
      <div>
        <Header as="h1">
          <Header.Content>
            LockerMaroto
            <Header.Subheader>Gerenciamento do sistema LockerMaroto</Header.Subheader>
          </Header.Content>
        </Header>

        <Header as="h3">
          <Header.Content>
            Configuração Global
            <Header.Subheader>Aplicada a todos os lockers do Gateway</Header.Subheader>
          </Header.Content>
        </Header>

        <Segment>
          <List>
            <List.Item>
              <List.Header>Modo de Operação</List.Header>
              <List.List>
                <List.Item>
                  <Checkbox
                    name="doorOpenAlarm"
                    color="green"
                    label="Ativar controle por inventário"
                    toggle
                    fitted
                  />
                  <Segment vertical disabled={false}>
                    Tempo de espera:{' '}
                    <Input
                      size="mini"
                      type="number"
                      min="1"
                      max="60"
                      label={<Dropdown defaultValue="1000" options={timerOptions} />}
                      labelPosition="right"
                      placeholder="Tempo de espera"
                    />
                  </Segment>
                </List.Item>
              </List.List>
            </List.Item>
          </List>
          <List.Item>
            <List.Header>Locker</List.Header>
            <List.List>
              <List.Item>
                <Checkbox
                  name="doorOpenAlarm"
                  color="green"
                  label="Alarme de PORTA ABERTA"
                  toggle
                />
                <Segment vertical disabled={false}>
                  Tempo de espera:{' '}
                  <Input
                    size="mini"
                    type="number"
                    min="1"
                    max="60"
                    label={<Dropdown defaultValue="1000" options={timerOptions} />}
                    labelPosition="right"
                    placeholder="Tempo de espera"
                  />
                </Segment>
              </List.Item>

              <List.Item>
                <Checkbox
                  name="lockOnClose"
                  label="Travar automáticamente após fechamento"
                  toggle
                  fitted
                />
                <Segment vertical disabled={false}>
                  Tempo de espera:{' '}
                  <Input
                    size="mini"
                    type="number"
                    min="1"
                    max="60"
                    label={<Dropdown defaultValue="1000" options={timerOptions} />}
                    labelPosition="right"
                    placeholder="Tempo de espera"
                  />
                </Segment>
              </List.Item>
            </List.List>
          </List.Item>
          <Button.Group widths="3">
            <Button onClick={this.handleCancelGlobalConfig}>Cancelar</Button>
            <Button.Or text="ou" />
            <Button onClick={this.handleSaveGlobalConfig} positive>
              Salvar
            </Button>
          </Button.Group>
        </Segment>
      </div>
    );
  }
}

ApplicationConfig.contextType = AppContext;

export { ApplicationConfig };
