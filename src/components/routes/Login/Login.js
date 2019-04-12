import React, { Component } from 'react';
import { Button, Form, Grid, Header, Icon, Segment, Message } from 'semantic-ui-react';
import { doLogin } from '../../../services/api/login';

class Login extends Component {
  state = {
    loginForm: { user: '', pass: '' },
    message: { text: '', visible: false }
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const { loginForm } = this.state;
    loginForm[name] = value;

    this.setState({
      loginForm,
      ...this.state
    });
  };

  handleDismiss = () => {
    const { message } = this.state;
    message.visible = false;
    this.setState({ message, ...this.state });
  };

  handleFormSubmit = async event => {
    try {
      const { data } = await doLogin(this.state.loginForm);
      //console.log('response', data.user);
      localStorage.setItem('@lockermaroto:token', JSON.stringify(data.token));
      localStorage.setItem('@lockermaroto:user', JSON.stringify(data.user));
      this.props.history.push('/');
    } catch (err) {
      console.log('err.message', err.message);
      const { message } = this.state;
      message.text = 'Deu jegue... acesso negado';
      message.visible = true;
      this.setState({
        message,
        ...this.state
      });
    }
  };
  render() {
    const { message } = this.state;
    return (
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 410 }}>
            <Header as="h2" color="orange" textAlign="center">
              <Icon name="lock" /> LockerMaroto
            </Header>
            <Form size="large" onSubmit={this.handleFormSubmit}>
              <Segment stacked>
                <Form.Input
                  name="user"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail"
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  name="pass"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleInputChange}
                />

                <Button color="orange" fluid size="large" type="submit">
                  Login
                </Button>
                {message.visible && (
                  <Message negative content={message.text} onDismiss={this.handleDismiss} />
                )}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export { Login };
