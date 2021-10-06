import React from 'react'; 
import './App.css';


export class Choices extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            login: this.props.login,
            isTOR: this.props.userType === 'ADMIN' || this.props.userType === 'TOR',
            isAdmin: this.props.userType === 'ADMIN'
        }
    }

    choice(title, text, handler) {
        return (
            <button onClick={handler} class="choice" style={{ boxShadow: "2px 2px 10px black"}} >
                <h3>{title}</h3>
                <p>{text}</p>
            </button>
        )
    }

    get choices() {
        const choiceArray = []
        if (!this.props.completed) { choiceArray.push(this.choice(
            `Complete Today's Data`, 
            (<div>{`Gotta keep that data rolling in!`} 
                    <br/> {`(Also, it's the law).`}</div>), this.props.onChooseData)
            )
        }
        choiceArray.push(this.choice(
            'Complete Missing Data', 
            (<div>{'Miss a day?  No sweat!'} <br/> {`Follow this link to fill in the gaps.`}</div>),
            this.props.onChooseBackDate)
        )
        if (this.state.isTOR) {
            choiceArray.push(
                this.choice(
                    `Manage Data Collection`, 
                    (<div>{`Set up or update`}<br/> {`data collection for students.`}</div>),
                    this.props.onChooseIEP
                )
            );
            choiceArray.push(
                this.choice('Manage Students', 'Create and edit student roster.', this.props.onChooseStudents)
            );
            choiceArray.push(
                this.choice(
                    `Progress Monitoring`,
                    (<div>{'Get an update on progress'}<br/> {`or print a progress report.`}</div>),
                    this.props.onChooseReport
                )
            )
        }
        if (this.state.isAdmin) {
            choiceArray.push(
                this.choice('Manage Teachers', 'Create and edit a teacher roster.', this.props.onChooseTeachers)
            );    
        }
        const finalArray = [];
        while (choiceArray.length > 0) {
            const rowItems = choiceArray.splice(0, 3);
            finalArray.push(
                <div class="choice-row">
                    {rowItems}
                </div>
            )
        } 
        return finalArray;
    }

    render() {
        window.scrollTo(0, 0)
        const lastWord = this.props.completed ? ' next' : '';
        return (
            <div className="App">
                <header className="choice-header">
                    {this.props.completed ? <h2>Complete!  Thanks!</h2> : <h2>Seneca ECE Wizard</h2>}
                    <h3>{`What would you like to do${lastWord}?`}</h3>
                    
                </header>
                <div class="choice-body" >
                    {this.choices}
                </div>
                <header class="choice-footer"/>
            </div>
        )
    }

}