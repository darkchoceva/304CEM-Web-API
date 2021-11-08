import './App.css';
import React from 'react';
import $ from 'jquery';
import background from "./img/sun-photography.jpg";
//import axios from 'axios';
//import Table from 'react-bootstrap/Table';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            sLoaded: false,
            docs: []
        }
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        var context = this;

        const queryParams = new URLSearchParams(window.location.search);
        const lat = encodeURI(queryParams.get('lat'));
        const lng = encodeURI(queryParams.get('lng'));

        $.ajax({
            url: `http://localhost:5000/insertSun?lat=${lat}&lng=${lng}`,
            method: 'GET',
            success: function(response) {
                context.setState({
                    isLoaded: true,
                    docs: response.docs
                });
            }
        });
    }

    render() {
        const btnstyle = {
            color: "white",
            backgroundColor: "#6D214F",
            border: "2px solid #6D214F",
            cursor: "pointer",
            fontSize: "16px",
            fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
            width:"100px",
            padding:"5px",
            marginLeft:"5px",
            borderRadius:"8px"
        };
      
        const inputstyle = {
            fontSize: "16px",
            fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
            padding: "5px",
            opacity: "0.8",
            margin: "5px",
            borderRadius:"8px",
            border: "2px solid #6D214F"
        }

        return (
            <div style={{backgroundImage:`url(${background})`, backgroundRepeat:'no-repeat', backgroundPosition: 'center', position:'relative', 
            backgroundSize: 'cover', height: '100vh', opacity:'0.9'}}>
                <div class="row" style={{textAlign:'center', fontSize:'40px',paddingTop:'40px',color:'white'}}>
                    <b>Golden Hour Hunter</b>
                </div>
       
                <div class="row" style={{textAlign:'center', fontSize:'16px',paddingTop:'16px',color:'white'}}>
                    <b>search the golden hour with the coordinates of the place.</b>
                </div>
                <form action="/insertSun" method="get">
                    <div class="row" style={{textAlign:'center'}}>
                        <input 
                            type = 'text'
                            name='lat'
                            placeholder='Latitude'
                            style = {inputstyle}
                            required
                        />
                        <input 
                            type = 'text'
                            name='lng'
                            placeholder='Longitude'
                            style = {inputstyle}
                            required
                        />
                        <button type="submit" style={btnstyle}><b>Search</b></button>
                    </div>
                </form>
                <div style={{display: 'flex', justifyContent: 'center', color:'white'}}>
                    <ul>
                        {this.state.docs.map(doc => (
                            <li key={doc.countryCode}>
                                {doc._id} {doc.countryCode} {doc.sunriseHour} {doc.sunsetHour} {doc.weather} {doc.temperature} {doc.v}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
export default App;