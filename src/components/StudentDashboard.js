import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Moment from 'moment';

import Header from './layout/Header'

class StudentDashboard extends Component {
   render() {
       const { auth, tests, studentsTests, theClass } = this.props;
    //    console.log(tests)
       if (!auth.uid) return <Redirect to='/login/student' />
       return (
           <div className="main_page">
               <Header
                   profile={this.props.profile}
               />

               <div className="studentTestsContainer">
                   <h1>My Tests</h1>

                   <div className="testSections">
                       <div className="uncompleted testSection">
                           <div className="tests">
                               <Tests
                                    tests={tests}
                                   studentsTests={studentsTests}
                                   class={theClass}
                               />
                               <GhostTest/>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )
   }
}

let Tests = (props) => {
    console.log(props);
    return (
        !props.tests ? 
            <div className="test">
                <h4 className="title"></h4>
                <h4 className="date">Mon, 17 2020</h4>
                <h4 className="grade"></h4>
                <h4 className="status"></h4>
            </div>
         : props.tests.map((test, index) => {
             let grade = props.studentsTests[test.id] ? props.studentsTests[test.id].grade : false;
             let completed = props.studentsTests[test.id] ? props.studentsTests[test.id].completed : false;
            return (
                <Link key={index} to={`test/${props.class}_${test.id}`}>
                    <div className="test" id={index}>
                        <h4 className="title">{test.theme}</h4>
                        <h4 className="date">
                            June, 1st 2020
                        </h4>
                        <h4 className="grade">{!props.studentsTests ? 'Still Grading' : (grade) ? `${props.studentsTests[test.id].grade * 10}%` : 'Still Grading'}</h4>
                        <h4 className="status" style={
                            !props.studentsTests ? {} : (completed) ? { 'backgroundColor': '#16c516' } : { 'backgroundColor': '#F44336'}
                        }>{!props.studentsTests ? '' : (completed) ? 'Done' : 'Not Done'}</h4>
                    </div>
                </Link>
            )
        })
    )
}

let GhostTest = () => {
    return (
        <div className="test" id='ghostTest' style={{ 'textAlign': 'center', 'justifyContent': 'center', 'backgroundColor': '#cecece75', 'boxShadow': 'initial', 'cursor': 'initial'}}>
            <h4 className="center">Next Test June 28th, 2020</h4>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    // const resolutions = state.firestore.ordered['users/' + state.firebase.auth.uid + '/resolutions'];
    // console.log(state);
    return {
        auth: state.firebase.auth,
        tests: state.firestore.ordered['class/' + ownProps.match.params.id + '/tests'] ? state.firestore.ordered['class/' + ownProps.match.params.id + '/tests'] : false,
        profile: state.firebase.profile,
        studentsTests: state.firebase.profile.tests ? state.firebase.profile.tests : false,
        theClass: ownProps.match.params.id
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
)(StudentDashboard);