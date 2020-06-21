import React, {Component} from 'react'
import { logInUserAction, signUp } from '../../store/actions/authActions'
import { connect } from 'react-redux'

class Login extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        pickClass: '',
        loginAttempts: 0,
        isEmpty: true,
        userData: {}
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
        if (this.isEmpty()) { return }
        let data = {
            email: `${this.state.firstName.trim()}_${this.state.lastName.trim()}@cclp.com`,
            password: `${this.state.firstName.trim()}_${this.state.lastName.trim()}`,
            class: `class${this.state.pickClass}`,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        this.props.logInUserAction(data);
        this.setState({
            userData: data
        })
    }

    isEmpty = () => {
        let isEmpty_ = [];
        let toggleDisplay = (item) => {
            if (this.state[item] === '') {
                document.getElementById(`${item}-error`).style.display = 'block';
                isEmpty_.push(true);
            } else {
                document.getElementById(`${item}-error`).style.display = 'none';
                isEmpty_.push(false);
            }
        }
        for (const item in this.state) {
            if (['firstName', 'lastName', 'pickClass'].includes(item) && this.props.loginType === 'student') {
                toggleDisplay(item);
            } else if (['password', 'email'].includes(item) && this.props.loginType === 'admin') {
                toggleDisplay(item);
            }
        }
        return isEmpty_.includes(true) ? true : false
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

    componentDidUpdate () {
        if (this.state.loginAttempts > 0) { this.isEmpty(); }
        if (this.props.signInError === 'auth/user-not-found') {
            this.props.signUp(this.state.userData)
        }
    }

    render() {
        const classes = ['5-6', '7-8', '9-10', '11-12', '13-18'];
        // console.log(this.props)
        return (
            this.props.loginType === 'admin' ?
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
                                <button className="singin_button button" onClick={this.logInUser}>
                                    <span className="singin">Sign in</span>
                                    <span className="arrow"><i className="fas fa-arrow-right"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                 : 
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
                                    <button><h4 className="button">I don't know</h4></button>
                                    <button className="singin_button button" onClick={this.logInUser}>
                                        <span className="singin">Sign in</span>
                                        <span className="arrow"><i className="fas fa-arrow-right"></i></span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)