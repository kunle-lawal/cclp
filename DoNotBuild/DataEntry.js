import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { dataEntry } from '../../store/actions/authActions'
import { setStudentScore } from '../../store/actions/submitTestActions'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'

class DataEntry extends Component {

    //return points
    rightAnswer = (studentAnswer_, actualAnswer_) => {
        let score = 0;
        let actualAnswer = actualAnswer_;
        let studentAnswer = studentAnswer_;
        actualAnswer.sort();
        studentAnswer.sort();
        // console.log(studentAnswer, actualAnswer)
        // console.log(studentAnswer[0] === actualAnswer[0])
        if(studentAnswer.length === 0) {return 0}
        if (studentAnswer[0].length > 1) { return 1}
        if (studentAnswer.length === 1 && actualAnswer.length > 1) { return 0}
        if(studentAnswer.length >= 4) {return 0}
        for(let i = 0; i < studentAnswer.length; i++) {
            for(let y = 0; y < actualAnswer.length; y++) {
                if(studentAnswer[i] === actualAnswer[y]) {
                    score += 1 / studentAnswer.length
                }
            }
        }
        // console.log(score);
        return score;
    }

    dataEntry = () => {
        let students = this.props.userData ? this.props.userData : [];
        for (let i = 0; i < students.length; i++) {
            let testID = this.props[students[i].class][0].id;
            let studentAnswers = students[i].tests ? students[i].tests[testID].answers : false;
            let testAnswers = this.props[students[i].class][0].testAnswers;
            let score = 0;
            // console.log(studentAnswers);
            // console.log(testAnswers);
            if(studentAnswers !== false) {
                for (let y = 0; y < testAnswers.length; y++) {
                    let actualAnswer = testAnswers[y].answer;
                    let studentAnswer = studentAnswers[y].answer;
                    // console.log(testAnswers[y].answer)
                    // console.log(studentAnswers[y].answer)
                    // console.log('_________________________________________\n')
                    score += this.rightAnswer(studentAnswer, actualAnswer);
                }
            }
            // console.log(students[i]);
            // console.log(`Final Score:${score}\n\n\n`);  
            let data = {
                class: students[i].class,
                firstName: students[i].first_name,
                lastName: students[i].last_name,
                testID: testID,
                grade: Math.ceil(score),
                userID: students[i].id,
            }
            this.props.setStudentScore(data);
        }
    }

    enterData = () => {
        // let answers = 
        // let { userData} = this.props;
        // for (let i = 0; i < userData.length; i++) {
        //     console.log(userData[i]);
        //     let userdata = userData[i]
        //     let data = {
        //         class: userdata.class,
        //         firstName: userdata.first_name,
        //         lastName: userdata.last_name,
        //         type: 'student'
        //     }
        //     this.props.dataEntry(data)
        // }
    }

    render() {
        let data = this.props.userData ? this.props.userData : [];
        console.log(this.props)
        return (
            <div className="main_page">
               <div className="center">
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="btn dataEntry" onClick={this.dataEntry}>Data Entry</div>
               </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // const resolutions = state.firestore.ordered['users/' + state.firebase.auth.uid + '/resolutions'];
    // console.log(state);
    let answers = state.firestore.ordered[`class/class5-6/testAnswers`] ? true : false
    return {
        [`class5-6`]: answers ? state.firestore.ordered[`class/class5-6/testAnswers`] : false,
        [`class7-8`]: answers ? state.firestore.ordered[`class/class7-8/testAnswers`] : false,
        [`class9-10`]: answers ? state.firestore.ordered[`class/class9-10/testAnswers`] : false,
        [`class11-12`]: answers ? state.firestore.ordered[`class/class11-12/testAnswers`] : false, 
        [`class13-18`]: answers ? state.firestore.ordered[`class/class13-18/testAnswers`] : false,
        userData: state.firestore.ordered.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dataEntry: (userData) => dispatch(dataEntry(userData)),
        setStudentScore: (data) => dispatch(setStudentScore(data))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'users',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class11-12/testAnswers',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class11-12/testAnswers',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class13-18/testAnswers',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class5-6/testAnswers',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class7-8/testAnswers',
        }
    ]),
    firestoreConnect((props, dispatch) => [
        {
            collection: 'class/class9-10/testAnswers',
        }
    ]),
)(DataEntry);