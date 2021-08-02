import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {IepChart, AttendanceChart, BipChart, MetaChart} from './Charts';

export class ReportSnapshot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: props.students
        }
        this.students = this.students.bind(this);
        this.selectStudent = this.selectStudent.bind(this);
        this.back = this.back.bind(this);
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

    students() {
        const studentList = [<option value="none" selected disabled hidden>Select</option>]
        this.state.students.forEach(student => {
            studentList.push(<option value={student.student_id}>{`${student.first_name} ${student.last_name}`}</option>)
        });
        return studentList;
    }

    async selectStudent() {
        window.scroll(0, 0);
        const studentData = document.getElementById("students").value;
        if (studentData === 'none') return;
        this.setState({
            loading: true
        })
        const studentId = parseInt(studentData);
        const iepRes = await fetch(`${ROUTE}/students/${studentId}/allgoals`);
        if (!iepRes.ok) {
            alert('There was an issue loading IEP data.  Please try again.');
            this.setState({
                loading: false
            })
            return;
        }
        const iepData = await iepRes.json();
        if (iepData.length === 0) {
            alert('Student does not have data collection set up for any goals.')
            this.setState({
                loading: false
            })
            return;
        }
        const student = this.state.students.filter(student => student.student_id === studentId)[0];
        this.setState({
            studentSelected: student,
            goals: iepData,
            loading: false
        })
    }

    back() {
        this.setState({
            studentSelected: false
        })
    }


    render () {
        if (this.state.loading) {
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h3>Loading...</h3>
                </header>
            </div>
        }
        if (this.state.studentSelected) {
            return (
                <div>
                    <div style={{padding: "10px", flexDirection: "row", display: "flex"}}>
                        <div className="card" style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "50vw"}}>
                            <h1>Student Information</h1>
                            <div style={this.rowForm}>
                                <div>
                                    <h3>{`Name:   ${this.state.studentSelected.first_name} ${this.state.studentSelected.last_name}`}</h3>
                                    <h3>{`ID:   ${this.state.studentSelected.student_id}`}</h3>
                                    <h3>{`Disability:   ${this.state.studentSelected.disability}`}</h3>
                                </div>
                                <span class="longSpacer"/>
                                <div>
                                    <h3>School:   Seneca High School</h3>
                                    <h3>{`TOR:  ${this.props.user}`}</h3>
                                    <h3>{`Data Start Date: ${this.state.goals[0].start_date}`}</h3>
                                </div>
                            </div>
                        </div>
                        <span class="spacer"/>
                        <div className='card' style={{boxShadow: "2px 2px 10px #9E9E9E", width: "30vw"}}>
                            <h1>Attendance</h1>
                            <div style={{height: "20vw", width: "20vw", alignItems: "center", marginLeft: "20%"}}>
                                <AttendanceChart />
                            </div>
                            <select></select>
                        </div>
                    </div>
                    <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", marginBottom: "10px"}}>
                        <h1>Reading</h1>
                        <div style={this.rowForm}>
                            <div className="chart" >
                                <IepChart/>
                            </div>
                            <div style={{width: "25%"}}>
                                <p>Goal:  Given a reading passage, Tom will answer inferential questions after reading the passage with 70% accuracy</p>
                            </div>
                        </div>
                    </div>
                    <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", marginBottom: "10px"}}>
                        <h1>BIP</h1>
                        <div style={this.rowForm}>
                            <div className="chart" >
                                <BipChart/>
                            </div>
                            <div style={{width: "25%"}}>
                                <p>Target Behavior:  When given a non-prefered direction, Tom will swear, make threats, and use physical aggression</p>
                            </div>
                        </div>
                    </div>
                    <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", height: "75vh"}}>
                        <h1>Other Data</h1>
                        <div style={this.rowForm}>
                            <div style={{height: "20vw", width: "20vw", alignItems: "center", marginLeft: "5%"}} >
                                <h3>Completed Work</h3>
                                <MetaChart/>
                            </div>
                            <span class="longSpacer" />
                            <div style={{height: "20vw", width: "20vw", alignItems: "center", marginLeft: "5%"}} >
                                <h3>Met Behavior Expectations</h3>
                                <MetaChart/>
                            </div>
                        </div>
                    </div>
                    <button onClick={this.back}>Back</button>
                </div>
               
            )
        }
        return (
            <div className="App">
                <header className="choice-header">
                    <h1>Progress Snapshot</h1>
                    <p>See student data and IEP progress as collected by the ECE Wizard</p>
                </header>
                <body className="iep-body">
                    <div class="card" style={this.cardFormat}>
                        <h3>Which student?</h3>
                        <select id="students">
                            {this.students()}
                        </select>
                        <br/>
                        <button style={{height: "40px"}} onClick={this.selectStudent}>Get progress snapshot</button>
                    </div>
                </body>
                <header className="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>
        )
    }
}