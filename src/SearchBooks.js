import React, {Component} from 'react'
import PropTypes from "prop-types";
import {Link} from 'react-router-dom'
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";
import * as BooksAPI from './BooksAPI'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

class SearchBooks extends Component{
  static propTypes = {
    books: PropTypes.array,
    currentReads: PropTypes.func
  };

  state = {
    query: '',
    selectedValue: '',
    currentlyReading: [],
    wantToRead: [],
    finishedReading: [],
    searchBooks: []

  }

  componentDidMount() {
    //BooksAPI.update(this.state.currentlyReading,this.state.selectedValue);

/*if(!this.state.query==='') {
  //console.log('assaa')
      BooksAPI.search(this.state.query).then((books) => {
        this.setState({searchBooks:books})

      },()=> console.log(this.state.query))
}*/
    }


  componentDidUpdate(prevProps,prevState) {
    if (prevState.query !== this.state.query) {
      if (this.state.query!=='') {
        BooksAPI.search(this.state.query).then((books) => {
          console.log(books)
          if (!books.error) {
            this.setState({searchBooks:books})

          } else{
            this.setState({
              searchBooks:[]
            })
          }

        }

)
    }
  }
}


  sortBooks = (book,selectedValue) => {

   switch (true) {
     //case this.state.selectedValue==='currentlyReading' && !this.state.currentlyReading.includes(book):
     case selectedValue==='currentlyReading':

       BooksAPI.update(book,selectedValue)
       console.log(book)

     break;

    //case this.state.selectedValue==='wantToRead' && !this.state.wantToRead.includes(book):
    case selectedValue==='wantToRead':

      BooksAPI.update(book,selectedValue)
    break;

    //case this.state.selectedValue==='finishedReading' && !this.state.finishedReading.includes(book):
    case selectedValue==='finishedReading':


      BooksAPI.update(book,selectedValue)
    break;
    default:

   }
  }

  handleChange = (e,book) => {
    console.log(book)
     this.setState({selectedValue:e.target.value});
     var selectedValue=e.target.value

     this.sortBooks(book,selectedValue)
   }
   handleSelect=(e,book)=>{
     console.log(book)
     this.setState({selectValue:e});
      var selectedValue=e
      //this.sortBooks(book,selectedValue)
     }

  updateQuery = (query) => {
    this.setState({query: query.trim() })
  }


  render() {
    /*console.log(this.state.currentlyReading)
  console.log(this.state.wantToRead)
  console.log(this.state.finishedReading)*/



  //console.log('this.state.searchBooks')
    //console.log(this.state.searchBooks)

    let showBooks=null
    if (this.state.query && this.state.searchBooks !== undefined) {
      const match = new RegExp(escapeRegExp(this.state.query),'i');
      //showBooks = this.props.books.filter((book) => match.test(book.title))
  showBooks = this.state.searchBooks.filter((book) => match.test(book.title))
    } else {
      //showBooks = this.props.books
      showBooks = this.props.searchBooks
    }
    return(
      <div className="search-books">
        <div className="search-books-bar">
        <Link
          to="/"
          className="add-contact">
            <button className="close-search">Close</button>
        </Link>

          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              value = {this.state.query}
              onChange = {(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="search-books-results">
          <ol className="books-grid">
        {showBooks!==undefined&& (showBooks.map(book => (
              <li>
              <div className="book">
                <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                    <div className="book-shelf-changer">
                  {/*<select onChange={e => {this.handleChange(e,book)}}>
                     <button className="close-search">Close</button>
                      <option value="move" disabled>Move to...</option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none" selected>None</option>
                    </select>*/}
                    <DropdownButton  id="dropdown-item-button" onSelect={e => {this.handleSelect(e,book)}}>

                      <Dropdown.ItemText >Move to...</Dropdown.ItemText>
                      <Dropdown.Item  eventKey="currentlyReading" className={book.shelf==='currentlyReading' ? 'dropdown-item-checked' : ''}>Currently Reading</Dropdown.Item>
                      <Dropdown.Item eventKey="wantToRead" className={book.shelf==='wantToRead' ? 'dropdown-item-checked' : ''}>Want to Read</Dropdown.Item>
                      <Dropdown.Item eventKey="read" className={book.shelf==='read' ? 'dropdown-item-checked' : ''}>Read</Dropdown.Item>
                      <Dropdown.Item eventKey="none">None</Dropdown.Item>
                    </DropdownButton>
                    </div>
                  </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}</div>
                <div className="book-authors">Selected change = {this.state.selectedValue}</div>
              </div>

              </li>

          )))}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks
