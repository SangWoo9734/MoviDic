import { Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import React, { useEffect, useState }from 'react';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faCamera, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function Search() {
    
    var [genre, genre_change] = useState(['드라마', 'SF/판타지', '공포', '로맨스', '모험', '스릴러', '범죄/느와르', '다큐멘터리', '코미디', '가족', '미스터리/서스펜스', '전쟁', '애니메이션', '뮤지컬', '액션/무협', '에로', '영화음악', '기타'])
    const [startDate, setStartDate] = useState(new Date());
    
    return (
        <div className='container mt-4'>
            <div className='search-box'>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="">
                        <Form.Label column sm={2} style={{borderRight : '1px solid white'}}>Title</Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" placeholder="Search..." />
                        </Col>
                    </Form.Group>
                    
                        
                    <Accordion>
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header className='search-detail'>Search Detail</Accordion.Header>
                            <Accordion.Body className='search-detail'>
                                <Form.Group as={Row} className="mb-3 genreGroup" controlId="">
                                    <Form.Label column sm={2} style={{ borderRight : '1px solid #212529'}}>Genre</Form.Label>
                                    <Col sm={{ span: 10}}>
                                        
                                        {
                                            genre.map(function(g, i ){
                                                return <Form.Check inline label={g} className="genreName"/>
                                            })
                                        }
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 genreGroup" controlId="">
                                    <Form.Label column sm={2} style={{ borderRight : '1px solid #212529'}}>Date</Form.Label>
                                    <Col sm={{ span: 10}} className='mt-2'>
                                        <div className="datepicker-style" >
                                        <FontAwesomeIcon icon={faCalendar} size={'1x'}/>
                                        </div>
                                        <div>
                                            <DatePicker 
                                                showPopperArrow = {false}
                                                fixedHeight
                                                selected={startDate} onChange={(date) => setStartDate(date)}/>
                                        </div>
                                    </Col>
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant="primary" className="mt-4" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>

            <SearchResult />
        </div>
    )
}

function SearchResult() {

    var [searchrResult, searchResult_change] = useState(0);

    return (
        <div className='container mt-5'>
            <div>
                <h2 style={{float:'left', margin:'0'}}>Search Result</h2>
                <p style={{float:'right'}}>총 <span className='h3 text-primary'>{searchrResult}</span> 개</p>
            </div>
            <div style={{clear : 'both'}}></div>
            <hr style={{margin : '0'}}/>

            <div className='searchResult-list'>

            </div>
        </div>
    )
}


export default Search;