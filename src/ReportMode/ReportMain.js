import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {ReportSnapshot} from "./ReportSnapshot";
import {ReportProgress} from "./ReportProgress";

export class ReportMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            teacher_login: props.login
        }
        this.handleChooseSnapshot = this.handleChooseSnapshot.bind(this);
        this.back = this.back.bind(this);
        this.handleChooseProgress = this.handleChooseProgress.bind(this);
    }

    async componentDidMount() {
        const res = this.props.userType === 'ADMIN'? await fetch(`${ROUTE}/students`) : 
            await fetch(`${ROUTE}/teachers/${this.state.teacher_login}/caseload`);
        if (!res.ok) {
            alert('There was a problem loading students.  Please try again.');
            this.props.back();
        }
        const assignedStudents = await res.json();
        if (!assignedStudents.length || assignedStudents.length === 0) {
            alert('No students currently assigned to you.')
            this.props.back();
        } else {     
            if (!assignedStudents[0].student_id) {
                assignedStudents.forEach(student => student.student_id = student.id);
            }
            this.setState({
                students: assignedStudents,
                isLoaded: true
            })
        }
    }

    handleChooseSnapshot() {
        this.setState({
            page: <ReportSnapshot
                    students={this.state.students}
                    user={this.props.user}
                    back={this.back}
                  />
        })
    }

    handleChooseProgress() {
        this.setState({
            page: <ReportProgress students={this.state.students}
                user={this.props.user}
                back={this.back}
                toggleNav={this.props.toggleNav}
            />
        })
    }

    back() {
        window.scroll(0, 0);
        this.setState({
            page: false
        })
    }

    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
    }

    get rowForm() {
        return {
            flexDirection: "row",
            display: "flex",
            padding: "15px"
        }
    }

    render () {
        if (!this.state.isLoaded) {
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Loading...</p>
                </header>
            </div>
        } 
        if (this.state.page) {
            return this.state.page;
        }
        return (
            <div className="App">
                <header className="choice-header">
                    <h2>Progress Reporting</h2>
                    <p>A place to monitor student progress and generate IEP/BIP progress reports</p>
                </header>
                <body className="choice-body">
                    <div class="choice-row">
                    <button class="choice" onClick={this.handleChooseSnapshot} >
                        <h3>Progress Snapshot</h3>
                        <p>Get an update on a student's IEP progress</p>
                    </button>
                    <button class="choice" onClick={this.handleChooseProgress}>
                        <h3>Progress Report</h3>
                        <p>Get a printable progress report for ECE records</p>
                    </button>
                    </div>   
                </body>
                <header className="choice-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>
        )
    }
}
