import React, { Component } from 'react';
import {
  Header,
  Card,
  Button,
  Label,
  Grid,
  Segment,
  Placeholder,
  Modal,
  Form,
  Message,
  Confirm
} from 'semantic-ui-react';
import { socket as io } from '../../../services/io';
import { listUsers, createUser, removeUser, updateUser } from '../../../services/api/users';
class Users extends Component {
  state = {
    isLoadingUsers: true,
    users: [],
    user: {
      name: '',
      user: '',
      pass: '',
      ekey: '',
      isadmin: false
    },
    userToEdit: {},
    isLoadingForm: false,
    showUserForm: false,
    isFormToEdit: false,
    isConfirmOpen: false,
    userToRemove: {},
    message: { text: '', visible: false },
    errorMessages: { messages: [], visible: false }
  };

  async componentDidMount() {
    this.fetchUsers();
    this.subscribeIOEvents();
  }

  fetchUsers = async () => {
    this.setState({ isLoading: true });
    const { data } = await listUsers();
    this.setState({ users: data, isLoading: false });
  };

  handleChange = (e, { name, value }) => {
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  };

  toggleIsAdmin = () => {
    const { user } = this.state;
    user.isadmin = !user.isadmin;
    this.setState({ user });
  };

  //Form de Cadastro/Edição Usuário
  openUserForm = () => {
    this.setState({ showUserForm: true, isFormToEdit: false });
  };

  openUserFormToEdit = user => {
    let editUser = Object.assign({}, user);
    delete editUser.pass;
    this.setState({ showUserForm: true, isFormToEdit: true, user: editUser });
  };

  closeUserForm = () => {
    this.setState({ showUserForm: false });
  };

  handleSubmit = async () => {
    const { isFormToEdit } = this.state;
    this.setState({ isLoadingForm: true });
    try {
      if (isFormToEdit) {
        let user = Object.assign(this.state.user);

        console.log('UPDATE USER', user);
        const resp = await updateUser(user);
        console.log('data', resp);
      } else {
        console.log('CREATE USER', this.state.user);
        const resp = await createUser(this.state.user);
        console.log('data', resp);
      }

      this.setState(
        {
          showUserForm: false,
          isLoadingForm: false,
          isFormToEdit: false,
          user: {
            name: '',
            user: '',
            pass: '',
            ekey: '',
            isadmin: false
          }
        },
        () => this.fetchUsers()
      );
    } catch (err) {
      const { data } = err.response;
      const { errorMessages } = this.state;
      errorMessages.messages = data.errorsArray ? data.errorsArray : [];
      errorMessages.visible = true;
      this.setState({ errorMessages, isLoadingForm: false });
    }
  };

  //Remoção de usuário
  openConfirmRemove = user => {
    this.setState({ isConfirmOpen: true, userToRemove: user });
  };
  cancelRemove = () => this.setState({ isConfirmOpen: false, userToRemove: {} });
  confirmRemove = async () => {
    try {
      const { data } = await removeUser(this.state.userToRemove);
      console.log('resultRemove', data);
      this.setState({ isConfirmOpen: false, userToRemove: {} }, () => this.fetchUsers());
    } catch (error) {
      console.log('Error on remove', error);
    }
  };

  //IO
  subscribeIOEvents = () => {
    io.on('lockerReadUID', lockerState => {
      console.log('lockerReadUID', lockerState);
      let { user } = this.state;
      if (lockerState.uid !== '') {
        user.ekey = lockerState.uid;
        this.setState({ user });
      } else {
        user.ekey = '';
        this.setState({ user });
      }
    });

    io.on('errorEvent', error => {
      console.log('Erro em uma ação com socket', error);
    });
  };

  render() {
    const {
      isLoading,
      isLoadingForm,
      isConfirmOpen,
      showUserForm,
      user,
      users,
      userToRemove,
      errorMessages
    } = this.state;
    return (
      <div>
        <Header as="h2">
          <Header.Content>
            Usuários
            <Header.Subheader>Gerêncie os usuários</Header.Subheader>
          </Header.Content>
        </Header>

        <Segment>
          <Button onClick={this.openUserForm}>Adicionar usuário</Button>
        </Segment>

        <Grid columns={3} stackable>
          {isLoading ? (
            <Grid.Column>
              <Segment>
                <Placeholder fluid>
                  <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </Segment>
            </Grid.Column>
          ) : (
            users.map(u => (
              <Grid.Column key={u._id}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>
                      {u.isadmin && (
                        <Label size="mini" as="a" color="teal" ribbon>
                          Admin
                        </Label>
                      )}
                      {u.name}
                    </Card.Header>
                    <Card.Meta>{u.user}</Card.Meta>
                    <Card.Description>
                      <div>
                        <Button
                          floated="left"
                          color="instagram"
                          size="mini"
                          content="Editar"
                          icon="edit outline"
                          onClick={this.openUserFormToEdit.bind(this, u)}
                          labelPosition="left"
                        />
                        <Button
                          floated="right"
                          color="red"
                          size="mini"
                          onClick={this.openConfirmRemove.bind(this, u)}
                          content="Remover"
                          icon="remove user"
                          labelPosition="left"
                        />
                      </div>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          )}
        </Grid>
        <Confirm
          open={isConfirmOpen}
          content={`Confirmar cancelamento de ${userToRemove.name}`}
          cancelButton="Não"
          confirmButton="Sim"
          onCancel={this.cancelRemove}
          onConfirm={this.confirmRemove}
        />
        <Modal
          open={showUserForm}
          closeOnEscape={true}
          closeOnDimmerClick={false}
          onClose={this.close}
        >
          <Modal.Header>Usuário</Modal.Header>
          <Modal.Content>
            <Form loading={isLoadingForm}>
              <Form.Input
                fluid
                name="name"
                label="Nome"
                required
                placeholder="Nome..."
                value={user.name}
                onChange={this.handleChange}
              />
              <Form.Group widths="equal">
                <Form.Input
                  name="user"
                  fluid
                  label="Usuário"
                  required
                  placeholder="usuario@dominio.com"
                  value={user.user}
                  onChange={this.handleChange}
                />
                <Form.Input
                  name="pass"
                  fluid
                  label="Senha"
                  required
                  type="password"
                  placeholder="Senha..."
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Input
                name="ekey"
                fluid
                label="E-key"
                placeholder="Passe o cartão em um leitor"
                value={user.ekey}
                onChange={this.handleChange}
              />
              <Form.Checkbox
                name="isadmin"
                label="Administrador"
                toggle
                checked={user.isadmin}
                onChange={this.toggleIsAdmin}
              />
            </Form>
            {errorMessages.visible && (
              <Message negative size="mini" onDismiss={this.handleDismiss}>
                <Message.Header>Vixe!</Message.Header>
                <Message.List>
                  {errorMessages.messages.map(m => (
                    <Message.Item key={m.path}>{m.message}</Message.Item>
                  ))}
                </Message.List>
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeUserForm} negative>
              Cancelar
            </Button>
            <Button
              onClick={this.handleSubmit}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Salvar"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export { Users };
