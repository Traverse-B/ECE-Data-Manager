import './App.css';
import React from 'react';

export class SchoolSelect extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        school: false
      }
      this.chooseSchool = this.chooseSchool.bind(this);
    }
  
    chooseSchool(e) {
      const school = e.currentTarget.id;
      this.props.chooseSchool(school);
    }
  
    render() {
      return (
          <div>
              <header className="App-header">
                  <h1>ECE-Wizard</h1>
                  <p>Select your school to get started.</p>
                  <div style={{display: "flex", flexDirection: "row"}}>
                    <button id="Seneca" value="Seneca" onClick={this.chooseSchool} class="choice" style={{ boxShadow: "2px 2px 10px black", backgroundSize: "100% 100%",
                        backgroundImage:"url(https://lh3.googleusercontent.com/proxy/vnL3oHC7dQ1xtA_-EB86NSGuCLiM-FKWoJ3_gxi6rg5OUTu2sjMfS5bvffovVlLaaWOiVXaXbY-9AkeTGVJ7xR_tLIZhIN1RmRkQzr821TllAElDv7kzSZqPt837OEsK1WDI_Yxp2MvG48D9CMDA7T7WZEe9WsUr3sg1F-yPZnIOYPS2fA"}} >
                    </button>
                    <span class="longSpacer"></span>
                    <button id="Eastern" value="Eastern" onClick={this.chooseSchool} class="choice" style={{ boxShadow: "2px 2px 10px black", backgroundSize: "100% 100%",
                        backgroundImage:"url(https://s3-us-west-2.amazonaws.com/scorestream-team-profile-pictures/6440/20181010195543_260_mascotOrig.png"}} >
                        <h3>Eastern</h3>
                    </button>
                  </div>
              </header>
          </div> 
      );
    }
  }