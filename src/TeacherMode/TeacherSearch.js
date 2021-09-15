import React from 'react'; 
import '../App.css';
import {TeacherEdit} from './TeacherEdit';

export class TeacherSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editAnother = this.editAnother.bind(this);
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

    

    editAnother() {
        window.scroll(0,0);
        
        this.setState({
            confirmed: false
        })
    }

    async handleSubmit() {
        const login = document.getElementById("teacher").value;
        if (login === 'none') return;
        const confirmed = this.props.teachers.filter(teacher => teacher.login === login)[0]
        this.setState({
            confirmed: confirmed
        })
    }

    get teacherList () {
        const teachers = [<option selected hidden disabled value="none" >Select</option>]
        this.props.teachers.forEach(teacher => {
            teachers.push(<option value={teacher.login}>{teacher.name}</option>)
        });
        return teachers;
    }

    

    render() {
        if (this.state.confirmed) {
            return (
                        <TeacherEdit
                            editTeacher={this.state.confirmed}
                            assignedStudents={this.assignedStudents}
                            students={this.props.students}
                            back={this.props.back}
                            editAnother={this.editAnother}
                        />
            )
        }
        return (
            <div className="App" >
                <header class="iep-header" id="iep-header" >
                    <h1>Teacher Management</h1>
                    <h3>Edit teacher profiles</h3> 
                </header>
                <body class="iep-body" id="iep-body">
                    <form class="card" style={this.cardFormat} onSubmit={this.handleSubmit}>
                        <label for="input">Which Teacher?</label>
                        <select id="teacher" required>
                            {this.teacherList}
                        </select>
                        <br/>
                        <div style={this.rowForm}>
                            <button htmlType="submit">Edit Teacher</button>
                        </div>
                    </form>
                    <br/>
                </body>
               <header class="iep-footer" id="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>      
        )
    }
}