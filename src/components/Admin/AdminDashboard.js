import React, { Component } from 'react'
import Header from './Header'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'


class AdminDashboard extends Component {
    render () {
        return (
            <div className="main_page">
                <Header/>

                <div className="adminClassContainer">
                    <h1>Classes</h1>

                    <div className="classes_container">
                        <div className="classes">
                            <h4 className="class highlight">1-1</h4>
                            <h4 className="class selected">5-6</h4>
                            <h4 className="class">7-8</h4>
                            <h4 className="class">9-10</h4>
                            <h4 className="class">11-12</h4>
                            <h4 className="class">13-18</h4>
                        </div>
                    </div>

                    <div className="testSections">
                        <div className="uncompleted testSection">
                            <div className="tests">
                                <div className="center addExam">
                                    <h4>Create New Exam</h4>
                                    <Link to={'/create-test'}>
                                        <span>
                                            <i class="fas fa-plus"></i>
                                        </span>
                                    </Link>
                                </div>
                                <div className="test legend">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Due</h4>
                                    <h4 className="grade">students</h4>
                                    <h4 className="status_">%</h4>
                                </div>

                                <div className="test">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Mon, 17 2020</h4>
                                    <h4 className="grade">50%</h4>
                                    <h4 className="status">Done</h4>
                                </div>

                                <div className="test">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Mon, 17 2020</h4>
                                    <h4 className="grade">50%</h4>
                                    <h4 className="status">Done</h4>
                                </div>

                                <div className="test">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Mon, 17 2020</h4>
                                    <h4 className="grade">50%</h4>
                                    <h4 className="status">Done</h4>
                                </div>

                                <div className="test">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Mon, 17 2020</h4>
                                    <h4 className="grade">50%</h4>
                                    <h4 className="status">Done</h4>
                                </div>

                                <div className="test">
                                    <h4 className="title">Title</h4>
                                    <h4 className="date">Mon, 17 2020</h4>
                                    <h4 className="grade">50%</h4>
                                    <h4 className="status">Done</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // const resolutions = state.firestore.ordered['users/' + state.firebase.auth.uid + '/resolutions'];
    console.log(state);
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/' + props.match.params.id + '/tests',
            // orderBy: ['time', 'asc']
        }
    ]),
)(AdminDashboard);