import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {TeacherForm} from './TeacherForm';
import {TeacherSearch} from './TeacherSearch';
import fetch from 'node-fetch';

export class TeacherMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            key: 0,
        }
        this.addTeacher = this.addTeacher.bind(this);
        this.editTeacher = this.editTeacher.bind(this);
        this.back = this.back.bind(this);
        this.addAnother = this.addAnother.bind(this);
        this.updateTeacherList = this.updateTeacherList.bind(this);
        this.toggleBlur = this.toggleBlur.bind(this);
    }

    async componentDidMount() {
        const teacherRes = await fetch(`${ROUTE}/teachers`);
        const teachers = await teacherRes.json();
        this.setState({
            teachers: teachers,
            isLoaded: true
        })
    }

    async updateTeacherList() {
        this.setState({
            isLoaded: false
        });
        const teacherRes = await fetch(`${ROUTE}/teachers`);
        const teacherData = await teacherRes.json();
        if (!teacherRes.ok) {
            alert(`There was a problem loading data.  Reloading student management app`);
            this.props.back();
        }
        this.setState({
            teachers: teacherData,
            isLoaded: true
        })
    }

    addTeacher() {
        const key = (this.state.key + 1) % 2;
        this.setState({
            add: true,
            key: key
        })
    }

    editTeacher() {
        const key = (this.state.key + 1) % 2;
        this.setState({
            edit: true,
            key: key
        })
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

    back() {
        this.toggleBlur();
        this.setState({
            add: false,
            edit: false
        })
        window.scroll(0,0);
        this.componentDidMount();
    }

    addAnother() {
        this.updateTeacherList();
        this.toggleBlur();
        const key = (this.state.key + 1) % 2;
        this.componentDidMount();
        this.setState({
            key: key
        })
        window.scroll(0,0);
    }


    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
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
        } else if (this.state.add) {
            return (
                        <TeacherForm 
                            teachers={this.state.teachers}
                            key={this.state.key}
                            back={this.back}
                            toggleBlur={this.toggleBlur}
                            addAnother={this.addAnother}
                        />
            )
        } else if (this.state.edit) {
            return (
                <TeacherSearch 
                            students={this.state.students}
                            teachers={this.state.teachers}
                            back={this.back}
                            updateTeacherList={this.updateTeacherList}
                        />
            )
        } else if (this.state.teachers) {
            return (
                <div className="App">
                    <header class="iep-header" >
                        <h1>Teacher Management</h1>
                        <p>A place for admin to add, edit or delete teachers</p> 
                    </header>
                    <body class="iep-body">
                        <br/>
                        <div class="card" style={this.cardFormat} >
                            <p>What do you wish to do?</p>
                            <div class="choice-row" style={{margin: "0"}} >
                                <button onClick={this.addTeacher}>Add Teacher</button>
                                <button onClick={this.editTeacher}>Edit Teacher</button>
                                {this.state.isAdmin && <button>Delete Teacher</button>}
                            </div>
                            <br/>
                        </div>
                    <br/><br/>
                    </body>
                    <header class="iep-footer" >
                        <button onClick={this.props.back}>Back</button>
                    </header>
                </div>
                
            )
        }
    }
}
