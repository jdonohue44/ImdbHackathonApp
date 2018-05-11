import React, { Component } from 'react';
import './App.css';
import popcornImg from './img/popcorn.jpg';
import axios from 'axios';
import { Button, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      placeholder: 'Enter movie title',
      reviews: [],
      displayReviews: false,
      imageUrl: '',
      year: '',
      title: '',
      sentimentResults: [],
      keywords: [],
      keyPhrases: [],
      ratingCount: -1,
      rating: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.getMovieReviews = this.getMovieReviews.bind(this);
    this.getSentimentOfReviews = this.getSentimentOfReviews.bind(this);
    this.getMovieDisplayData = this.getMovieDisplayData.bind(this);
    this.getTitleKeywords = this.getTitleKeywords.bind(this);
    this.getKeyPhrases = this.getKeyPhrases.bind(this);
    this.getTitleRatings = this.getTitleRatings.bind(this);
    this.getData = this.getData.bind(this);
    this.analyze = this.analyze.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  getData() {
    this.getMovieDisplayData();
    this.getMovieReviews();
    this.getTitleKeywords();
    this.getTitleRatings();
  }

  analyze() {
    this.getSentimentOfReviews();
    this.getKeyPhrases();
  }

  getMovieReviews() {
    var that = this;
    // get reviews
    axios.get('https://ennvcm96m4.execute-api.us-east-1.amazonaws.com/alpha/getTitleReviews', {
      params: {'title': that.state.value}})
      .then(function (response) {
        var reviews = JSON.parse(response.data.body);
        that.setState({value: '', reviews: reviews, displayReviews: true});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getMovieDisplayData(){
    var that = this;
    axios.get('https://tevc5pzyd4.execute-api.us-east-1.amazonaws.com/alpha/getImdbTitleDisplayData', {
      params: {'title': that.state.value}})
      .then(function (response) {
        var displayData = JSON.parse(response.data.body);
        var imageUrl = displayData.imageUrl;
        var year = displayData.year;
        var title = displayData.title;
        that.setState({value: '', imageUrl: imageUrl, year: year, title: title});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getTitleRatings(){
    var that = this;
    axios.get('https://shfs7upo4l.execute-api.us-east-1.amazonaws.com/alpha/getImdbTitleRatings', {
      params: {'title': that.state.value}})
      .then(function (response) {
        var ratings = JSON.parse(response.data.body);
        var rating = ratings.rating;
        var ratingCount = ratings.ratingCount;
        that.setState({rating: rating, ratingCount: ratingCount});
        console.log(ratings);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getSentimentOfReviews() {
    const reviews = this.state.reviews;
    var that = this;
    // post because we need to send large strings of reviews
    axios.post('https://vzlaj8gbaf.execute-api.us-east-1.amazonaws.com/alpha/getSentimentOfReviews', {
      'reviews': reviews
    })
    .then(function (response) {
      const sentimentResults = JSON.parse(response.data).ResultList;
      that.setState({sentimentResults: sentimentResults})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getTitleKeywords() {
    var that = this;
    axios.get('https://gbqkfae3mi.execute-api.us-east-1.amazonaws.com/alpha/getImdbTitleKeywords', {
      params: {'title': that.state.value}})
    .then(function (response) {
      that.setState({keywords: JSON.parse(response.data.body).keywords.split('-')})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getKeyPhrases() {
    const reviews = this.state.reviews;
    var that = this;
    // post because we need to send large strings of reviews
    axios.post('https://acy779g5r8.execute-api.us-east-1.amazonaws.com/alpha/getKeyPhrases', {
      'reviews': reviews
    })
    .then(function (response) {
      const keyPhrases = JSON.parse(response.data).ResultList;
      // find top scoring keyPhrases for all reviews
      that.setState({keyPhrases: keyPhrases})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const reviews = this.state.reviews;
    const imageUrl = this.state.imageUrl;
    const year = this.state.year;
    const sentimentResults = this.state.sentimentResults;
    const keyPhrases = this.state.keyPhrases;
    const title = this.state.title;
    const rating = this.state.rating;
    const ratingCount = this.state.ratingCount;
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title" style={{margin: 50, fontWeight: 900}}>Movie Ratings Analysis</h1>
        </header>

        <div style={{margin: 50}}>
          <img src={popcornImg} alt="popcorn" />
        </div>

        <form>
        <FormGroup style={{maxWidth: 500, margin: 'auto', display: 'inline-block'}}
          controlId="formBasicText" >
          <FormControl
            type="text"
            value={this.state.value}
            placeholder={this.state.placeholder}
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Button bsStyle="primary" style={{margin: 5}} onClick={this.getData}>Get Reviews</Button>
        <Button bsStyle="success" onClick={this.analyze}>Analyze</Button>
      </form>
        <h3>{title}</h3>
        <h5>{year}</h5>
        <img style={{maxWidth: 300}} src={imageUrl} />
        {ratingCount > 0 ? <h5><b>rating:</b> {rating} <b>rating count:</b> {ratingCount}</h5>
        : <p></p> }

        <ListGroup>
        {
          reviews.map(review =>
            <ListGroupItem style={{maxWidth: 800, margin: 'auto', marginTop: 10, border: '1px black solid', textAlign: 'left'}} header={"Joe College"}>{review.review}</ListGroupItem>
          )
        }
        </ListGroup>

      <ListGroup>
      {
        sentimentResults.map(sentiment =>
          <ListGroupItem
          style={{maxWidth: 800, margin: 'auto', marginTop: 10, border: '1px black solid', textAlign: 'left'}}
          header={sentiment.Sentiment}>
          <span style={{color: 'green'}}> Positive {sentiment.SentimentScore.Positive} </span> <br />
          <span style={{color: '#aba000'}}>  Neutral {sentiment.SentimentScore.Neutral} </span><br />
          <span style={{color: 'orange'}}> Mixed {sentiment.SentimentScore.Mixed} </span><br />
          <span style={{color: 'red'}}> Negative {sentiment.SentimentScore.Negative} </span>
          </ListGroupItem>
        )
      }
      </ListGroup>

      </div>
    );
  }
}

export default App;
