import React, { Component } from 'react'
import Header from '../layout/Header'
import TestQuestion from './TestQuestion'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Redirect } from 'react-router-dom'
import { submitTest } from '../../store/actions/submitTestActions'

class Test extends Component {
    state = {
        grade: 0,
        answers: [{ answer: [] }, { answer: [] }, { answer: [] }, { answer: [] }, { answer: [] }, { answer: [] }, { answer: [] }, { answer: [] }, { answer: []}, { answer: []}],
        submitCheck: 0
    }

    submitTest = () => {
        if(this.state.submitCheck < 1) {
            this.setState({
                submitCheck: this.state.submitCheck + 1
            }) 
            return 0;
        }
        let completed = this.isCompleted();
        let firstName = this.props.profile.first_name;
        let lastName = this.props.profile.last_name;
        let data = {
            uid: this.props.testUID,
            completed: completed,
            answers: this.state.answers,
            grade: 0,
            class: this.props.profile.class,
            username: `${firstName}_${lastName}`
        }
        this.setState({
            submitCheck: this.state.submitCheck + 1
        }) 
        this.props.submitTest(data);
    }

    isCompleted = () => {
        let completed = true
        for(var i = 0; i < this.state.answers.length; i++) {
            if(this.state.answers[i].answer.length < 1) {
                completed = false;
            }
        }
        return completed;
    }

    getAnswerData = (questionData, index) => {
        let newAnswers = this.state.answers;
        newAnswers[index].answer = questionData.answer;
        this.setState({
            answers: newAnswers
        })
    }

    testDue = (dueDate) => {
        let daysSince = (Date.now() - dueDate) / 1000 / 60 / 60 / 24
        if(daysSince > 2) {
            return true;
        }
        return false
    }

    componentDidMount() {
        let testAnswers = [];
        window.setTimeout(() => {
            testAnswers = this.props.profile.tests ? (this.props.profile.tests[this.props.testUID] ? this.props.profile.tests[this.props.testUID].answers : false) : false
            // console.log(this.props.profile.tests ? this.props.profile.tests[this.props.testUID].answers : false);
            if (testAnswers === false) { return }
            this.setState({
                answers: testAnswers
            })
        }, 1000)

    }

    render() {
        const { auth, test, profile } = this.props;
        if (!auth.uid) return <Redirect to='/login/student' />
        return (
            <div className="main_page">
                <Header
                    profile={this.props.profile}
                />

                <div className="testContainer">
                    <div className="testInfoContainer">
                        <h1 className="title testInfo">{`CHILDREN'S CHURCH WINNERS CHAPEL WOBURN`}</h1>

                        <h2 className="testTheme testInfo">
                            Theme: {'I have dominion'}
                        </h2>

                        {/* <h4 className="date testInfo">Due: {`Oct 27th, 2019`}</h4> */}
                    </div>
                    <div className="testContent">
                        <h3 className="topic">Topic: {'This is a topic'}</h3>
                        <div className="theTest">
                            {
                                test ? test.questions.map((questionData, index) => {
                                    return (
                                        <TestQuestion
                                            key={index}
                                            index={index}
                                            data={questionData}
                                            getAnswerData={this.getAnswerData}
                                            testAnswers={profile.tests ? (profile.tests[this.props.testUID] ? profile.tests[this.props.testUID].answers[index] : false) : false}
                                            testDue={this.testDue}
                                        />
                                    )
                                }) : null
                            }
                        </div>
                    </div>
                    
                    {
                        (this.state.submitCheck > 1 || this.testDue()) ? null : <div className="center testDone" onClick={this.submitTest}><h3>{this.state.submitCheck > 0 ? 'Are you sure?' : 'I am done with my test'}</h3></div>
                    }
                
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    // const resolutions = state.firestore.ordered['users/' + state.firebase.auth.uid + '/resolutions'];
    // console.log(state);
    const id = ownProps.match.params.id.substr(ownProps.match.params.id.indexOf('_') + 1, ownProps.match.params.id.length - 1)
    let testClass = ownProps.match.params.id.substr(0, ownProps.match.params.id.indexOf('_'))
    let actualClass = state.firebase.profile.class ? state.firebase.profile.class : 'loading';
    if (testClass !== actualClass && actualClass !== 'loading') {
        console.log('wrong class');
        window.location = `/student`
    }
    let test = state.firestore.data[`class/${testClass}/tests`]
    return {
        auth: state.firebase.auth,
        test: test ? test[id] : false,
        profile: state.firebase.profile,
        testUID: ownProps.match.params.id.substr(ownProps.match.params.id.indexOf('_') + 1, ownProps.match.params.id.length - 1)
        // profile: state.firebase.profile,
        // resolutionInfo: resolutions
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitTest: (testData) => dispatch(submitTest(testData)),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props, dispatch) => [
        {
            collection: `class/${props.match.params.id.substr(0, props.match.params.id.indexOf('_'))}/tests`,
            // orderBy: ['time', 'asc']
        }
    ])
)(Test);