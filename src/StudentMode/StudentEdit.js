import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import DatePicker from "react-datepicker";
import {POSTING} from '../App.js';

export class StudentEdit extends React.Component {

    constructor(props) {
        super(props);
        const today = new Date();
        const yearFromToday = new Date(today.getTime() + 1000*60*60*24*364)
        this.state = {
            date: this.props.editStudent.start_date || today,
            endDate: this.props.editStudent.end_date || yearFromToday,
            teachers: this.props.teachers,
            editStudent: this.props.editStudent
        }
        this.addTeachers = this.addTeachers.bind(this);
        this.isCoteacher = this.isCoteacher.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.unconfirmed = this.unconfirmed.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleUnselect = this.handleUnselect.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.scheduleTeacher = this.scheduleTeacher.bind(this);
        this.backFromTeacherForm = this.backFromTeacherForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.unScheduleTeacher = this.unScheduleTeacher.bind(this);
    }

    async componentDidMount() {
        document.getElementById(this.state.editStudent.disability.slice(0,3)).selected = true;
        const res = await fetch(`${ROUTE}/students/${this.state.editStudent.student_id}/assign`);
        const scheduledTeachers = await res.json();
        if (!res.ok) {
            alert(`There was a problem loading this page.  Please try again.`);
            this.props.back();
            return;
        } else {
            this.setState({
                scheduledTeachers: scheduledTeachers
            })
        }
    }

    toggleBlur() {
        if (this.state.blur) {
            document.getElementById("iep-body").className = "iep-body";
            document.getElementById("iep-footer").className = "iep-footer";
            document.getElementById("iep-header").className = "iep-header";
        } else {
            document.getElementById("iep-body").className = "blur-body";
            document.getElementById("iep-footer").className = "blur-body";
            document.getElementById("iep-header").className = "blur-body";
        }
        const toggled = !this.state.blur;
        this.setState({
            blur: toggled
        })
    }

    addTeachers(e) {
        e.preventDefault();
        if (this.state.blur) return;
        const teacherList = [<option value="none" selected disabled hidden>Select</option>]
        this.state.teachers.forEach(teacher => {
            teacherList.push(<option value={teacher.login}>{teacher.name}</option>)
        });
        this.toggleBlur();
        this.setState({
            addTeachers: true,
            teacherList: teacherList
        })
    }

    isCoteacher() {
        const answer = document.getElementById("coteacher").checked;
        this.setState({
            coteacher: answer
        })
    }

    unScheduleTeacher(e) {
        if (this.state.confirmDelete) return;
        if (!this.state.selectedTeacher || this.state.addTeachers) return;
        const teachers = this.state.scheduledTeachers;
        const index = teachers.findIndex(teacher => teacher.teacher_login === this.state.selectedTeacher.login);
        teachers[index].end_date = new Date();
        alert('Teacher will be removed from current schedule after save.  Teacher can still enter missing data from previous dates.  To remove all data collection requirements, use the option "Delete from schedule');
        this.setState({
            scheduledTeachers: teachers
        });
    }

    deleteTeacher(e) {
        if (this.state.confirmDelete) return;
        this.toggleBlur()
        if (!this.state.selectedTeacher || this.state.addTeachers) return;
        this.setState({
            confirmDelete: true
        })
        e.stopPropagation();
    }

    confirmDelete() {
        this.toggleBlur();
        const scheduledTeachers = this.state.scheduledTeachers.slice(0);
        scheduledTeachers.splice(this.state.teacherIndex, 1);
        this.setState({
            scheduledTeachers: scheduledTeachers,
            selectedTeacher: false,
            teacherIndex: false,
            confirmDelete: false
        })
    }

    unconfirmed() {
        this.toggleBlur();
        this.setState({
            confirmDelete: false
        })
    }

    handleSelected(e) {
        if (this.state.blur) return;
        const clicked = parseInt(e.currentTarget.id);
        this.setState({
            selectedTeacher: this.state.teachers.slice(0)[clicked],
            teacherIndex: clicked
        });
        e.stopPropagation()
    }

    handleUnselect(e) {
        if (this.state.blur) return;
        if (this.state.selectedTeacher) {
            this.setState({
                selectedTeacher: false,
                teacherIndex: false
            })
        }
    }

    scheduleTeacher(e) {
        e.preventDefault();
        if (this.state.confirmDelete) return;
        const sel = document.getElementById('teacherList');
        if (sel.options[sel.selectedIndex].text === 'none') return;
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
        this.toggleBlur();
        this.setState({
            scheduledTeachers: scheduledTeachers,
            addTeachers: false,
            coteacher: false
        })
    }

    handleChange(date) {
        if (this.state.confirmDelete) return;
        this.setState({
          date: date,
          endDate: new Date(date.getTime() + 1000*60*60*24*364)
        })
    }

