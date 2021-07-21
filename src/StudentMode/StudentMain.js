import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {StudentForm} from './StudentForm';
import {StudentSearch} from './StudentSearch';
import fetch from 'node-fetch';

export class StudentMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            key: 0,
            isAdmin: props.userType === "ADMIN",
            login: props.login
        }
        this.addStudent = this.addStudent.bind(this);
        this.editStudent = this.editStudent.bind(this);
        this.back = this.back.bind(this);
        this.addAnother = this.addAnother.bind(this);
        this.updateStudentList = this.updateStudentList.bind(this);
    }

    async componentDidMount() {
        const studentRes = await fetch(`${ROUTE}/students`);
        const studentData = await studentRes.json();
        const teacherRes = await fetch(`${ROUTE}/teachers`);
        const teacherData = await teacherRes.json();
        const caseRes = await fetch(`${ROUTE}/teachers/${this.state.login}/assigned`);
        const caseload = await caseRes.json();
        const lastDateRes = await fetch(`${ROUTE}/lastdate`)
        const lastDateData = await lastDateRes.json();
        const lastDate = new Date(lastDateData[0].max);
        if (!teacherRes.ok || !studentRes.ok || !caseRes.ok || !lastDateRes.ok) {
            alert('There was a problem loading data.  Please try again.')
            this.back();
        }
        if (caseload.length === 0) {
            this.setState({
                noCaseLoad: true
            })
        }
        this.setState({
            students: caseload,
            allStudents: studentData,
            teachers: teacherData,
            lastDate: lastDate,
            isLoaded: true
        })
    }

    async updateStudentList() {
        this.setState({
            isLoaded: false
        });
        const studentRes = await fetch(`${ROUTE}/students`);
        const studentData = await studentRes.json();
        if (!studentRes.ok) {
            alert(`There was a problem loading data.  Reloading student management app`);
            this.props.back();
        }
        this.setState({
            allStudents: studentData,
            isLoaded: true
        })
    }

    addStudent() {
        const key = (this.state.key + 1) % 2;
        this.setState({
            add: true,
            key: key
        })
    }

    editStudent() {
        const key = (this.state.key + 1) % 2;
        this.setState({
            edit: true,
            key: key
        })
    }

    back() {
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        document.getElementById("iep-header").className = "iep-header";
        this.setState({
            add: false,
            edit: false
        })
        window.scroll(0,0);
    }

    addAnother() {
        this.updateStudentList();
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        document.getElementById("iep-header").className = "iep-header";
        const key = (this.state.key + 1) % 2;
        this.setState({
            key: key
        })
        window.scroll(0,0);
    }


    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p>Loading...</p>
                    </header>
                </div>
            )  
        } else if (this.state.add) {
            return (
                        <StudentForm 
                            students={this.state.students}
                            allStudents={this.state.allStudents}
                            teachers={this.state.teachers}
                            key={this.state.key}
                            addAnother={this.addAnother}
                            back={this.back}
                            login={this.state.login}
                            lastDate={this.state.lastDate}
                        />
            )
        } else if (this.state.edit) {
            return (
                <StudentSearch 
                            students={this.state.students}
                            teachers={this.state.teachers}
                            back={this.back}
                            updateStudentList={this.updateStudentList}
                        />
            )
        } else if (this.state.students) {
            return (
                <div className="App">
                    <header class="iep-header" >
                        <h1>Student Management</h1>
                        <p>A place for you to add, edit or delete students from the ECE-Wizard's roster</p> 
                    </header>
                    <body class="iep-body">
                        <br/>
                        <div class="card" style={this.cardFormat} >
                            <p>What do you wish to do?</p>
                            <div class="choice-row" style={{margin: "0"}} >
                                <button onClick={this.addStudent}>Add Student</button>
                                {!this.state.noCaseLoad && <button onClick={this.editStudent}>Edit Student</button>}
                                {this.state.isAdmin && <button>Delete Student</button>}
                            </div>
                            <br/>
                        </div>
                    <br/><br/>
                    </body>
                    <header class="iep-footer" >
                        <button onClick={this.props.back}>Back</button>
                    </header>
                </div>
                
            )
        }
    }
}
