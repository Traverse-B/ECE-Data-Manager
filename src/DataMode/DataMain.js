import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {DataForm} from './DataForm.js';
import {PickStudent} from './PickStudent';

export class DataMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            login: props.login,
            userType: props.userType,
            page: 0,
            isLoaded: false
        }
        this.chooseStudent = this.chooseStudent.bind(this);
        this.chooseAnother = this.chooseAnother.bind(this);
        this.studentComplete = this.studentComplete.bind(this);
        this.back = this.back.bind(this);
        this.last = this.back.bind(this);
    }

    async componentDidMount() {
        const res = await fetch(`${ROUTE}/teachers/${this.state.login}/dataform`);
        const caseload = await res.json();
        if (caseload.length > 0) {
            this.setState({
                caseload: caseload,
                isLoaded: true
            })
        } else {
            this.setState({
                noCaseload: true,
                isLoaded: true
            })
        }
    }

    chooseStudent(e) {
        e.preventDefault();
        const clicked = parseInt(e.currentTarget.id);
        const student = this.state.caseload.find(student => student.id === clicked)
        this.setState({
            page: student.id,
            student: student
        })
    }  
    
    chooseAnother() {
        this.setState({
            page: 0
        })
    }

    back() {
        this.setState({
            page: 0,
            student: false
        })
    }

    studentComplete() {
        const oneLess = this.state.caseload.filter(student => this.state.page !== student.id);
        this.setState({
            caseload: oneLess
        })
    }

    last() {
        this.setState({
            completed: true
        })
    }

    get loadingImage() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Loading...</p>
                </header>
            </div>
        )
    }

    render() {
        if (!this.state.isLoaded) {
            return this.loadingImage
        } else if (this.state.noCaseload) {
                return(
                    <div className="App">
                        <header class="App-header">
                            <h2>No students to report on today!</h2>
                            <button onClick={this.props.toChoices}>Awesome!</button>
                        </header>
                    </div>
                )
        } else if (this.state.page === 0) {
            return (
                <PickStudent    
                    caseload={this.state.caseload} 
                    onClick={this.chooseStudent} 
                    back={this.chooseAnother}
                    toChoices={this.props.toChoices}
                />
            )
        } else {
            return (
                <DataForm 
                    onClick={this.chooseAnother} 
                    login={this.state.login} 
                    iepID={this.state.page}
                    key={this.state.page} 
                    student={this.state.student} 
                    caseload={this.state.caseload}
                    onStudentComplete={this.studentComplete}
                    onCompleted={this.props.onCompleted} 
                    back={this.chooseAnother}
                />
            )
        }
    }
}



