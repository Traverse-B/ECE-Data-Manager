import logo from './logo.svg';
import './App.css';
import React from 'react';
import {ROUTE} from './App.js';


export class Landing extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoaded: false,
      }
      this.componentDidMount = this.componentDidMount.bind(this);
    }
  
    componentDidMount() {
      fetch(`${ROUTE}/teachers`)
        .then(response => response.json())
        .then(data => {
          const teachers = [<option value="none" selected disabled hidden>Select your name</option>];
          data.forEach(teacher => teachers.push(<option value={teacher.login}>{teacher.name}</option>));
          this.setState({
            isLoaded: true,
            teachers: teachers
          });
        },
        (error) => {
          this.setState({
            error
          });
        })  
    }
  
    loginForm(teachers, onSubmit) {
      return (
        <form onSubmit={onSubmit}>
          <label for="name">Name</label>
          <select required id="name" name="name">
            {teachers}
          </select>
          <label for="password">Password</label>
          <input required type="password" id="password" name="password" placeholder="Password"></input>
          {this.props.incorrect && <p style={{color: "red", fontSize: "14px"}}>Password incorrect.  Triple check that password and contact Mr. B!</p>}
          <input type="submit" value="Submit" ></input>
        </form>
      )
    }
  
  
    render() {
      return ( 
          <header className="App-header">
            <h1>Seneca ECE-Wizard</h1>
            {this.state.isLoaded && (
              <p>
                Welcome to Seneca's ECE Data Collection App.
                Please log in to get started!
              </p>
            )}
            {this.state.isLoaded ? this.loginForm(this.state.teachers, this.props.onSubmit) : <img src={logo} className="App-logo" alt="logo" />}
          </header>
      );
    }
  }