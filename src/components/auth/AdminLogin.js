import React, { Component } from 'react'
import { logInUserAction, signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'

class AdminLogin extends Component {
    state = {
        email: '',
        password: '',
        loginAttempts: 0,
        isEmpty: true,
        userData: {},
        loggingIn: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    logInUser = (e) => {
        const auth = this.props.auth;
        this.setState({
            loginAttempts: this.state.loginAttempts + 1
        })
        // console.log(this.isEmpty())
        if (this.isEmpty() || this.state.loggingIn) { return }
        let data = {
            email: `${this.state.firstName.trim()}_${this.state.lastName.trim()}@cclp.com`,
            password: `${this.state.firstName.trim()}_${this.state.lastName.trim()}`,
            loginAttempts: this.state.loginAttempts,
            type: 'admin'
        }
        this.props.logInUserAction(data);
        document.getElementById('signIn-arrow').innerHTML = `
            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <path fill="#fff" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                <animateTransform attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.8s"
                repeatCount="indefinite"/>
                </path>
            </svg>
        `
        this.setState({
            userData: data,
            loggingIn: true
        })
    }

    isEmpty = () => {
        let isEmptyChecks = ['email', 'password'];
        let isEmpty = false;
        for (let i = 0; i < isEmptyChecks.length; i++) {
            let item = isEmptyChecks[i]
            document.getElementById(`${item}-error`).style.display = 'none';
            if (this.state[isEmptyChecks[i]] === '') {
                document.getElementById(`${item}-error`).style.display = 'block';
                isEmpty = true;
            }
        }
        return isEmpty;
    }

    componentDidUpdate() {
        if (this.state.loginAttempts > 0) { this.isEmpty(); }
        if (this.props.signInError === 'auth/user-not-found') {
            this.props.signUp(this.state.userData)
        }
    }

    render() {
        return (
            <div className="login_page">
                <div className="login">
                    <header>
                        <h1>Admin Login</h1>
                    </header>
                    <div className="inputs">
                        <div className="first_name input">
                            <input type="email" placeholder="Email" id="email" value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <br />
                        <h4 className="red-text" id="email-error" style={{ 'textAlign': 'left', 'display': 'none' }}>Please provide and email</h4>
                        <div className="last_name input">
                            <input type="password" placeholder="Password" id="password" value={this.state.password} onChange={this.handleChange} />
                        </div>
                        <br />
                        <h4 className="red-text" id="password-error" style={{ 'textAlign': 'left', 'display': 'none' }}>Incorrect password</h4>
                        <div className="submit_inputs">
                            <button className="signin_button button" onClick={this.logInUser}>
                                <span className="signin">Sign in</span>
                                <span className="arrow" id="signIn-arrow"><i className="fas fa-arrow-right"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
        auth: state.firebase.auth,
        signedIn: state.auth.signingIn,
        signInError: state.auth.signIn_error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (userData) => dispatch(signUp(userData)),
        logInUserAction: (userData) => dispatch(logInUserAction(userData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin)