import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { signOut } from '../../store/actions/authActions'
import { updatePasswords } from '../../store/actions/authActions'

class Header extends Component {
    changePassword = () => {
        let first = this.props.profile.first_name.toLowerCase();
        let last = this.props.profile.last_name.toLowerCase();
        this.props.updatePasswords(`${first}_${last}`);
    }
    render() {
        let {profile} = this.props;
        return (
            <nav>
                <Link to={`/student/${profile.class ? profile.class : ''}`}>
                    <div className="logo left navItem">
                        Winners Chapel Massachusets
                    </div>
                </Link>

                <div className="studentInfo navItem">
                    <h4>Hello <span style={{
                        'padding': '10px',
                        'color': 'white',
                        'fontWeight': '900',
                        'textDecoration': 'underline',
                    }}> <span className="firstName">{profile.first_name ? profile.first_name : 'First'}</span> <span className="lastName">{profile.last_name ? profile.last_name : 'Last'}</span> </span> </h4>
                    <button className="logout navItem" onClick={this.props.signOut}><h4>Logout</h4> <i className="fas fa-sign-out-alt"></i></button>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // const resolutions = state.firestore.ordered['users/' + state.firebase.auth.uid + '/resolutions'];
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: (testData, totalClasses) => dispatch(signOut(testData, totalClasses)),
        updatePasswords: (newPass) => dispatch(updatePasswords(newPass))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps))(Header);