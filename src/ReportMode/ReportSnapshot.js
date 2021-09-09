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
        const responseRes = await fetch(`${ROUTE}/students/${studentId}/responses`);
        if (!responseRes.ok) {
            alert ('There was a problem loading data.  Please try again!');
            return;
        }
        const responseData = await responseRes.json();
        if (responseData.length === 0) {
            alert('No data found for this student.  Please make sure that data collection is set up and that teachers are able to provide data!')
            return;
        }
        const attendanceRes = await fetch(`${ROUTE}/students/${studentId}/attendance`);
        if (!attendanceRes.ok) {
            alert('There was a problem loading attendance.  Please try again!')
            return;
        }
        const attendanceData = await attendanceRes.json();
        this.setState({
            responses: responseData.response,
            loading: false,
            attendance: [
                {name: 'Marked present', value: parseInt(attendanceData[0].present)},
                {name: 'Marked excused', value: parseInt(attendanceData[0].excused)},
                {name: 'Marked absent', value: parseInt(attendanceData[0].absent)}
            ],
            studentSelected: {
                name: responseData.name,
                student_id: studentId, 
                start_date: responseData.start_date,
                disability: responseData.disability
            }
        })
    }

    back() {
        this.setState({
            studentSelected: false
        })
    }


    get goalReports() {
        const goals = this.state.responses.slice(0);
        const reports = [];
        const bipReports = [];
        const metaReports = [];
        goals.forEach(goal => {
            if (goal.area === 'BIP') {
                reports.push(
                    (
                        <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", marginBottom: "10px"}}>
                            <h1>BIP</h1>
                            <div style={this.rowForm}>
                                <div className="chart" >
                                    <BipChart student={this.state.studentSelected} data={goal.compiled}/>
                                </div>
                                <div style={{width: "25%"}}>
                                    <p>Target Behavior:  When given a non-prefered direction, Tom will swear, make threats, and use physical aggression</p>
                                </div>
                            </div>
                        </div>
                    )
                )
            } else if (goal.area === 'meta') {
                metaReports.push(
                    (
                        <div>
                            <div style={{height: "20vw", width: "20vw", alignItems: "center", marginLeft: "5%"}} >
                                <h3>{goal.description}</h3>
                                <MetaChart student={this.state.studentSelected} data={goal.compiled}/>
                            </div>
                        <span class="longSpacer" />
                        </div>
                    )
                )
            } else {
                reports.push(
                    (
                        <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", marginBottom: "10px"}}>  
                            <h1>{goal.description}</h1>
                            <div style={this.rowForm}>
                                <div className="chart" >
                                    <IepChart student={this.state.studentSelected} data={goal.compiled}/>
                                </div>
                                <div style={{width: "25%"}}>
                                    <p>{goal.goal}</p>
                                </div>
                            </div>
                        </div>
                    )
                )
            }
        });
        return (
            <div>
                {reports}
                {bipReports}
                <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "83.2vw", marginLeft: "10px", height: "75vh"}}>
                        <h1>Other Data</h1>
                        <div style={this.rowForm}>
                                {metaReports}
                        </div>
                    </div>
            </div>
        )                      
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
                                    <h3>{`Name:   ${this.state.studentSelected.name}`}</h3>
                                    <h3>{`ID:   ${this.state.studentSelected.student_id}`}</h3>
                                    <h3>{`Disability:   ${this.state.studentSelected.disability}`}</h3>
                                </div>
                                <span class="longSpacer"/>
                                <div>
                                    <h3>School:   Seneca High School</h3>
                                    <h3>{`TOR:  ${this.props.user}`}</h3>
                                </div>
                            </div>
                        </div>
                        <span class="spacer"/>
                        <div className='card' style={{boxShadow: "2px 2px 10px #9E9E9E", width: "30vw"}}>
                            <h1>Attendance</h1>
                            <div style={{height: "20vw", width: "20vw", alignItems: "center", marginLeft: "20%"}}>
                                <AttendanceChart data={this.state.attendance}/>
                            </div>
                        </div>
                    </div>
                    {this.state.studentSelected && this.goalReports}
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