import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DataForm} from './DataForm.js';



export class BackDate extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            login: this.props.login
        }
        this.handleChange = this.handleChange.bind(this);
        this.onChooseDate = this.onChooseDate.bind(this);
        this.onChooseStudent = this.onChooseStudent.bind(this);
        this.backToChooseDate = this.backToChooseDate.bind(this);
        this.chooseAnother = this.chooseAnother.bind(this);
        this.studentComplete = this.studentComplete.bind(this);
        this.allStudentsComplete = this.allStudentsComplete.bind(this);
        this.chooseAnotherDate = this.chooseAnotherDate.bind(this);
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        // use set timeout to make a minimum loading time
        const timer = await this.timeout(1000);
        const res = await fetch(`${ROUTE}/teachers/${this.state.login}/missingdata`);
        const missing = await res.json();
        if (missing && missing.length > 0) {
            this.setState({
                isLoaded: true,
                missing: missing,
                date: new Date(missing[0].date)
            })
        } else {
            this.setState({
                isLoaded: true,
                noMissing: true
            })
        }
    }

    handleChange(date) {
        this.setState({
          date: date
        })
    }


    onChooseDate(e) {
        e.preventDefault();
        const entry = this.state.missing.find(entry => {
            return this.state.date.toDateString() === new Date(entry.date).toDateString()
        })
       this.setState({
           students: entry.students
       })
    }

    onChooseStudent(e) {
        e.preventDefault();
        const clicked = parseInt(e.currentTarget.id);
        const student = this.state.students.find(student => student.id === clicked)
        this.setState({
            page: student.id,
            student: student
        })
    }

    chooseAnother(){
        this.setState({
            page: 0,
            student: false
        })
    }

    studentComplete() {
        const oneLess = this.state.students.filter(student => this.state.page !== student.id);
        this.setState({
            students: oneLess
        })
    }


    backToChooseDate() {
        this.setState({
            students: false,
            student: false,
            page: 0
        })
    }

    allStudentsComplete() {
        this.setState({
            students: false,
            student: false,
            page: 0,
            isLoaded: false,
            completed: true
        })
    }

    chooseAnotherDate() {
        this.setState({completed: false});
        this.componentDidMount();
    }

    get dates() {
        return this.state.missing.map(entry => Date.parse(entry.date));
    }

    students (caseload) {
        const scholars = caseload.map((student, index) => {
            return (
                <div>
                    <button id={student.id}
                            class="choice"
                            onClick={this.onChooseStudent}>
                        <h3>{student.name}</h3>
                    </button>
                </div>    
            )
        })
        const finalArray = []
        while (scholars.length > 0) {
            const rowItems = scholars.splice(0, 3);
            finalArray.push(
                <div class="choice-row">
                    {rowItems}
                </div>
            )
        }
        return finalArray;
    }

    render () {
        if (this.state.completed) {
            return (
                <div className="App">
                    <header className="choice-header">
                        <h2>Complete!  Thanks!</h2>
                        <h3>What next?</h3>  

                        <button onClick={this.chooseAnotherDate} class="choice" >
                                <h3>Complete data for another date</h3>
                            </button>
                            <button onClick={this.props.back} class="choice" >
                                <h3>Back to menu</h3>
                            </button>
                    </header>
                    <header class="choice-footer" />
                </div>
            )
        } else if (this.state.noMissing) {
            return (
                <div className="App">
                    <header class="App-header">
                        <h2>No missng data!</h2>
                        <button onClick={this.props.toChoices}>Awesome!</button>
                    </header>
                </div>
            )
        }

            if (this.state.student) {
            return (
                <DataForm
                onClick={this.chooseAnother} 
                login={this.state.login} 
                iepID={this.state.page}
                key={this.state.page} 
                student={this.state.student} 
                caseload={this.state.students}
                onStudentComplete={this.studentComplete}
                onCompleted={this.allStudentsComplete} 
                back={this.chooseAnother}
                backdated={this.state.date}
                />
            )
        } else if (this.state.students) {
            return (
                <div className="App">
                <header className="choice-header">
                    <h3>{new Date(this.state.date).toDateString()}</h3>
                    <h2>Which student do you want to complete data for?</h2>  
                </header>
                <div class="choice-body" > 
                    {this.students(this.state.students)}
                </div>
                <header class="choice-footer" >
                    <button onClick={this.backToChooseDate}>Go back</button>
                </header>
            </div>
            )
        } else {
            return (
                <div className="App">
                    <header className="choice-header">
                        {this.state.isLoaded? <h1>Seneca ECE-Wizard</h1> : <h3>Hopping into the Wayback Machine...</h3>}  
                    </header>
                    <div class="datepick">
                        <form>
                            {!this.state.isLoaded && <img src={logo} className="App-logo" alt="logo" />}
                            {this.state.isLoaded && <h3>Which date do you want to enter data for?</h3>}
                            {this.state.isLoaded && <DatePicker includeDates={this.dates} highlightDates={this.dates} inline selected={this.state.date} onChange={this.handleChange} />}
                            {this.state.isLoaded && <button onClick={this.onChooseDate}>Let's Go!</button>}
                        </form>                    
                    </div>
                    <header class="choice-footer" >
                        <button onClick={this.props.toChoices}>Go back</button>
                    </header>
                </div>
            )
        }
    }
}