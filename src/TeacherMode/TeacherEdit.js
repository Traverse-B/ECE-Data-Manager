import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import DatePicker from "react-datepicker";
import {POSTING} from '../App.js';

export class TeacherEdit extends React.Component {

    constructor(props) {
        super(props);
        const date = new Date()
        const endDate = new Date(date.getTime() + 1000*60*60*24*364);
        this.state = {
            date: date,
            endDate: endDate,
            teachers: this.props.teachers,
            editTeacher: this.props.editTeacher
        }
        this.addStudents = this.addStudents.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.unconfirmed = this.unconfirmed.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleUnselect = this.handleUnselect.bind(this);
        this.deleteStudents = this.deleteStudents.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.assignStudent = this.assignStudent.bind(this);
        this.backFromStudentForm = this.backFromStudentForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    async componentDidMount() {
        const res = await fetch(`${ROUTE}/teachers/${this.state.editTeacher.login}/caseload`);
        const assignedStudents = await res.json();
        const allRes = await fetch(`${ROUTE}/students/available`);
        const availableStudents = await allRes.json();
        if (!res.ok || !allRes.ok) {
            alert(`There was a problem loading this page.  Please try again.`);
            this.props.back();
            return;
        } else {
            this.setState({
                assignedStudents: assignedStudents,
                availableStudents: availableStudents,
                isLoaded: true
            })
        }
        document.getElementById(this.state.editTeacher.user_type).selected = true;
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

    addStudents(e) {
        e.preventDefault();
        if (this.state.blur) return;
        const studentList = [<option value="none" selected disabled hidden>Select</option>]
        this.state.assignedStudents.forEach(student => {
            studentList.push(<option value={student.id}>{`${student.first_name} ${student.last_name}`}</option>)
        });
        this.toggleBlur();
        this.setState({
            addStudents: true,
            studentList: studentList
        })
        e.stopPropagation();
    }

    deleteStudents(e) {
        if (this.state.confirmDelete) return;
        this.toggleBlur()
        if (!this.state.selectedStudent || this.state.addStudents) return;
        this.setState({
            confirmDelete: true
        })
        e.stopPropagation()
    }

    confirmDelete() {
        this.toggleBlur();
        const assignedStudents = this.state.assignedStudents.slice(0);
        assignedStudents.splice(this.state.studentIndex, 1);
        this.setState({
            assignedStudents: assignedStudents,
            selectedStudent: false,
            studentIndex: false,
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
        const selectedStudent = this.state.assignedStudents.slice(0)[clicked];
        this.setState({
            selectedStudent: selectedStudent,
            studentIndex: clicked,
        });
        e.stopPropagation()
    }

    handleUnselect() {
        if (this.state.blur) return;
        if (this.state.selectedStudent) {
            this.setState({
                selectedStudent: false,
                studentIndex: false
            })
        }
    }

    assignStudent(e) {
        e.preventDefault();
        if (this.state.confirmDelete) return;
        const assignedId = parseInt(document.getElementById("availStudents").value)
        const assignedStudent = this.state.availableStudents.filter(student => student.id === assignedId)[0];
        if (!assignedStudent) return;
        const assignedStudents = this.state.assignedStudents? this.state.assignedStudents.slice(0) : []
        assignedStudents.push({
            first_name: assignedStudent.first_name,
            last_name: assignedStudent.last_name,
            student_id: assignedId,
            teacher_login: this.state.editTeacher.teacher_login,
            start_date: this.state.date,
            end_date: this.state.endDate
        });
        this.toggleBlur();
        this.setState({
            assignedStudents: assignedStudents,
            addStudents: false,
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

    backFromStudentForm() {
        if (this.state.confirmDelete) return;
        this.toggleBlur();
        this.setState({
            addStudents: false,
            coteacher: false
        })
    }

    async submitForm(e) {
        e.preventDefault();
        if (this.state.blur) return;
        const login = document.getElementById('login').value.trim();
        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value.trim();
        const email = document.getElementById('email').value.trim();
        const user_type = document.getElementById('user_type').value;
        if (password === '') return;
        if (name === '') return;
        if (email === '') return;
        if (user_type === '' || user_type === 'none') return;
        let assignedStudents = this.state.assignedStudents.slice(0);
        assignedStudents.forEach(teacher => {
            teacher.teacher_login = login.slice(0)
        })
        const postOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                login: login,
                name: name,
                secret: password,
                email: email,
                user_type: user_type,
                assignedStudents: assignedStudents
            })
        }
        const dataPosted = POSTING ? await fetch(`${ROUTE}/teachers/${login}`, postOptions) : {ok: true};
        if (!dataPosted.ok) {
            alert(`There was a problem posting data.  Please try again.`);
            return;
        }
        this.toggleBlur();
        this.setState({
            formSent: true,
            teacherName: name
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

    get studentList() {
        if (this.state.assignedStudents && this.state.assignedStudents.length > 0) {
            return this.state.assignedStudents.map((student, index) => {
                return (
                    <div className="goal" id={index} tabindex="-1" onClick={this.handleSelected}>
                        <p style={this.areaFormat}>{`${student.first_name} ${student.last_name}`}</p>
                        <p style={this.textFormat}>
                            {`${new Date(student.start_date).toDateString().slice(4)}-${new Date(student.end_date).toDateString().slice(4)}`}
                        </p>
                    </div>
                )
            })
        } else {
            return <div className="goal" id="none" >
                <p>No students assigned</p>
            </div>
        }
    }

    get availableStudents() {
        const list = [<option value="none" selected disabled hidden>Select</option>];
        this.state.availableStudents.forEach(student => {
            list.push(
                <option value={student.id} >{`${student.first_name} ${student.last_name}`}</option> 
            )
        })
        return list;
    }

    get studentForm() {
        return (
            <form key={this.state.id} class="goalForm" style={this.cardFormat} onSubmit={this.assignStudent}>
                <br/>
                <label for="availStudents">Student</label>
                <select id="availStudents" name="availStudents" required>
                    {this.availableStudents}
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
                <input type="submit" value="Add student to TOR caseload"></input>
                <button onClick={this.backFromStudentForm}>Back</button>
            </form>
        )   
    }

    get nextStep() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>{`Profile for ${this.state.editTeacher.name} updated.`}</h3>
                <div style={this.rowForm} >
                    <button onClick={this.props.back}>Back to menu options</button>
                </div>
            </div>
        )
    }

    get confirmation() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>{`Are you sure you wish to remove student from ${this.state.editTeacher.name}'s caseload?`}</h3>
                    <button onClick={this.confirmDelete} >Remove</button>
                    <span class="spacer"></span>
                    <button onClick={this.unconfirmed}>Hmm, maybe not...</button>
            </div>
        )
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
        } 
        return (
            <div className="App" >
                <header class="iep-header" id="iep-header" >
                    <h1>Teacher Management</h1>
                    <h3>Edit teacher profile and add/remove students from TOR caseload</h3> 
                </header>
                <body class="add-body" id="add-body">
                    {this.state.addStudents && this.studentForm}
                    {this.state.formSent && this.nextStep}
                    {this.state.confirmDelete && this.confirmation}
                </body>
                <body class="iep-body" id="iep-body">
                    <body onClick={this.handleUnselect}>
                        <form class= "card" style={this.cardFormat} onSubmit={this.submitForm}>
                            <br/>
                            <label for="name" >Name</label>
                            <input id="name" defaultValue={this.state.editTeacher.name} required></input>
                            <br/>
                            <label for="email" >Email</label>
                            <input type="email" id="email"  defaultValue={this.state.editTeacher.email}></input>
                            <br/>
                            <label for="login" >Login</label>
                            <input id="login" readonly required value={this.state.editTeacher.login}></input>
                            <br/>
                            <label for="password" >Password</label>
                            <input id="password" required defaultValue={this.state.editTeacher.secret}></input>
                            <br/> 
                            <label for="user_type">User Type</label>
                            <select name="user_type" id="user_type" required>
                            <option value="none" hidden disabled selected>Select</option>
                                <option id="DATA" value="DATA">DATA - Can provide ECE data</option>
                                <option id="TOR" value="TOR">TOR - Can manage IEPs and provide ECE data</option>
                                <option id = "ADMIN" value="ADMIN">ADMIN - Can manage system resources</option>
                            </select>
                            <p>ECE Student Caseload</p>
                            <div style={this.rowForm}>
                                <button onClick={this.addStudents}>Add</button>
                                <span class="spacer"/>
                                {this.state.selectedStudent && <button onClick={this.deleteStudents} >Delete</button>}
                            </div>
                            <div id="goalBox" class="goalBox" style={this.height}>
                                {this.studentList}
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