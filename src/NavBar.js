import './App.css';
import React from 'react';

export class NavBar extends React.Component {

    constructor(props) {
        super(props)
        this.navigate = this.navigate.bind(this);
    }

    navigate() {
        const destination = document.getElementById('nav').value;
        if (destination === "DataForm") this.props.data();
        if (destination === "BackDate") this.props.backDate();
        if (destination === "IEP") this.props.iep();
        if (destination === "Student") this.props.students();
        if (destination === "Progress") this.props.reports();
        if (destination === "Teachers") this.props.teachers();
    }

    render() {
        const options = [<option hidden disabled selected>Jump To</option>, 
                         <option value="DataForm">Today's Data</option>,
                         <option value="BackDate">Missing Data</option>];
        if (this.props.userType === "TOR" || this.props.userType === "ADMIN") {
            options.push(<option value="IEP">IEP Management</option>);
            options.push(<option value="Student">Student Management</option>);
            options.push(<option value="Progress">Progress Monitoring</option>);
        }
        if (this.props.userType === "ADMIN") options.push(<option value="Teachers">Teacher Management</option>)
        return (
            <div style={{height: "30px", backgroundColor: "black", color: "white", position: "fixed", top: "0", left: "0", zIndex: 1000, width: "100%",
                display: "flex", flexDirection: "row", paddingLeft: "10px", paddingTop: "4px"}}>
                {window.innerWidth > 700 && <div>{this.props.user}</div>}
                <span class="spacer"></span>
                <button onClick={this.props.logout} style={{height: "25px", backgroundColor: "black", color: "white"}}>LOG OUT</button>
                <div style={{position: "fixed", top: "-4px", right: "10px"}}>
                    <label for="nav" style={{color: "white", verticalAlign: "33%", paddingRight: "10px"}}>Jump to:</label>
                    <select onChange={this.navigate} id="nav" name="nav" style={{height: "25px", backgroundColor: "black", color: "white", 
                                    width: '180px', borderColor: "#6b605e"}}>
                        {options}
                    </select>
                </div >
            </div>
        )
    }
}