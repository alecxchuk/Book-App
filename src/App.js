import React from 'react'
import * as BooksAPI from './BooksAPI'
import {Route} from 'react-router-dom'
import BookShelves from './BookShelves'
import SearchBooks from './SearchBooks'
import './App.css'



class BooksApp extends React.Component {
  state = {

    books :[],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    currentlyReading: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books})
      //console.log({books})
    })
  }

  setRead = (current) =>{
    this.setState({
      currentlyReading:current
    })
  }



  render() {

    return (
      <div className="app">
          <Route path="/search" render={({ history }) =>(
          <SearchBooks
            books={this.state.books}
            currentReads={this.setRead}

          />
        )}/>

          <Route exact path="/" render={()=>(
          <BookShelves
            books={this.state.books}
            currentBook={this.state.currentlyReading}
          />
          )}/>

      </div>
    )
  }
}

export default BooksApp
