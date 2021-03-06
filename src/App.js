import './App.css';
import React from 'react';
import {NavBar} from './NavBar';
import {Landing} from './Landing';
import {DataMain} from './DataMode/DataMain';
import {Choices} from './Choices';
import {BackDate} from './DataMode/BackDate';
import {IepMain} from './IepMode/IepMain';
import {StudentMain} from './StudentMode/StudentMain';
import {TeacherMain} from './TeacherMode/TeacherMain';
import {ReportMain} from './ReportMode/ReportMain';
import logo from './logo.svg';

const LOCAL = false;
export const POSTING = true;
export const ROUTE = LOCAL ? 'http://localhost:3001' : 'https://ece-data-wizard.herokuapp.com';


class Main extends React.Component {

  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      auth: false,
      page: <Landing onSubmit={this.authenticate} incorrect={false}/> 
    }
    this.handleCompleted = this.handleCompleted.bind(this);
    this.handleChooseData = this.handleChooseData.bind(this);
    this.handleChooseBackDate = this.handleChooseBackDate.bind(this);
    this.returnToChoices = this.returnToChoices.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleChooseIEP = this.handleChooseIEP.bind(this);
    this.handleChooseStudents = this.handleChooseStudents.bind(this);
    this.handleChooseTeachers = this.handleChooseTeachers.bind(this);
    this.handleChooseReport = this.handleChooseReport.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.toggleNavBar = this.toggleNavBar.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    this.setState({
      page: this.loading
    })
    const username = document.getElementById('name').value;
    if (username === 'none') return;
    const password = document.getElementById('password').value;
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          secret: password
      })
  }
    fetch(`${ROUTE}/teachers/${username}/authenticate`, options)
      .then(res => res.json())
      .then(data => {
        if (data[0].authenticated) {
          let nextPage = <Choices 
                          user={data[0].name}
                          login={data[0].login}
                          userType={data[0].user_type}
                          completed={this.state.completed}
                          onChooseData={this.handleChooseData}
                          onChooseBackDate={this.handleChooseBackDate}
                          onChooseIEP={this.handleChooseIEP}
                          onChooseStudents={this.handleChooseStudents}
                          onChooseTeachers={this.handleChooseTeachers}
                          onChooseReport={this.handleChooseReport}
                        />
          this.setState({
            page: nextPage,
            user: data[0].name,
            userType: data[0].user_type,
            login: data[0].login,
            auth: true
          })
        } else {
          this.setState({
            page: <Landing onSubmit={this.authenticate} incorrect={true}/>
          })
        }
      },
      (error) => {
        this.setState({
          error
        });
      })
  }

  get loading() {
    return (
      <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
        </div>
    )
  }

  handleChooseData() {
    this.setState({
      page: <DataMain 
              user={this.state.user}
              login={this.state.login}
              userType={this.state.userType}
              onCompleted={this.handleCompleted}
              toChoices={this.returnToChoices}
            />
    })
  }

  handleChooseIEP(){
    this.setState({
      page: <IepMain 
              login={this.state.login}
              toChoices={this.returnToChoices}
            />
    })
  }

  returnToChoices() {
    this.setState({
      page: <Choices 
              user={this.state.user}
              login={this.state.login}
              userType={this.state.userType}
              completed={this.state.completed}
              onChooseData={this.handleChooseData}
              onChooseBackDate={this.handleChooseBackDate}
              onChooseIEP={this.handleChooseIEP}
              onChooseStudents={this.handleChooseStudents}
              onChooseTeachers={this.handleChooseTeachers}
              onChooseReport={this.handleChooseReport}
            />
    })
  }

  handleChooseStudents() {
    this.setState({
      page: <StudentMain 
          back={this.returnToChoices}
          userType={this.state.userType}
          login={this.state.login}
      />
    })
  }

  handleChooseBackDate() {
    this.setState({
      page: <BackDate toChoices={this.returnToChoices} 
                      login={this.state.login} 
                      back={this.handleReturn}
            />
    })
  }

  handleChooseTeachers() {
    this.setState({
        page: <TeacherMain 
          back={this.returnToChoices}
          userType={this.state.userType}
          login={this.state.login}
        />
    })
  }

  handleChooseReport() {
    this.setState({
      page: <ReportMain
              back={this.returnToChoices}
              user={this.state.user}
              login={this.state.login}
              userType={this.state.userType}
              toggleNav={this.toggleNavBar}
            />
    })
  }

  handleCompleted() {
    const nextPage = <Choices 
                        user={this.state.user} 
                        login={this.state.login} 
                        userType={this.state.userType} 
                        completed={true}
                        onChooseData={this.handleChooseData}
                        onChooseBackDate={this.handleChooseBackDate}
                        onChooseIEP={this.handleChooseIEP}
                        onChooseStudents={this.handleChooseStudents}
                        onChooseTeachers={this.handleChooseTeachers}
                        onChooseReport={this.handleChooseReport}
                      />;
    this.setState({
      page: nextPage,
      completed: true
    });
  }

  handleReturn() {
    const nextPage = <Choices 
                        user={this.state.user} 
                        login={this.state.login} 
                        userType={this.state.userType}
                        onChooseData={this.handleChooseData}
                        onChooseBackDate={this.handleChooseBackDate}
                        onChooseIEP={this.handleChooseIEP}
                        onChooseStudents={this.handleChooseStudents}
                        onChooseTeachers={this.handleChooseTeachers}
                        onChooseReport={this.handleChooseReport}
                      />;
    this.setState({
      page: nextPage,
    });
  }

  handleLogOut() {
    this.setState({
      user: false,
      userType: false,
      login: false,
      auth: false,
      page: <Landing onSubmit={this.authenticate} incorrect={false}/>
    })
  }

  toggleNavBar() {
    if (this.state.hiddenNav) {
      this.setState({
        hiddenNav: false
      })
    } else {
      this.setState({
        hiddenNav: true
      })
    }
  }


  render() {
    if (this.state.error) {
      return <div className="App"><p>{this.state.error}</p></div>;
    }
    return (
      <div className="App">
        {(this.state.auth && !this.state.hiddenNav) && <NavBar userType={this.state.userType}
                              user={this.state.user}
                              data={this.handleChooseData}
                              backDate={this.handleChooseBackDate}
                              iep={this.handleChooseIEP}
                              students={this.handleChooseStudents}
                              teachers={this.handleChooseTeachers}
                              reports={this.handleChooseReport}
                              logout={this.handleLogOut}    
        />}
        {this.state.auth && <div style={{height: "30px"}}></div>}
        {this.state.page}
      </div>
    ) 
  }
}



function App() {
  return (
    <div>
      <Main />
    </div> 
  )
}

export default App;
