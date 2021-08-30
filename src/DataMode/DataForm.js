import logo from '../logo.svg';
import React from 'react'; 
import '../App.css';
import {ROUTE} from '../App.js';


export class DataForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            page: this.props.iepID
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.wasPresent = this.wasPresent.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReview = this.onReview.bind(this);
        this.back = this.back.bind(this);
    }

    async componentDidMount() {
        
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    date: this.props.backdated || new Date(),
                    teacher: this.props.login
                })
            }
            const goalRes = await fetch(`${ROUTE}/students/${this.props.student.student_id || this.props.student.id}/backdateiep`, options);
            const goalData = await goalRes.json();
            this.setState({
                studentName: this.props.student.name || this.props.student.first_name + ' ' + this.props.student.last_name,
                goalData: goalData,
                isLoaded: true,
                backdated: this.props.backdated
            }) 
        
    }

    async wasPresent(e) {
        e.preventDefault();
        const present = document.getElementById('present').value;
        if (present === 'none') return;
        if (present !== 'present') {
            this.setState({
                review: true,
                present: present
            })
        } else {
            this.setState({
                present: present
            })
        }
    }

    onReview(e) {
        e.preventDefault();
        const responses = []
        this.state.goalData.forEach(goal => {
            const dataType = goal.response_type === "boolean" ? "Bool" : "Percent";
            const goalResponse = document.getElementById(`${goal.id}`).value;
            if ((goalResponse === 'none' || goalResponse ==='') && dataType === "Bool") {
                responses.push(false);
            } else if (dataType === "Percent" && (goalResponse === 'none' || goalResponse === '')) {
                //do nothing
            } else {
                const responder = this.props.login;
                const timestamp = this.state.backdated || new Date().toISOString();
                return {
                    timestamp: timestamp,
                    iep_goal_id: goal.id,
                    type: dataType,
                    response: goalResponse,
                    responder: responder
                }
            }
        });
        if (responses.includes(false)) return;    
        this.setState({
            review: true,
            responses: responses
        })
    }

    review(goalData) {
        const reviewPage = [
            (
                <div>
    <               div class="card" style={this.cardFormat}>
                        <div>
                            <p>{`${this.state.studentName} was ${this.state.present} today`}</p>
                            <br/>
                        </div>
                        <br></br>
                    </div>
                    <br/>   
                </div>
                   
            )
        ];
        if (this.state.present === 'present'){
            goalData.forEach(goal => {
                if (goal.response_type === "boolean") {
                    reviewPage.push(
                        (
                            <div>
                                <div style={{paddingBottom: "10px"}}>
                                    <div class="card" style={this.cardFormat}>
                                        <div >
                                            <p>{goal.data_question}</p>
                                            <h3>{document.getElementById(goal.id).value == 100 ? 'Yes' : 'No'}</h3>
                                        </div>
                                        <br></br>
                                    </div>
                                </div>
                                <br/>
                            </div>
                            
                        )
                    ); 
                } else {
                    let report = document.getElementById(goal.id);
                    report = report ? report.value : '';
                    if (report === '') {
                        report = 'No data provided.  Remember, academic data must be provided every two weeks.'
                    } else {
                        report += '%';
                    }
                    reviewPage.push(
                        (
                            <div>
                                <div class="card" style={this.cardFormat}>
                                    <div >
                                        <p>{goal.data_question}</p>
                                        <h3>{report}</h3>
                                    </div>
                                    <br></br>
                                </div>
                            </div>
                            
                        )    
                    );
                }
            })
        }
        
        return reviewPage;
    }

    back() {
        this.setState({
            review: false,
            present: false,
            responses: false
        })
    }

    async onSubmit(e) {
        e.preventDefault();
        const timestamp = this.state.backdated || new Date().toISOString();
        // Post attendance
        const responseOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                timestamp: timestamp,
                reporter: this.props.login,
                student_id: this.props.student.student_id || this.props.student.id,
                data: this.state.present,
                coteacher: this.props.student.coteacher_login,
                values: this.state.responses

            })
        }
        const posting = true; // <--- Disable post for testing here!
        const posted = posting? await fetch(`${ROUTE}/response`, responseOptions) : {ok: true};
        if (!posted.ok) {
            alert('There was a problem posting data.  Please try submitting again!')
            return;
        }
        // If last student to report on, switch to completed screen
        if (this.props.caseload.length === 1) {
            this.props.onCompleted()
        } else {
            this.setState ({
                submitted: true
            });

            this.props.onStudentComplete();
        }
    }

    get loadingImage() {
        return (
            <div>
                <img src={logo} className="App-logo" alt="logo" />
                <p>Loading...</p>
            </div>
        )
    }

    get cardFormat() {
        return {boxShadow: "2px 2px 10px #9E9E9E", minWidth: "375px"};
    }

    get scholarWasPresent() {
        const today = this.state.backdated? `on ${this.state.backdated.toString().slice(0,15)}` : 'today'
        return (
            <div class="card" style={this.cardFormat}>
                <h2>{this.state.studentName}</h2>
                <p>{`Did ${this.state.studentName} attend your class ${today}?`}</p>
                <form onSubmit={this.wasPresent}>
                    <select id="present" class="present">
                        <option value="none" selected disabled hidden>Select</option>
                        <option value="present" >Scholar was present</option>
                        <option value="excused" >Absent (excused)</option>
                        <option value="absent" >Absent (unexcused)</option>
                    </select>
                    <input type='submit' value="Continue"/>
                    <button onClick={this.props.back}>Back</button>
                </form>
            </div>
        )
    }

    get form() {
        const questions = this.state.goalData.map(goal => {
            if (goal.response_type === 'boolean') {
                return (
                    <div class="card" style={this.cardFormat}>
                        <br/>
                        <label for={goal.id}>{goal.data_question}</label>
                        <select  id={goal.id}>
                            <option value="none" selected disabled hidden >Select</option>
                            <option value="100">Yes</option>
                            <option value="0">No</option> 
                        </select>
                        <br/>
                    </div>   
                    
                )
            } else {
                return (
                    <div class="card" style={this.cardFormat}>
                        <br/>
                        <label for={goal.id}>{goal.data_question}</label>
                        <br/>
                        <input class="numberinput" type="number" min="0" max="100" step="1" id={goal.id}></input>
                        <p style={{fontSize: "14px", color: "red"}}>*Remember, academic data must be provided at least once every two weeks!</p>
                    </div>   
                )
            }   
        })
        return (
            <div>
                <h2>{this.state.studentName}</h2>
                <form class='dataform' id="dataForm" onSubmit={this.onReview}>
                    {questions}
                    <br/>
                    <input type='submit' value='Continue'></input>
                </form>
            </div>   
        )
    }

    render() {
        window.scrollTo(0, 0)
        if (this.state.submitted) {
            return (
                <div className="App">
                    <header className="App-header">
                        <h3>{`Thanks for the info!  ${this.props.caseload.length} more to go!`}</h3>
                        <button  onClick={this.props.onClick}>Next</button>
                    </header>
                </div>
            )
        } else if (this.state.review) {
            return (
                <div className="App">
                    <header className="App-header">
                        <p>Please review answers before submition.</p>
                        {this.review(this.state.goalData)}
                        <button class="reviewbutton" onClick={this.onSubmit} >Submit</button>
                        <button onClick={this.back} class="reviewbutton ">Go back</button>
                    </header>
                </div>
            )  
        }
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.page === 0 && <h2>ECE Wizard</h2>}
                    {(this.state.isLoaded && !this.state.present) && this.scholarWasPresent}
                    {(this.state.isLoaded && this.state.present) && <p>Daily ECE data collection for:</p>}
                    {!this.state.isLoaded && this.loadingImage}
                    {(this.state.isLoaded && this.state.present) && this.form}
                </header>
            </div>
        )
    }
}