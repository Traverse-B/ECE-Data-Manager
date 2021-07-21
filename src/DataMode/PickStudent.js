import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';

export class PickStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            caseload: props.caseload,
            index: 0
        };
    }

    students (caseload) {
        const scholars = caseload.map((student, index) => {
            return (
                <div>
                    <button id={student.id}
                            class="choice"
                            onClick={this.props.onClick}>
                        <h3>{`${student.first_name} ${student.last_name}`}</h3>
                    </button>
                </div>    
            )
        })
        const finalArray = []
        while (scholars.length > 0) {
            const rowItems = scholars.splice(0, 3);
            finalArray.push(
                <div class="choice-row">
                    {rowItems}
                </div>
            )
        }
        return finalArray;
    }

    render() {
        return (
            <div className="App">
                <header className="choice-header">
                    <h2>Select a student</h2>
                </header>
                <div class="choice-body" > 
                    {this.students(this.state.caseload)}
                </div>
                <header className="choice-footer">
                    <button onClick={this.props.toChoices}>Go Back</button>
                </header>
            </div>
        )
    }
}