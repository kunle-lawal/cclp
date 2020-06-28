import React, { Component } from 'react'
import { logInUserAction, signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'

class StudentLogin extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        pickClass: '',
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
        if (this.isEmpty() || this.state.loggingIn) { return }
        // console.log(this.state);
        let firstName = this.state.firstName.trim();
        let lastName = this.state.lastName.trim();
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        let username = `${firstName}_${lastName}`;
        let data = {
            email: `${firstName}_${lastName}@cclp.com`,
            password: `${firstName}_${lastName}`,
            class: `class${this.state.pickClass}`,
            firstName: firstName,
            lastName: lastName,
            loginAttempts: this.state.loginAttempts,
            type: 'student',
            username: username
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
        let isEmptyChecks = ['firstName', 'lastName', 'pickClass'];
        let isEmpty = false;
        for(let i = 0; i < isEmptyChecks.length; i++) {
            let item = isEmptyChecks[i]
            document.getElementById(`${item}-error`).style.display = 'none';
            if(this.state[isEmptyChecks[i]] === '') {
                document.getElementById(`${item}-error`).style.display = 'block';
                isEmpty = true;
            }
        }
        return isEmpty;
    }

    handleTopic = (e) => {
        this.setState({
            pickClass: e.target.id
        })
    }

    toggleDropdown = () => {
        this.setState({
            openDropdown: !this.state.openDropdown
        })
    }

    componentDidUpdate() {
        if (this.state.loginAttempts > 0) { this.isEmpty(); }
        if (this.props.signInError === 'auth/user-not-found') {
            this.props.signUp(this.state.userData)
        }
    }

    render() {
        const classes = ['5-6', '7-8', '9-10', '11-12', '13-18'];
        // console.log(this.props)
        return (
            <div className="login_page">
                <div className="login">
                    <header>
                        <h1>Student Login</h1>
                    </header>
                    <div className="inputs">
                        <div className="first_name input">
                            <input type="text" placeholder="First name" id="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        </div>
                        <br />
                        <h4 className="red-text" id="firstName-error" style={{ 'textAlign': 'left', 'display': 'none' }}>Make sure you add a first name</h4>

                        <div className="last_name input">
                            <input type="text" placeholder="Last name" id="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        </div>
                        <br />
                        <h4 className="red-text" id="lastName-error" style={{ 'textAlign': 'left', 'display': 'none' }}>Make sure you add a last name</h4>

                        <div className="input-field classes">
                            <div id="dropdown" className="dropdown" onClick={this.toggleDropdown}>
                                <span>Class {this.state.pickClass} <i className="fas fa-caret-down" style={{
                                    'position': 'absolute',
                                    'right': '20px',
                                    'transition': '0.3s',
                                    'transform': this.state.openDropdown ? 'rotatez(-180deg)' : '',
                                }}></i></span>
                                <div className={"dropdown_content " + (this.state.openDropdown ? '' : 'display_none')}>
                                    {classes.map((class_, id) => {
                                        return (
                                            <p id={class_} key={id} className="dropdown_item noselect" onClick={this.handleTopic}>{class_}</p>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <br />
                        <h4 className="red-text" id="pickClass-error" style={{ 'textAlign': 'left', 'display': 'none' }}>Pick  a class</h4>
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentLogin)