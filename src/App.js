import logo from './logo.svg';
import './App.css';
import React from 'react';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'landing',
      user: '',
      userType: '',
      auth: false
    }
    this.authenticate = this.authenticate.bind(this);
  }

  async authenticate() {
    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const path = `http://localhost:3001/teachers/${username}`;
    const res = await fetch(path);
    const data = await res.json();
    if (password === data[0].secret) {
      this.setState({
        mode: data[0].user_type === 'DATA'? 'dataCollection' : 'chooseMode',
        user: data[0].name,
        auth: true
      })
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/teachers')
      .then(response => response.json())
      .then(data => {
        const teacherOptions = [<option value="none" selected disabled hidden>Select your name</option>];
        data.forEach(teacher => teacherOptions.push(<option value={teacher.login}>{teacher.name}</option>))
        this.setState({teachers: teacherOptions});
      },
      (error) => {
        this.setState({
          error
        });
      })  
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <p>>{this.state.error}</p>
        </div>
      )
    } else if (this.state.mode === 'landing') {
      return <Landing teachers={this.state.teachers} onSubmit={this.authenticate}/>;
    } else if (this.state.mode === 'dataCollection') {
      return (
        <div><h1>placeholder</h1></div>
      )
    } else if (this.state.mode === 'chooseMode') {
      return (
        <div>
          <h1>{'What do you want to do today, ' + this.state.user + '?'}</h1>
        </div>
      )
    }
  }
}


class Landing extends React.Component {

  get loginForm() {
    return (
      <form action="#" onSubmit={this.props.onSubmit}>
        <label for="name">Name</label>
        <select id="name" name="name">
          {this.props.teachers}
        </select>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Password"></input>
        <input type="submit" value="Submit" ></input>
      </form>
    )
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Seneca ECE-Wizard</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to Seneca's ECE Data Collection App.
            Please log in to get started!
          </p>
          {this.props.teachers && this.loginForm}
        </header>
      </div>
    );
  }
}



function App() {




  return <Main />
}

export default App;
