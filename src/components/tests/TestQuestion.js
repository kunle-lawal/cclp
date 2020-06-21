import React, {Component} from 'react'

class TestQuestion extends Component {
    state = {
        answer: [],
        textInput: ''
    }

    handleInput = (e) => {
        if (this.props.testDue) { return 0 }
        let answer = this.state.answer;
        answer[0] = e.target.value;
        this.setState({
            textInput: e.target.value,
            answer: answer
        })
        this.props.getAnswerData(this.state, this.props.index);
    }

    inputText = () => {
        if (this.props.testDue) { return 0 }
        let answer = this.state.answer;
        answer[0] = this.state.textInput
        this.setState({
            answer: answer
        })
        this.props.getAnswerData(this.state, this.props.index);
    }

    pickAnswer = (e) => {
        if (this.props.testDue) {return 0}
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
        
        this.props.getAnswerData(this.state, this.props.index);
    }

    componentDidMount() {
        // console.log(this.props);
        if(this.props.testAnswers === false) {return}
        this.setState({
            answer: this.props.testAnswers.answer,
            textInput: this.props.testAnswers.answer
        })
    }

    render() {
        const data = this.props.data;
        const alphabet = ['A', 'B', 'C', 'D'];
        // console.log(this.state);
        return (
            <div className="testQuestions">
                <div className="question">
                    <span><h4>{this.props.index + 1}</h4></span>
                    <h4>{data.question}</h4>
                </div>
                <div className="answers">
                    <ol>
                        {
                            data.answers.map((question, index) => {
                                return (
                                    <li key={index} onClick={question === 'text_input_answer' ? this.inputText : this.pickAnswer} id={question === 'text_input_answer' ? `input` : index}><span className="option_button" id={index} style={this.state.answer.includes(alphabet[index]) ? { 'backgroundColor': '#c95050' } : {}} ></span><div className="answer" style={this.state.answer.includes(alphabet[index]) ? { 'border': '2px solid #c95050' } : {}} id={index}><span>{alphabet[index]}</span>{question === 'text_input_answer' ? <input onChange={this.handleInput} id={`input`} type="text" className="textInput" placeholder="My Answer" value={this.state.textInput}/> : <h4 id={index}>{question}</h4>}</div></li>
                                )
                            })
                        }
                    </ol>
                </div>
            </div>
        )
    }
}

export default TestQuestion