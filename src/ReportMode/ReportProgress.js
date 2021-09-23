import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {IepChart, BipChart} from './Charts';

export class ReportProgress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: props.students
        }
        this.students = this.students.bind(this);
        this.selectStudent = this.selectStudent.bind(this);
        this.back = this.back.bind(this);
        this.print = this.print.bind(this);
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
        this.setState({
            responses: responseData.response,
            loading: false,
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

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async print() {
        this.props.toggleNav()
        this.setState({
            printing: true
        })
        const timer = await this.timeout(100);
        window.print();
        this.setState({
            printing: false
        })
        this.props.toggleNav()
    }


    get goalReports() {
        const goals = this.state.responses.slice(0);
        const reports = [];
        const bipReports = [];
        goals.forEach(goal => {
            if (goal.area === 'BIP') {
                reports.push(
                    (
                        <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "100%", Height: "100%", marginBottom: "11%"}}>
                            <div style={this.rowForm}>
                                <div className="card" style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "50vw"}}>
                                    <div style={this.rowForm}>
                                        <div>
                                            <h3>{`Name:   ${this.state.studentSelected.name}`}</h3>
                                            <h3>{`ID:   ${this.state.studentSelected.student_id}`}</h3>
                                            <h3>{`Disability:   ${this.state.studentSelected.disability}`}</h3>
                                        </div>
                                        <span class="spacer"/>
                                        <div>
                                            <h3>School:   Seneca High School</h3>
                                            <h3>{`TOR:  ${this.props.user}`}</h3>
                                        </div>
                                        <span class="spacer"/>
                                        <div style={{width: "55%"}}>
                                            <p style={{fontSize: "12px"}}>{`Target Behavior: ${goal.goal.replace(/@%/g, "'")}`}</p>
                                        </div>
                                    </div>
                                </div>
                                <span class="spacer"></span>
                                <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E"}}>
                                    <p>Progress Summary</p>
                                    <textarea cols="10" rows="10"></textarea>
                                </div>
                            </div>
                            <h1>BIP</h1>
                            <div style={this.rowForm}>
                                <div className="chart" >
                                    <BipChart student={this.state.studentSelected} data={goal.compiled}/>
                                </div>
                            </div>
                        </div>
                    )
                )
            } else if (goal.area === 'meta') {
                //Do nothing
            } else {
                reports.push(
                    (
                        <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "100%", Height: "100%", marginBottom: "0%"}}> 
                            <div style={this.rowForm}>
                                <div className="card" style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "50vw"}}>
                                    <div style={this.rowForm}>
                                        <div>
                                            <h3>{`Name:   ${this.state.studentSelected.name}`}</h3>
                                            <h3>{`ID:   ${this.state.studentSelected.student_id}`}</h3>
                                            <h3>{`Disability:   ${this.state.studentSelected.disability}`}</h3>
                                        </div>
                                        <span class="spacer"/>
                                        <div>
                                            <h3>School:   Seneca High School</h3>
                                            <h3>{`TOR:  ${this.props.user}`}</h3>
                                        </div>
                                        <span class="spacer"/>
                                        <div style={{width: "33vw"}}>
                                            <p style={{fontSize: "12px"}}>{goal.goal.replace(/@%/g, "'")}</p>
                                        </div>
                                    </div>
                                </div>
                                <span class="spacer"></span>
                                <div class='card' style={{boxShadow: "2px 2px 10px #9E9E9E", minWidth: "0px"}}>
                                    <p>Progress Summary</p>
                                    <textarea cols="5" rows="10"></textarea>
                                </div>
                            </div> 
                            
                            <h1>{goal.description}</h1>
                            <div style={this.rowForm}>
                                <div className="chart" >
                                    <IepChart student={this.state.studentSelected} data={goal.compiled}/>
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
                    
                    {!this.state.printing && <div>
                        <button onClick={this.print} style={{height: "50px", width: "100px", fontSize: "20px"}}>Print</button>
                        <span class="spacer"/>
                        <button onClick={this.back} style={{height: "50px", width: "100px", fontSize: "20px"}}>Back</button>
                    </div>}
                    
                    {this.state.studentSelected && this.goalReports}
                    {!this.state.printing && <button onClick={this.back}>Back</button>}
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
                        <button style={{height: "40px"}} onClick={this.selectStudent}>Get printable progress report</button>
                    </div>
                </body>
                <header className="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>
        )
    }
}