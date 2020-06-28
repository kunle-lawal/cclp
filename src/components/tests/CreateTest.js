import React, { Component } from 'react'
import Header from '../layout/Header'
import { Link } from 'react-router-dom'
import TestQuestionMaker from './TestQuestionMaker'
import { addTest } from '../../store/actions/createTestActions'
import { connect } from 'react-redux'

class CreateTest extends Component {
    state = {
        dueDate: 'June 1st, 2020',
        theme: '',
        questions: [{}],
        answers: [{}],
        classes: [['5-6', true], ['7-8', false], ['9-10', false], ['11-12', false], ['13-18', false]],
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    createTest = () => {
        let data = { 
            questions: this.state.questions,
            testAnswers: this.state.answers,
            testTheme: this.state.theme,
            dueDate: this.state.dueDate,
        }
        var totalClasses = 0;
        let class_ = [];
        for(var i = 0; i < this.state.classes.length; i++) {
            let theClass = this.state.classes[i]
            if (theClass[1]) {
                // console.log(theClass[0]);
                class_.push(`class${theClass[0]}`);
                totalClasses++;
            }
        }
        data.class = class_;
        this.props.addTest(data, totalClasses);
    }

    getQuestionMakerData = (questionData, index) => {
        // console.log(questionData);
        let newQuestion = this.state.questions;
        let newAnswers = this.state.answers;
        newQuestion[index].answers = questionData.answers;
        newQuestion[index].question = questionData.question;
        newAnswers[index].answer = questionData.answer;
        this.setState({
            questions: newQuestion,
            answers: newAnswers
        })
    }

    addQuestionMaker = () => {
        if (this.state.questions.length > 9) { return 0 }
        let newQuestion = this.state.questions;
        let newAnswer = this.state.answers;
        newQuestion.push({});
        newAnswer.push({});
        this.setState({
            questions: newQuestion,
            answers: newAnswer
        })
    }

    handleTopic = (e) => {
        this.setState({
            class: e.target.id
        })
    }

    addClass = (e) => {
        let classes = this.state.classes
        classes[e.target.id][1] = !classes[e.target.id][1];
        this.setState({
            classes: classes
        })
    }

    pickAnswer = (e) => {
        let classes = this.state.class;
        if (classes.includes(e.target.id)) {
            let answerIndex = classes.indexOf(e.target.id);
            classes.splice(answerIndex, 1)
            this.setState({
                classes: classes
            })
        } else {
            classes.push(e.target.id);
            this.setState({
                classes: classes
            })
        }
    }

    toggleDropdown = () => {
        this.setState({
            openDropdown: !this.state.openDropdown
        })
    }

    render() {
        // console.log(this.state);
        // const classes = ['5-6', '7-8', '9-10', '11-12', '13-18'];
        console.log(this.state);
        return (
            <div className="main_page">
                {/* <Header /> */}
                <div className="testMakerContainer">
                    <h1>Test Maker</h1>
                    <div className="saveChanges" onClick={this.createTest}><h4>Save Changes</h4></div>
                    <div className="testOptions">
                        <div className="input testTitle">
                            <input type="text" className="testTitle" placeholder="Test Theme" id="theme" onChange={this.handleChange} value={this.state.theme}/>
                        </div>
                        <div className="pickClasses">
                            <div className="classes">
                                {
                                    this.state.classes.map((class_, index) => {
                                        return (
                                            <div className={`${class_[0]} class`} key={index}>
                                                <span id={index} onClick={this.addClass} style={class_[1] ? { 'backgroundColor': '#c95050', 'border': 'initial'} : {}}></span>
                                                <h4>{class_[0]}</h4>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {/* <div className="input-field classes">
                            <div id="dropdown" className="dropdown" onClick={this.toggleDropdown}>
                                <span>Class {this.state.class} <i className="fas fa-caret-down" style={{
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
                        </div> */}
                    </div>
                    <div className="testMaker">
                        <div className="theTest">
                            {this.state.questions.map((question, index) => {
                                return (
                                    <TestQuestionMaker 
                                        key={index}
                                        index={index}
                                        getQuestionMakerData={this.getQuestionMakerData}
                                    />
                                )
                            })}
                            <div className="addQuestion" onClick={this.addQuestionMaker}>
                                <h4>Add Question</h4>
                            </div>
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
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTest: (testData, totalClasses) => dispatch(addTest(testData, totalClasses)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTest)