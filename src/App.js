import './App.css';
import React from 'react';
import {Landing} from './Landing';
import {DataMain} from './DataMode/DataMain';
import {Choices} from './Choices';
import {BackDate} from './DataMode/BackDate';
import {IepMain} from './IepMode/IepMain';
import {StudentMain} from './StudentMode/StudentMain';
import {TeacherMain} from './TeacherMode/TeacherMain';

const mode = 'PRODUCTION';
export const POSTING = true;
export const ROUTE = mode === 'LOCAL' ? 'http://localhost:3001' : 'http://192.168.1.43:3001';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      auth: false,
      page: <Landing onSubmit={this.authenticate}/> 
    }
    this.handleCompleted = this.handleCompleted.bind(this);
    this.handleChooseData = this.handleChooseData.bind(this);
    this.handleChooseBackDate = this.handleChooseBackDate.bind(this);
    this.returnToChoices = this.returnToChoices.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleChooseIEP = this.handleChooseIEP.bind(this);
    this.handleChooseStudents = this.handleChooseStudents.bind(this);
    this.handleChooseTeachers = this.handleChooseTeachers.bind(this);
  }

  authenticate(e) {
    e.preventDefault();
    const username = document.getElementById('name').value;
    if (username === 'none') return;
    const password = document.getElementById('password').value;
    fetch(`${ROUTE}/teachers/${username}`)
      .then(res => res.json())
      .then(data => {
        if (password === data[0].secret) {
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
                        />
          this.setState({
            page: nextPage,
            user: data[0].name,
            userType: data[0].user_type,
            login: data[0].login,
            auth: true
          })
        }
      },
      (error) => {
        this.setState({
          error
        });
      })
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

  handleCompleted() {
    const nextPage = <Choices 
                        user={this.state.user} 
                        login={this.state.login} 
                        userType={this.state.userType} 
                        completed={true}
                        onChooseData={this.handleChooseData}
                        onChooseBackDate={this.handleChooseBackDate}
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
                      />;
    this.setState({
      page: nextPage,
    });
  }

  render() {
    if (this.state.error) {
      return <div><p>{this.state.error}</p></div>;
    }
    return this.state.page 
  }
}



function App() {
  return <Main />
}

export default App;
