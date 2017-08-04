import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchAccessToken, { loginData

} from '../../actions/authentication-action.js';
import validateInput from './validations/login';
import TextFieldGroup from '../common/TextFieldGroup';
import { connect } from 'react-redux';

class Login extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
                username: '',
                password: '',
                errors: {},
                isLoading: false
        };
    }

    isValid() {
        const { errors, isValid } = validateInput(this.state);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        loginData.username= this.state.username;
        loginData.password= this.state.password;

        if (this.isValid()) {
            this.setState({ errors: {}, isLoading: true });
            this.props.dispatch(fetchAccessToken(loginData));
        }
    }

    render() {
        const { errors, username, password, isLoading } = this.state;
        console.log(username);
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <h1>Login</h1>

                    { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                    <TextFieldGroup
                      field="username"
                      label="Username"
                      value={username}
                      error={errors.username}
                      onChange={event => this.setState({ username: event.target.value })}
                    />

                    <TextFieldGroup
                      field="password"
                      label="Password"
                      value={password}
                      error={errors.password}
                      onChange={event => this.setState({ password: event.target.value })}
                      type="password"
                    />

                    <div className="form-group"><button className="btn btn-primary btn-lg" disabled={isLoading}>Login</button></div>
                  </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => ({
    tokenDetails: store.authentication.tokenDetails,
});

export default connect(mapStateToProps)(Login);
