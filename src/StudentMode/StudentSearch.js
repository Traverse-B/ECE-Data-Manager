import React from 'react'; 
import '../App.css';
import {StudentEdit} from './StudentEdit';

export class StudentSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.handleUnselected = this.handleUnselected.bind(this);
        this.handleConfirmed = this.handleConfirmed.bind(this);
        this.studentOptions = this.studentOptions.bind(this);
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

    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById("input").value;
        const regex = new RegExp(`\\b${input}.*`, 'gi');
        const searchBy = document.getElementById("searchBy").value;
        let searchResults = [];
        if (searchBy === "lastName") {
            searchResults = this.props.students.filter(student => student.last_name.match(regex));
        } else if (searchBy === "firstName") {
            searchResults = this.props.students.filter(student => student.first_name.match(regex));
        } else {
            searchResults = this.props.students.filter(student => {
                alert(student.student_id)
                return student.student_id.toString().match(regex)
            }
            );
        }
        this.setState({
            searchResults: searchResults
        })
    }

    handleSelected(e) {
        const clicked = parseInt(e.currentTarget.id);
        this.setState({
            selected: clicked
        })
        e.stopPropagation();
    }

    handleUnselected() {
        if (this.state.selected) {
            this.setState({
                selected: false
            })
        }
    }

    editAnother() {
        window.scroll(0,0); 
        this.props.updateStudentList();
        this.setState({
            searchResults: false,
            confirmed: false
        })
    }

    async handleConfirmed() {
        if (this.state.selected) {
            const confirmed = this.props.students.filter(student => student.student_id === this.state.selected)[0];
            this.setState({
                confirmed: confirmed
            })
        }
    }

    studentOptions(students) {
        const options = students.map(student => {
            return (
                <div className="goal" id={student.student_id} tabindex="-1" onClick={this.handleSelected} onDoubleClick={this.handleConfirmed}>
                        <p style={this.areaFormat}>{`${student.first_name} ${student.last_name}`}</p>
                        <p style={this.areaFormat}>{student.id}</p>
                    </div>
            )
        })
        return (
            <div class="card" style={this.cardFormat}>
                <label for="students">Results</label>
                <div class="goalBox">
                    {options}
                </div>
                <div style={this.rowForm}>
                    <button onClick={this.handleConfirmed}>Edit</button>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.confirmed) {
            return (
                        <StudentEdit
                            editStudent={this.state.confirmed}
                            scheduledTeachers={this.scheduledTeachers}
                            teachers={this.props.teachers}
                            back={this.props.back}
                            editAnother={this.editAnother}
                        />
            )
        }
        return (
            <div className="App" >
                <header class="iep-header" id="iep-header" >
                    <h1>Student Management</h1>
                    <h3>Edit a student</h3> 
                </header>
                <body class="iep-body" id="iep-body">
                    <form class="card" style={this.cardFormat} onSubmit={this.handleSubmit}>
                        <label for="input">Find a student</label>
                        <input id="input" name="input" style={{minHeight: "30px"}}></input>
                        <br/>
                        <label for="searchBy">Search by</label>
                        <select id="searchBy" name="searchBy">
                            <option id="lastName" selected value="lastName">Last name</option>
                            <option id="firstName" value="firstName">First name</option>
                            <option id="studentId" value="studentId">Student ID</option>
                        </select>
                        <div style={this.rowForm}>
                            <button htmlType="submit">Search</button>
                        </div>
                    </form>
                    <br/>
                    {this.state.searchResults && this.studentOptions(this.state.searchResults)}
                </body>
               <header class="iep-footer" id="iep-footer">
                    <button onClick={this.props.back}>Back</button>
                </header>
            </div>      
        )
    }
}