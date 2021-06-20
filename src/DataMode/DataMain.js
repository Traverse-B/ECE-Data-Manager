import fetch from 'node-fetch';
import React from 'react'; 
import '../App.css';

export class DataMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            userType: props.userType,
            caseload: [],
            page: 0
        }
        this.start = this.start.bind(this);
    }

    render() {
        if (this.state.page === 0) {
            return (
                <div className="App">
                    <header className="App-header">
                        <h1>Seneca ECE-Wizard</h1>
                        <button id="start"  >Let's Go!</button>
                    </header>
                </div>
            )
        }
    }
}

