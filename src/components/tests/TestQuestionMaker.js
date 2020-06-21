import React, {Component} from 'react'

class TestQuestionMaker extends Component {
    state = {
        question: '',
        answers: [''],
        answer: [],
        timeout: null
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]:e.target.value 
        })
        this.passDataUp();
    }

    handleAnswers = (e, index) => {
        let newAnswers = this.state.answers;
        newAnswers[index] = e.target.value;
        this.setState({
            answers: newAnswers
        })
        this.passDataUp();
    }

    addQuestion = () => {
        if(this.state.answers.length > 3) {return 0}
        let newAnswers = this.state.answers;
        newAnswers.push('')
        this.setState({
            answers: newAnswers
        })
        this.passDataUp();
    }

    passDataUp  = () => {
        if (this.state.timeout === null) {
            // console.log('love');
            clearInterval(this.state.timeout);
            var timeout = window.setTimeout(() => {
                this.props.getQuestionMakerData(this.state, this.props.index);
                clearInterval(this.state.timeout);
                this.setState({
                    timeout: null
                })
            }, 2000);
            this.setState({
                timeout: timeout
            })
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.timeout);
    }

    pickAnswer = (e) => {
        let alphabet = ['A', 'B', 'C', 'D'];
        let answer = this.state.answer;
        if (answer.includes(alphabet[e.target.id])) {
            let answerIndex = answer.indexOf(alphabet[e.target.id]);
            answer.splice(answerIndex, 1)
            this.setState({
                answer: answer
            })
        } else {
            answer.push(alphabet[e.target.id]);
            this.setState({
                answer: answer
            })
        }
    }

   render() {
       let alphabet = ['A', 'B', 'C', 'D'];
       return (
           <div className="testQuestions">
               <div className="topStrip">
                   <span className="trashCan"><i className="fas fa-trash-alt"></i></span>
                   <span className="arrowUp"><i className="fas fa-arrow-up"></i></span>
                   <span className="arrowDown"><i className="fas fa-arrow-down"></i></span>
               </div>
               <div className="question">
                   <span>{this.props.index + 1}.</span>
                   <h4><input type="text" className="questionTitle" placeholder="What is dominion?" id="question" onChange={this.handleChange} value={this.state.question}/></h4>
               </div>
               <div className="answers">
                   <ol>
                       {this.state.answers.map((answer, index) => {
                           return (
                               <li key={index}><span id={index} onClick={this.pickAnswer} className="option_button" style={this.state.answer.includes(alphabet[index]) ? { 'backgroundColor':'#c95050'} : {}} ></span><div className="answer"><span>{alphabet[index]}</span> <input type="text" placeholder="This is a answer" id="question" value={this.state.answers[index]} onChange={(e) => this.handleAnswers(e, index)} /></div></li>
                           )
                       })}
                       {this.state.answers.length < 4 ? <li className="addAnswer" onClick={this.addQuestion}>
                           <span>
                               <i className="fas fa-plus"></i>
                           </span>
                           <h4>Add Answer</h4>
                       </li> : <li className="addAnswer" style={{'paddingLeft':'20px'}}><h4 className="center">4 Answer</h4></li> }
                   </ol>
               </div>
           </div>
       )
   }
}


export default TestQuestionMaker