import React, {Component, useState } from 'react'
import PropTypes from "prop-types";
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import sortBy from "sort-by";
import logo from './icons/selected.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faCheck  } from '@fortawesome/free-solid-svg-icons'
import Select, { components }  from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";


const options = [
  { value: 'currentlyReading', label: 'Currently Reading', icon:{faCheck} },
  { value: 'wantToRead', label: 'Want to Read' },
  { value: 'read', label: 'Read' },
  { value: 'none', label: 'None' },
];



const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    /*color: state.isSelected ? 'red' : 'blue',*/
    width: "100%",
    paddingLeft:5,
    paddingTop:2,
    paddingBottom:2,
    color: 'black',
    fontSize: 12,

  }),

  dropdownIndicator:(provided,state) => ({
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
    position:'absolute',
    color: '#FFFFFF',
    left: '35%',
    bottom:'15%'


  }),
  control: (provided, state) => ({
    ...provided,
    // none of react-select's styles are passed to <Control />
    width: '100%',
    background: "#60ac5d;",
    borderRadius: "50%",
    border: 0,

  }),

}

const DropdownIndicator = (
  props: ElementConfig<typeof components.DropdownIndicator>
) => {
  return (
    <components.DropdownIndicator {...props}>
     <FontAwesomeIcon icon={faCaretDown} />


    </components.DropdownIndicator>
  );
};

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}

        aria-labelledby={labeledBy}
      >

        <ul className="slist-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);


class BookShelves extends Component{
  static propTypes = {
    books:PropTypes.array,
    currentBook:PropTypes.array
  };

  state = {
      selectValue: "",
      bookLibrary: [],
      currentlyReading: [],
      wantToRead: [],
      finishedReading: [],
    };

  componentDidUpdate(prevProps,prevState) {
    if (prevProps.books!==this.state.bookLibrary&&this.state.selectValue==='') {
      this.setState({bookLibrary: this.props.books})
    }

    if (prevState.bookLibrary !== this.state.bookLibrary) {
      BooksAPI.getAll().then((books)=>{
        this.setState({bookLibrary:books})
      })
    }
  }

    sortBooks = (book,selectedValue) => {
     switch (true) {
       case selectedValue==='currentlyReading':
         BooksAPI.update(book,selectedValue)
         console.log(book)
       break;

       case selectedValue==='wantToRead':
         BooksAPI.update(book,selectedValue)
       break;

       case selectedValue==='read':
         BooksAPI.update(book,selectedValue)
       break;
       case selectedValue==='none':
         BooksAPI.update(book,selectedValue)
       break;
      default:

     }

    }

  handleChange = (e,book) => {
    console.log(book)
     this.setState({selectValue:e.target.value});
     var selectedValue=e.target.value
     this.sortBooks(book,selectedValue)

   }

   handleSelect=(e,book)=>{
     console.log(book)
     this.setState({selectValue:e});
      var selectedValue=e
      this.sortBooks(book,selectedValue)
     }




