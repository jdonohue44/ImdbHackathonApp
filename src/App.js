import React, { Component } from 'react';
import './App.css';
import popcornImg from './img/popcorn.jpg';
import { Button, Form, FormGroup, Col, FormControl, ControlLabel } from 'react-bootstrap';

class App extends Component {
  render() {
    const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title" style={{margin: 50}}>Movie Ratings Home Title</h1>
        </header>

        <div style={{margin: 50}}>
          <img src={popcornImg} alt="popcorn" />
        </div>

        <Form horizontal>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={10}>
              <FormControl type="email" placeholder="Email" />
            </Col>
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>

        <div className="well" style={wellStyles}>
          <Button bsStyle="primary" bsSize="large" block>
            Comprehend Plot
          </Button>
        </div>

      </div>
    );
  }
}

export default App;