    backFromTeacherForm() {
        if (this.state.confirmDelete) return;
        this.toggleBlur();
        this.setState({
            addTeachers: false,
            coteacher: false
        })
    }

    async submitForm(e) {
        e.preventDefault();
        if (this.state.blur) return;
        if (!this.state.scheduledTeachers || this.state.scheduledTeachers.length === 0) {
            alert(`No teachers assigned to student's schedule. Please add teachers to schedule before submitting this form.`);
            return;
        }
        const student_id = parseInt(document.getElementById('student_id').value);
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const disability = document.getElementById('disability').value;
        if (first_name === 'none' || first_name === '') return;
        if (last_name === 'none' || last_name === '') return;
        if (disability === 'none' || disability === '') return;
        let scheduledTeachers = this.state.scheduledTeachers.slice(0);
        scheduledTeachers.forEach(teacher => {
            teacher.student_id = student_id
        })
        const postOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_id: student_id,
                first_name: first_name,
                last_name: last_name,
                disability: disability,
                scheduledTeachers: scheduledTeachers
            })
        }
        const dataPosted = POSTING ? await fetch(`${ROUTE}/students/${student_id}`, postOptions) : {ok: true};
        if (!dataPosted.ok) {
            alert(`There was a problem posting data.  Please try again.`);
            return;
        }
        this.toggleBlur();
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
                            {`${new Date(teacher.start_date).toDateString().slice(4)}-${new Date(teacher.end_date).toDateString().slice(4)}`}
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
                <input type="submit" value="Add teacher to schedule"></input>
                <button onClick={this.backFromTeacherForm}>Back</button>
            </form>
        )   
    }

    get nextStep() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>{`Student profile for ${this.state.studentName} updated.  
                Edit another student or return to menu options?`}</h3>
                <div style={this.rowForm} >
                    <button onClick={this.props.editAnother} >Edit another student</button>
                    <span class="spacer"></span>
                    <button onClick={this.props.back}>Back to menu options</button>
                </div>
            </div>
        )
    }

    get confirmation() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>Deleting this teacher from the schedule will remove requirements 
                    for them to complete data collection, including past dates.  If student's
                    schedule has changed, consider using the option "Remove from current schedule".  Do you wish to delete?</h3>
                    <button onClick={this.confirmDelete} >Delete</button>
                    <span class="spacer"></span>
                    <button onClick={this.unconfirmed}>Hmm, maybe not...</button>
            </div>
        )
    }


    render() {
        return (
            <div className="App" >
                <header class="iep-header" id="iep-header" >
                    <h1>Student Management</h1>
                    <h3>Edit a student</h3> 
                </header>
                <body class="add-body" id="add-body">
                    {this.state.addTeachers && this.teacherForm}
                    {this.state.formSent && this.nextStep}
                    {this.state.confirmDelete && this.confirmation}
                </body>
                <body class="iep-body" id="iep-body">
                    <body onClick={this.handleUnselect}>
                        <form class= "card" style={this.cardFormat} onSubmit={this.submitForm}>
                            <br/>
                            <label for="first_name" >First name</label>
                            <input id="first_name" defaultValue={this.state.editStudent.first_name} required></input>
                            <br/>
                            <label for="last_name" >Last name</label>
                            <input id="last_name" required defaultValue={this.state.editStudent.last_name}></input>
                            <br/>
                            <label for="student_id" >Student ID</label>
                            <input type="number" id="student_id" readonly value={this.state.editStudent.student_id}></input>
                            <br/>
                            <label for="disability">Disability</label>
                            <select name="disability" id="disability" required>
                                <option id="OHI" value="OHI">OHI</option>
                                <option id="SLD" value="SLD">SLD</option>
                                <option id="MMD" value="MMD">MMD</option>
                                <option id="EBD" value="EBD">EBD</option>
                                <option id="AUT" value="AUT">AUT</option>
                                <option id="MD" value="MD" >MD</option>
                                <option id="FMD" value="FMD">FMD</option>
                                <option id="TBI" value="TBI">TBI</option>
                                <option id="OTHER" value="OTHER">OTHER</option>
                            </select>
                            <p>Scheduled Teachers</p>
                            <div style={this.rowForm}>
                                <button onClick={this.addTeachers}>Schedule new teacher</button>
                                <span class="spacer"/>
                                {this.state.selectedTeacher && <button onClick={this.unScheduleTeacher} >Remove from current schedule</button>}
                                <span class="spacer"/>
                                {this.state.selectedTeacher && <button onClick={this.deleteTeacher} >Delete from schedule</button>}
                            </div>
                            <div id="goalBox" class="goalBox" style={this.height}>
                                {this.teachers}
                            </div>
                            <input type="submit" value="Save Changes" ></input>
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