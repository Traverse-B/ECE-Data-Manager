import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import DatePicker from "react-datepicker";
import {POSTING} from '../App.js';

export class StudentForm extends React.Component {

    constructor(props) {
        super(props);
        const date = new Date();
        const endDate = this.props.lastDate
        this.state = {
            date: date,
            endDate: endDate,
            students: this.props.allStudents,
            teachers: this.props.teachers,
        }
        this.addTeachers = this.addTeachers.bind(this);
        this.isCoteacher = this.isCoteacher.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleUnselect = this.handleUnselect.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.scheduleTeacher = this.scheduleTeacher.bind(this);
        this.backFromTeacherForm = this.backFromTeacherForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    addTeachers(e) {
        e.preventDefault();
        const teacherList = [<option value="none" selected disabled hidden>Select</option>]
        this.state.teachers.forEach(teacher => {
            teacherList.push(<option value={teacher.login}>{teacher.name}</option>)
        });
        document.getElementById("iep-body").className = "blur-body";
        document.getElementById("iep-footer").className = "blur-body";
        document.getElementById("iep-header").className = "blur-body";
        this.setState({
            addTeachers: true,
            teacherList: teacherList
        })
    }

    deleteTeacher() {
        if (!this.state.selectedTeacher || this.state.addTeachers) return;
        const scheduledTeachers = this.state.scheduledTeachers.slice(0);
        scheduledTeachers.splice(this.state.teacherIndex, 1);
        this.setState({
            scheduledTeachers: scheduledTeachers,
            selectedTeacher: false,
            teacherIndex: false
        })
    }

    handleSelected(e) {
        if (this.state.addTeachers) return;
        const clicked = parseInt(e.currentTarget.id);
        this.setState({
            selectedTeacher: this.state.teachers.slice(0)[clicked],
            teacherIndex: clicked
        });
        e.stopPropagation()
    }

    handleUnselect(e) {
        if (this.state.addTeachers) return;
        if (this.state.selectedTeacher) {
            this.setState({
                selectedTeacher: false,
                teacherIndex: false
            })
        }
    }

    isCoteacher() {
        const answer = document.getElementById("coteacher").checked;
        this.setState({
            coteacher: answer
        })
    }
    scheduleTeacher(e) {
        e.preventDefault();
        const sel = document.getElementById('teacherList');
        const scheduledRole = document.getElementById('role').value;
        const otherTeacher = document.getElementById('coteacher').checked;
        const scheduledCoteacher = otherTeacher? document.getElementById("coteacherList").value : null;
        const scheduledTeachers = this.state.scheduledTeachers? this.state.scheduledTeachers.slice(0) : []
        scheduledTeachers.push({
            name: sel.options[sel.selectedIndex].text,
            teacher_login: sel.value,
            role: scheduledRole,
            coteacher_login: scheduledCoteacher,
            start_date: this.state.date,
            end_date: this.state.endDate
        });
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        document.getElementById("iep-header").className = "iep-header";
        this.setState({
            scheduledTeachers: scheduledTeachers,
            addTeachers: false,
            coteacher: false
        })
    }

    handleChange(date) {
        this.setState({
          date: date,
          endDate: new Date(date.getTime() + 1000*60*60*24*364)
        })
    }

    backFromTeacherForm() {
        document.getElementById("iep-body").className = "iep-body";
        document.getElementById("iep-footer").className = "iep-footer";
        document.getElementById("iep-header").className = "iep-header";
        this.setState({
            addTeachers: false,
            coteacher: false
        })
    }

    async submitForm(e) {
        e.preventDefault();
        if (this.state.addTeachers) return;
        if (!this.state.scheduledTeachers || this.state.scheduledTeachers.length === 0) {
            alert(`No teachers assigned to student's schedule. Please add teachers to schedule before submitting this form.`);
            return;
        }
        const student_id = parseInt(document.getElementById('student_id').value);
        // Check to ensure ID doesn't exist in database
        const numberUsed = this.state.students.findIndex(student => student.id === student_id) !== -1;
        if (numberUsed) {
            alert(`Student has already been created with this ID.  Please use another ID or edit the profile created for this ID`);
            return;
        }
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const disability = document.getElementById('disability').value;
        let scheduledTeachers = this.state.scheduledTeachers.slice(0);
        scheduledTeachers.forEach(teacher => {
            teacher.student_id = student_id
        })
        const postOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_id: student_id,
                first_name: first_name,
                last_name: last_name,
                disability: disability,
                TOR: this.props.login,
                scheduledTeachers: scheduledTeachers
            })
        }
        const dataPosted = POSTING ? await fetch(`${ROUTE}/students`, postOptions) : {ok: true};
        if (!dataPosted.ok) {
            alert(`There was a problem posting data.  Please try again.`);
            return;
        }
        document.getElementById("iep-body").className = "blur-body";
        document.getElementById("iep-footer").className = "blur-body";
        document.getElementById("iep-header").className = "blur-body";
        this.setState({
            formSent: true,
            studentName: `${first_name} ${last_name}`
        })
    }

    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
    }

    get areaFormat() {
        return {
            width: "20vw"
        }
    }

    get textFormat() {
        return {
            width: "24vw"
        }
    }

    get rowForm() {
        return {
            flexDirection: "row",
            display: "flex",
            padding: "15px"
        }
    }

    get noPaddingRow() {
        return {
            flexDirection: "row",
            display: "flex",
            justifyContent: "center"
        }
    }

    get teachers() {
        if (this.state.scheduledTeachers && this.state.scheduledTeachers.length > 0) {
            return this.state.scheduledTeachers.map((teacher, index) => {
                return (
                    <div className="goal" id={index} tabindex="-1" onClick={this.handleSelected}>
                        <p style={this.areaFormat}>{teacher.name}</p>
                        <p style={this.textFormat}>
                            {`${teacher.start_date.toDateString().slice(4)}-${teacher.end_date.toDateString().slice(4)}`}
                        </p>
                        <p>{teacher.role}</p>
                    </div>
                )
            })
        } else {
            return <div className="goal" id="none" >
                <p>No teachers scheduled</p>
            </div>
        }
    }

    get teacherForm() {
        return (
            <form key={this.state.id} class="goalForm" style={this.cardFormat} onSubmit={this.scheduleTeacher}>
                <br/>
                <label for="teacherList">Teacher Name</label>
                <select id="teacherList" name="teacherList" required>
                    {this.state.teacherList}
                </select>
                <br/>
                <div style={this.noPaddingRow} >
                    <div>
                        <label for="start_date" style={{marginRight: '5px'}}>Start date</label>
                        <div className="customDatePickerWidth" >
                            <DatePicker id="start_date" name="start_date" onChange={this.handleChange} selected={this.state.date} />
                        </div>
                    </div>
                    <div>
                        <label for="end_date" style={{marginRight: '5px'}}>End date</label>
                        <div className="customDatePickerWidth" >
                            <DatePicker id="end_date" name="end_date" onChange={this.handleChange} selected={this.state.endDate} />
                        </div>
                    </div>   
                </div>
                <br/>
                <label for="role" >Subject area</label>
                <select id="role" name="role" required>
                    <option value="none" hidden disabled selected>Select</option>
                    <option value="English">English</option>
                    <option value="Math">Math</option>
                    <option value="Other">Other</option>
                </select>
                <div style={this.rowForm} >
                    <label for="coteacher">Assign co-teacher</label>
                    <span class="spacer"></span>
                    <input type="checkbox" name="coteacher" id="coteacher" onChange={this.isCoteacher}></input>
                </div>
                {this.state.coteacher && (
                    <div>
                        <label for="coteacherList">Co-teacher name</label>
                        <select id="coteacherList" name="coteacherList" required={document.getElementById("coteacher").checked}>
                            {this.state.teacherList}
                        </select>
                    </div>
                )}
                <br/>
                <input type="submit" value="Add teacher to schedule" ></input>
                <button onClick={this.backFromTeacherForm}>Back</button>
            </form>
        )   
    }

    get nextStep() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>{`${this.state.studentName} added to student roster.  
                Add another student or return to menu options?`}</h3>
                <div style={this.rowForm} >
                    <button onClick={this.props.addAnother} >Add another student</button>
                    <span class="spacer"></span>
                    <button onClick={this.props.back}>Back to menu options</button>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="App" >
                <header class="iep-header" id="iep-header" >
                    <h1>Student Management</h1>
                    <h3>Add a student</h3> 
                </header>
                <body class="add-body" id="add-body">
                    {this.state.addTeachers && this.teacherForm}
                    {this.state.formSent && this.nextStep}
                </body>
                <body class="iep-body" id="iep-body">
                    <body onClick={this.handleUnselect}>
                        <form class= "card" style={this.cardFormat} onSubmit={this.submitForm}>
                            <br/>
                            <label for="first_name" >First name</label>
                            <input id="first_name" required></input>
                            <br/>
                            <label for="last_name" required>Last name</label>
                            <input id="last_name" ></input>
                            <br/>
                            <label for="student_id" >Student ID</label>
                            <input type="number" id="student_id" required></input>
                            <br/>
                            <label for="disability">Disability</label>
                            <select name="disability" id="disability" required>
                                <option value="none" hidden disabled selected>Select</option>
                                <option value="OHI">OHI</option>
                                <option value="SLD">SLD</option>
                                <option value="MMD">MMD</option>
                                <option value="EBD">EBD</option>
                                <option value="AUT">AUT</option>
                                <option value="MD" >MD</option>
                                <option value="FMD">FMD</option>
                                <option value="TBI">TBI</option>
                                <option value="OTHER">OTHER</option>
                            </select>
                            <p>Scheduled Teachers</p>
                            <div style={this.rowForm}>
                                <button onClick={this.addTeachers}>Add</button>
                                <span class="spacer"/>
                                {this.state.selectedTeacher && <button onClick={this.deleteTeacher} >Delete</button>}
                            </div>
                            <div id="goalBox" class="goalBox" style={this.height}>
                                {this.teachers}
                            </div>
                            <input type="submit" value="Add student to roster"></input>
                        </form>
                    </body>
                </body>
                <header class="iep-footer" id="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>
        )
    }
}