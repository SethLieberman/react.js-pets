import React from 'react';
import ReactDOM from 'react-dom';
// importing MainInterdace from app.jsx page
import MainInterface from './App.jsx';
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';


// this is displaying MainInterdace class from app.jsx to petAppointments <div> on index.html
ReactDOM.render(<MainInterface />, document.getElementById('petAppointments'));
