import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';
import {IepForm} from './IepForm'

export class IepMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: props.login
        }
        this.chooseSetup = this.chooseSetup.bind(this);
        this.returnToIepChoices = this.returnToIepChoices.bind(this);
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        await this.timeout(1000);
        const studentRes = await fetch(`${ROUTE}/students/`);
        const students = await studentRes.json();
        if (students) {
            this.setState({
                isLoaded: true
            })
        }
    }

    chooseSetup() {
        this.setState({
            page: 'setup'
        })
    }

    returnToIepChoices() {
        this.setState({
            page: 0
        })
    }

    get loadingImage() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Loading...</p>
                </header>
            </div>
        )
    }

    get shadow() {
        return { boxShadow: "2px 2px 10px #9E9E9E"};
    }

    get rowForm() {
        return {
            flexDirection: "row",
            display: "flex",
            padding: "15px"
        }
    }

    render() {
        window.scrollTo(0, 0)
        if (!this.state.isLoaded) {
            return this.loadingImage
        } else if (this.state.page === 0) {
            return (
                <body class="iep-body">
                    <div class="card" style={this.shadow}>
                        <p>Nice work! Data collection will begin on start date.</p>
                        <p>Set up data collection for another student?</p>
                        <div style={this.rowForm}>
                            <button onClick={this.chooseSetup}>Sure!</button>
                            <span class="longSpacer"></span>
                            <button onClick={this.props.toChoices}>No Thanks</button>
                        </div>
                    </div>
                </body>
            )
        } else {
            return (
                <IepForm login={this.state.login}
                         loadingImage={this.loadingImage} 
                         page={this.state.page}
                         back={this.props.toChoices}
                         onComplete={this.returnToIepChoices}/>
            )
        }
    }
} 