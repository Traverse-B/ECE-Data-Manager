import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {POSTING} from '../App.js';

export class TeacherForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: this.props.teachers
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleChange(date) {
        this.setState({
          date: date,
          endDate: new Date(date.getTime() + 1000*60*60*24*364)
        })
    }

    async submitForm(e) {
        e.preventDefault();
        const login = document.getElementById('login').value.trim();
        if (login === '') return;
        // Check to ensure ID doesn't exist in database
        const loginUsed = this.state.teachers.findIndex(teacher => teacher.login === login) !== -1;
        if (loginUsed) {
            alert(`Teacher has already been created with this login.  Please use another login or edit the teacher profile created for this login`);
            return;
        }
        const password = document.getElementById('password').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const userType = document.getElementById('usertype').value;
        if (password === '') return;
        if (name === '') return;
        if (email === '') return;
        if (userType === '' || userType === 'none') return;
        const postOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                login: login,
                secret: password,
                email: email,
                name: name,
                user_type: userType, 
                active: true
            })
        }
        const dataPosted = POSTING ? await fetch(`${ROUTE}/teachers`, postOptions) : {ok: true};
        if (!dataPosted.ok) {
            alert(`There was a problem posting data.  Please try again.`);
            return;
        }
        this.props.toggleBlur();
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

    get nextStep() {
        return (
            <div class="goalForm" style={this.cardFormat} >
                <h3>{`${this.state.teacherName} added to the system.  
                Add another teacher or return to menu options?`}</h3>
                <div style={this.rowForm} >
                    <button onClick={this.props.addAnother} >Add another teacher</button>
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
                    <h1>Teacher Management</h1>
                    <h3>Add a teacher</h3> 
                </header>
                <body class="add-body" id="add-body">
                    {this.state.formSent && this.nextStep}
                </body>
                <body class="iep-body" id="iep-body">
                        <form class= "card" style={this.cardFormat} onSubmit={this.submitForm}>
                            <br/>
                            <label for="name" >Name</label>
                            <input id="name" required></input>
                            <br/>
                            <label for="email" >Email</label>
                            <input id="email" required></input>
                            <br/>
                            <label for="login" required>Login</label>
                            <input id="login" maxLength="8"></input>
                            <br/>
                            <label for="password" >Password</label>
                            <input id="password" required></input>
                            <br/>
                            <label for="usertype">User Type</label>
                            <select name="usertype" id="usertype" required>
                                <option value="none" hidden disabled selected>Select</option>
                                <option value="DATA">DATA - Can provide ECE data</option>
                                <option value="TOR">TOR - Can manage IEPs and provide ECE data</option>
                                <option value="ADMIN">ADMIN - Can manage system resources</option>
                            </select>
                            <br/>
                            <input type="submit" value="Add teacher to system"></input>
                        </form>
                </body>
                <header class="iep-footer" id="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>
        )
    }
}