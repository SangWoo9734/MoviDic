import { Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import React, { useState }from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';


import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function Search() {
    
    var [genre, genre_change] = useState(['드라마', 'SF/판타지', '공포', '로맨스', '모험', '스릴러', '범죄/느와르', '다큐멘터리', '코미디', '가족', '미스터리/서스펜스', '전쟁', '애니메이션', '뮤지컬', '액션/무협', '에로', '영화음악', '기타'])
    const [startDate, setStartDate] = useState(new Date());

    



    const CLIENT_ID = 'nfKCf0KHoDkfBEgNu1p3'
    const CLIENT_SECRET = 'Yjw1jMkKm9'
    const headers = {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
    }
    
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
                                    <Form.Label column sm={2} style={{ borderRight : '1px solid #212529'}}>장르</Form.Label>
                                    <Col sm={{ span: 10}} style={{textAlign : 'left'}}>
                                        {
                                            genre.map(function(g, i ){
                                                return <Form.Check inline label={g} className="genreName"/>
                                            })
                                        }
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 genreGroup" controlId="">
                                    <Form.Label column sm={2} style={{ borderRight : '1px solid #212529'}}>개봉연도</Form.Label>
                                    <Col sm={{ span: 10}} className='mt-2 search-year'>
                                        <div className="datepicker-content">
                                            <DatePicker 
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                showYearPicker
                                                dateFormat="yyyy"/>
                                        </div>
                                        <div className="datepicker-style datepicker-content" > 년 ~</div>
                                        <div className="datepicker-content">
                                            <DatePicker 
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                showYearPicker
                                                dateFormat="yyyy"/>
                                        </div>
                                        <div className="datepicker-style datepicker-content" > 년</div>
                                    </Col>
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant="primary" className="mt-3 search-result" onClick={() => {

                        // 네이버 영화 검색 API 호출 코드
                        axios.get('https://openapi.naver.com/v1/search/movie.json', {
                            params : {
                                query : 'black',
                            },
                            headers : headers,
                        }).then(resonse => {
                            var json = resonse.data.items
                            console.log(resonse.data.items);
                        }).catch( error => {
                            console.log(error);
                        })
                        console.log('');
                        
                    }}
                    >Search</Button>
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