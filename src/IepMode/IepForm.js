import React from 'react'; 
import '../App.css';
import {ROUTE, POSTING} from '../App.js';
import DatePicker from "react-datepicker";
import fetch from 'node-fetch';

export class IepForm extends React.Component {

    constructor(props) {
        super(props);
        const date = new Date()
        const endDate = new Date(date.getTime() + 1000*60*60*24*364);
        this.state = {
            login: props.login,
            date: date,
            endDate: endDate,
            goals: this.props.goals || []
        }
        this.nameChanged = this.nameChanged.bind(this);
        this.selectStudent = this.selectStudent.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleUnselect = this.handleUnselect.bind(this);
        this.handleAddGoal = this.handleAddGoal.bind(this);
        this.handleEditGoal = this.handleEditGoal.bind(this);
        this.handleDeleteGoal = this.handleDeleteGoal.bind(this);
        this.handleBackFromGoal = this.handleBackFromGoal.bind(this);
        this.handleSubmitGoal = this.handleSubmitGoal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async componentDidMount() {
        const studentRes = await fetch(`${ROUTE}/teachers/${this.state.login}/assigned`);
        const students = await studentRes.json();
        if (students) {
            this.setState({
                students: students,
                isLoaded: true
            })
        }
    }

    nameChanged(e) {
        this.setState({
            confirmed: false
        })
    }

    selectStudent(e) {
        e.preventDefault();
        const studentID = parseInt(document.getElementById('student').value)
        if (studentID === 'none') return;
        // filter students to get student
        const student = this.state.students.filter(student => student.student_id === studentID)[0];
        if (student.iep_exists) {
            this.setState({
                student: student,
                confirming: true,
                confirmed: false
            })
        } else {
            this.setState({
                student: student,
                confirmed: true
            })
        }
    }

    confirm() {
        this.setState({
            confirmed: true,
            confirming: false
        })
    }

    cancel() {
        this.setState({
            confirming: false
        })
    }

    handleChange(date) {
        this.setState({
          date: date,
          endDate: new Date(date.getTime() + 1000*60*60*24*364)
        })
    }

    handleEndChange(date) {
        this.setState({
            endDate: date
        })
    }

    handleSelected(e) {
        if (this.state.add) return;
        const clicked = parseInt(e.currentTarget.id);
        this.setState({
            goal: this.state.goals.slice(0)[clicked],
            goalIndex: clicked
        });
        e.stopPropagation()
    }

    handleUnselect(e) {
        if (this.state.add) return;
        if (this.state.goal) {
            this.setState({
                goal: false,
                goalIndex: false
            })
        }
    }

    handleAddGoal(e) {
        e.stopPropagation();
        if (this.state.add) return;
        document.getElementById("iep-body").className = "blur-body";
        document.getElementById("iep-footer").className = "blur-body";
        this.setState({
            add: true
        })
    }

    handleEditGoal(e) {
        if (this.state.add) return;
        e.stopPropagation();
        document.getElementById("iep-body").className = "blur-body";
        document.getElementById("iep-footer").className = "blur-body";
        this.setState({
            add: true,
            edit: true
        })
    }

    handleDeleteGoal(e) {
        if (this.state.add) return;
        e.stopPropagation();
        const agree = window.confirm("Are you sure you want to remove data collection for this goal?");
        if (agree) {
            const goals = this.state.goals.filter((goal, index) => index !== this.state.goalIndex);
            this.setState({
                goals: goals,
                goal: false,
                goalIndex: false
            })
        }
    }

    handleBackFromGoal(e) {
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        this.setState({
            add: false
        })
    }

    handleSubmitGoal(e) {
        e.preventDefault();
        const area = document.getElementById("area").value;
        if (area === "none") return;
        const goal = document.getElementById("goaldescription").value;
        const question = document.getElementById("dataquestion").value;
        const bool = document.getElementById("bool");
        const type = bool.checked ? "boolean" : "percentage";
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        const goals = this.state.goals.slice(0);
        if (this.state.edit) {
            goals[this.state.goalIndex] = {
                area: area,
                goal: goal,
                data_question: question, 
                response_type: type
            }
        } else {
            goals.push({
                area: area,
                goal: goal,
                data_question: question,
                response_type: type
            });
        }
        
        this.setState({
            goals: goals,
            add: false,
            edit: false
        })
    }

    async handleSubmit() {
        if (!window.confirm(`Once data collection is set, it cannot be deleted (only overwritten).  Continue? `)) return;
        const startDate = this.state.date;
        const endDate = this.state.endDate;
        const iepOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                student_id: this.state.student.student_id,
                goals: this.state.goals
            })    
        }
        const iepPosted = POSTING? await fetch(`${ROUTE}/students/${this.state.student.student_id}/iep`, iepOptions)
            : {ok: true};
        if (!iepPosted.ok) {
            alert('There was a problem posting the IEP.  Please try again');
            return;
        }
        this.props.onComplete()
    }

    get students() {
        const scholars = [<option value="none" selected disabled hidden>Select</option>];
          this.state.students.forEach(student =>scholars.push((<option value={student.student_id}>
                {`${student.first_name} ${student.last_name}`}
              </option>)));
          return scholars;
    }

    get confirming() {
        return (
            <div>
                <p style={{fontSize: "calc(9px + 1vmin)", color: "red"}}>IEP data collection already set up for this student.
                You can set up data collection for a new IEP, but
                data collection for the old IEP will end when the
                new one starts.  Continue anyway?</p>
                <div style={{flexDirection: "row"}}>
                    <button onClick={this.confirm}>Continue</button>
                    <span class="longSpacer"></span>
                    <button onClick={this.cancel}>Cancel</button>
                </div>       
            </div>
        )
    }

    get datesFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", 
                minWidth: "375px", 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "center", 
                display: "flex"}
    }

    get areaFormat() {
        return {
            width: "40vw"
        }
    }

    get textFormat() {
        return {
            width: "85vw"
        }
    }

    get goals() {
        if (this.state.goals) {
            return this.state.goals.slice(0).map((goal, index) => {
                const goalText = goal.goal.length > 20 ? goal.goal.slice(0,50) + '...' : goal.goal;
                return (
                    <div className="goal" id={index} tabindex="-1" onClick={this.handleSelected}>
                        <p style={this.areaFormat}>{goal.area}</p>
                        <p style={this.textFormat}>{goalText}</p>
                    </div>
                )
            })
        } else {
            return <span class="spacer"></span>;
        }
    }    


    get shadow() {
        return { boxShadow: "2px 2px 10px #9E9E9E"};
    }

    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
    }

    get height() {
        return {minHeight: "100px"};
    }

    get rowForm() {
        return {
            flexDirection: "row",
            display: "flex",
            padding: "15px"
        }
    }

    get form() {
        return (
            <div>
                <div class="card" style={this.cardFormat}>
                    <h3>{`${this.state.student.first_name} ${this.state.student.last_name}`}</h3> 
                    <p>{`Disability: ${this.state.student.disability}`}</p>
                </div>
                <div class="card" style={this.datesFormat}>
                    <div >
                        <p>Start date</p>
                        <DatePicker id="start_date" onChange={this.handleChange} selected={this.state.date} />
                    </div>
                    <span class="spacer"></span>
                    <div >
                        <p>End date</p>
                        <DatePicker id="end_date" onChange={this.handleEndChange} selected={this.state.endDate} />
                    </div>
                </div>
                <div class="card" style={this.cardFormat}>
                    <h3>Goals</h3>
                    <div style={this.rowForm}>
                        <button onClick={this.handleAddGoal}>Add goal</button>
                        {this.state.goal && <button onClick={this.handleEditGoal}>Edit goal</button>}
                        {this.state.goal && <button onClick={this.handleDeleteGoal}>Delete goal</button>}
                    </div>
                    <div id="goalBox" class="goalBox" style={this.height}>
                        {this.goals}
                    </div>
                </div>
            </div>
        )
    }

    get goalForm() {
        const selected = this.state.edit ? this.state.goal.area : undefined;
        const goalDescription = this.state.edit ? this.state.goal.goal : "";
        const dataQuestion = this.state.edit ? this.state.goal.data_question : '';
        const isBoolean = this.state.edit && this.state.goal.response_type === "boolean";
        const isPercent = this.state.edit && this.state.goal.response_type === "percentage";
        return (
                <form class="goalForm" style={this.cardFormat} onSubmit={this.handleSubmitGoal}>
                    <p>Set up data collection for IEP goal</p>
                    <label for="area">Teacher Responsible</label>
                    <select name="area" id="area" required >
                        <option value="English" selected={selected === "English"}>English</option>
                        <option value="Math" selected={selected === "Math"}>Math</option>
                        <option value="All" selected={selected === "All" || !selected}>All</option>
                    </select>
                    <br/>
                    <label for="textarea">Goal description</label>
                    <textarea id="goaldescription" name="textarea" rows="5" required placeholder="*Copy goal from IEP here*"
                    >{this.state.edit ? goalDescription : ''}</textarea>
                    <br/>
                    <label for="dataquestion">Question for data collection</label>
                    <textarea id="dataquestion" name="dataquestion" rows="3" required 
                        placeholder="*Write a question for data collection here*">
                        {this.state.edit ? dataQuestion : ''}
                    </textarea>
                    <br/>
                    <label for="type">Response Type</label>
                    <div style={{flexDirection: "row", display: "flex"}}>
                        {isBoolean ? <input type="radio" id="bool" name="type" value="boolean" checked ></input> :
                            <input type="radio" id="bool" name="type" value="boolean" ></input>}
                        <label for="bool" style={{fontSize: 16}}>Yes/No</label>
                    </div>
                    <div style={{flexDirection: "row", display: "flex"}}>
                        {isPercent ? <input type="radio" id="percent" name="type" checked
                               value="percentage" required ></input> : 
                               <input type="radio" id="percent" name="type" 
                               value="percentage" required ></input>}
                        <label for="percent" style={{fontSize: 16} } checked >Percent</label>
                    </div>
                    <div style={this.rowForm}>
                        <span class="looongSpacer"></span>
                        <button type="submit">Add Goal</button>
                        <span class="longSpacer"></span>
                        <button onClick={this.handleBackFromGoal}>Go Back</button>
                    </div>
                </form>
        )
    }

    render(){
        if (!this.state.isLoaded) {
            return (
                <div className="App"> 
                    <header className="IEP-header">
                        {this.props.loadingImage}
                        <h3>Loading...</h3>
                    </header>
                </div>
            )  
        } else {
            const buttonName = this.state.confirmed? 'Change' : 'Submit';
            return (
                <div className="App">
                    <body class="add-body">
                        {this.state.confirmed && this.state.add && this.goalForm}
                    </body>
                    <body id="iep-body" class="iep-body" onClick={this.handleUnselect}>
                        <h2>Set Up Data Collection</h2>
                        <div class="card" style={this.shadow}>
                            {this.state.confirmed || <label for="name">Which student?</label>}
                            <select class="studentSelect" required id="student" name="student" onChange={this.nameChanged}>
                                {this.students}
                            </select>
                            {!this.state.confirmed && !this.state.confirming && <input type="submit" value={buttonName} onClick={this.selectStudent}></input>}
                            {this.state.confirming && this.confirming}
                        </div>
                        {this.state.confirmed && this.form}
                        {this.state.confirmed && <button class="submitStyle" onClick={this.handleSubmit}>Finish Setup</button>}
                    </body>
                    <header class="iep-footer" id="iep-footer">
                        <button onClick={this.props.back}>Back</button>
                    </header>
                </div>
            )    
        }
    }
}