  render() {
//console.log(this.state.currentlyReading)
let currentbooks
let wantToRead
let finishedReading
currentbooks=this.state.bookLibrary.filter((book) => book.shelf.includes('currentlyReading'))
wantToRead=this.state.bookLibrary.filter((book) => book.shelf.includes('wantToRead'))
finishedReading=this.state.bookLibrary.filter((book) => book.shelf.includes('read'))

currentbooks.sort(sortBy("title"))
wantToRead.sort(sortBy("title"))
finishedReading.sort(sortBy("title"))

let dropDownLinkStyle = {

  backgroundImage:  `url('./icons/arrow-drop-down.svg')`,
  background: '#60ac5d'
};

    return(
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {currentbooks.map(book => (
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})`}}>

                        </div>
                        <div className="book-shelf-changer">
                            {/* <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic" >

                          </Dropdown.Toggle>

                       <Dropdown.Menu as={CustomMenu} onClick={handleSelect}>
                          <Dropdown.Item href="move" disabled className="dropdown-item">Move to...</Dropdown.Item>
                            <Dropdown.Item /*href="currentlyReading"eventKey="currentlyReading" className="dropdown-item">Currently Reading</Dropdown.Item>
                            <Dropdown.Item /*href="wantToRead"eventKey="wantToRead" className="dropdown-item-checked">Want to Read</Dropdown.Item>
                            <Dropdown.Item /*href="read" eventKey="read" className="dropdown-item">Read</Dropdown.Item>
                            <Dropdown.Item /*href="none" eventKey="none" className="dropdown-item">None</Dropdown.Item>
                          </Dropdown.Menu>
                          </Dropdown>
                          */}


                        <DropdownButton  id="dropdown-item-button" onSelect={e => {this.handleSelect(e,book)}}>
                          <Dropdown.ItemText >Move to...</Dropdown.ItemText>
                          <Dropdown.Item  eventKey="currentlyReading" className="dropdown-item-checked">Currently Reading</Dropdown.Item>
                          <Dropdown.Item eventKey="wantToRead" >Want to Read</Dropdown.Item>
                          <Dropdown.Item eventKey="read">Read</Dropdown.Item>
                          <Dropdown.Item eventKey="none">None</Dropdown.Item>

                        </DropdownButton>

                          {/*<select onChange={e => {this.handleChange(e,book)}}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading" selected>Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>

                          </select>*/}


                        </div>
                      </div>
                      {/*<div className="book-title">To Kill a Mockingbird</div>
                      <div className="book-authors">Harper Lee</div>*/}
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>

                  </li>
                  ))}
                  {/*<li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: 'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")' }}></div>
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">Ender's Game</div>
                      <div className="book-authors">Orson Scott Card</div>
                    </div>
                  </li>*/}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                {wantToRead.map(book => (
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: /*'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")'*/ `url(${book.imageLinks.thumbnail})` }}></div>
                        <div className="book-shelf-changer">
                        <DropdownButton  id="dropdown-item-button" onSelect={e => {this.handleSelect(e,book)}}>
                          <Dropdown.ItemText >Move to...</Dropdown.ItemText>
                          <Dropdown.Item  eventKey="currentlyReading">Currently Reading</Dropdown.Item>
                          <Dropdown.Item eventKey="wantToRead" className="dropdown-item-checked">Want to Read</Dropdown.Item>
                          <Dropdown.Item eventKey="read">Read</Dropdown.Item>
                          <Dropdown.Item eventKey="none">None</Dropdown.Item>

                        </DropdownButton>
                          {/*<select onChange={e => {this.handleChange(e,book)}}  >
                            <option value="move" disabled>Move to...</option>
                            <option  value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead" selected>Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>*/}
                        </div>
                      </div>
                      {/*<div className="book-title">1776</div>
                      <div className="book-authors">David McCullough</div>*/}
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                  </li>
                ))}
                  {/*<li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")' }}></div>
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">Harry Potter and the Sorcerer's Stone</div>
                      <div className="book-authors">J.K. Rowling</div>
                    </div>
                  </li>*/}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                {finishedReading.map(book => (
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: /*'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")'*/ `url(${book.imageLinks.thumbnail})` }}></div>
                        <div className="book-shelf-changer">

                        <DropdownButton  id="dropdown-item-button" onSelect={e => {this.handleSelect(e,book)}}>
                          <Dropdown.ItemText >Move to...</Dropdown.ItemText>
                          <Dropdown.Item  eventKey="currentlyReading">Currently Reading</Dropdown.Item>
                          <Dropdown.Item eventKey="wantToRead">Want to Read</Dropdown.Item>
                          <Dropdown.Item eventKey="read" className="dropdown-item-checked">Read</Dropdown.Item>
                          <Dropdown.Item eventKey="none">None</Dropdown.Item>
                        </DropdownButton>

                          {/*<select onChange={e => {this.handleChange(e,book)}}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read" selected>Read</option>
                            <option value="none">None</option>
                          </select>*/}
                        </div>
                      </div>
                      {/*<div className="book-title">The Hobbit</div>
                      <div className="book-authors">J.R.R. Tolkien</div>*/}
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                  </li>
                ))}
                  {/*<li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 174, backgroundImage: 'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")' }}></div>
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">Oh, the Places You'll Go!</div>
                      <div className="book-authors">Seuss</div>
                    </div>
                  </li>
                  <li>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")' }}></div>
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">The Adventures of Tom Sawyer</div>
                      <div className="book-authors">Mark Twain</div>

                    </div>
                  </li>*/}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="open-search">
          {/* update UI, enable keyboard shortcuts, new tab*/}
          <Link
            to="/search">
              <button >Add a book</button>
          </Link>
        </div>
      </div>
    )
  }
}

export default BookShelves
