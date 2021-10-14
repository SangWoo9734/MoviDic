import { Form, Button, Row, Col, Accordion, Card, Modal, Pagination } from 'react-bootstrap';
import React, { useEffect, useState }from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';
import $ from 'jquery';
import no from './img/noimage.png';


import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function Search() {
    
    
    var [genre, genre_change] = useState({
        '드라마' : 1, '판타지' : 2, '서부': 3, '공포' : 4, '로맨스': 5, '모험':  6, '스릴러': 7, '느와르' : 8,
        '컬트' : 9, '다큐멘터리' : 10, '코미디' : 11, '가족' : 12, '미스터리' : 13, '전쟁' : 14, '애니메이션' : 15,
        '범죄' : 16, '뮤지컬' : 17, 'SF' : 18, '액션' : 19, '무협' : 20, '에로' : 21, '서스펜스' : 22, '서사' : 23, '블랙코미디' : 24,
        '실험' : 25, '영화카툰' : 26, '영화음악' : 27, '영화패러디포스터' : 28
    })
    
    var [searchWord, setSearchWord] = useState('');
    var [startDate, setStartDate] = useState(new Date());
    var [endDate, setEndDate] = useState(new Date());
    var [date_search, setDate_search] = useState(true);
    var [date_selected, setDate_selected] = useState(false);
    var [genre_selected, setGenre_selected] = useState(false);
    var [selectGenre, setSelectGenre] = useState(0);
    var [searchResult, searchResult_change] = useState([])
    var [showResult, showResult_change] = useState(false);
    var [modalState, setModalState] = useState(false);
    var [items, setItems] = useState([]);
    var [quote, setQuote] = useState({});

    useEffect(() => {
        var quoteNum = Math.floor(Math.random() * 50) + 1;

        axios.get('/public/quote', {
            params : {
                q : quoteNum,
            }
        }).then( result => {
            setQuote(result.data);
        })

    }, []);
    

    const handlerSubmit = (e) => {
        e.preventDefault();
        var setting;
        console.log();
        if (!date_search) {
            setting = {
                query : searchWord,
                genre : selectGenre,
                display : 100,
                yearfrom : startDate.getFullYear(),
                yearto : endDate.getFullYear(),
            }
        }
        else {
            setting = {
                query : searchWord,
                genre : selectGenre,
                display : 100,
            }
        }
        
        axios.get('/public/searchList', {
            params : setting,
        })
        .then(res => {
            var result = res.data;

            result.sort(function (a, b) {
                if (a.pubDate > b.pubDate) {
                  return -1;
                }
                if (a.pubDate < b.pubDate) {
                  return 1;
                }
                // a must be equal to b
                return 0;
              });
            showResult_change(false); // Component 재랜더링을 위해 검색결과를 없애기
            searchResult_change(result);
            showResult_change(true);
        });
    }


    return (
        <div className='container mt-4'>
            <div className='top-box mt-5 mb-5'>
                <div className='top-title h1'>SEARCH MOVIE</div>
                <div className=''>
                    <div className="quote-content font-italic ">"{quote.text}"</div>
                    <div className="quote-info font-italic text-right">- {quote.title} / {quote.year} -</div>
                </div>
            </div>
            <hr />
            <div className='search-box'>
                <Form onSubmit={handlerSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="">
                        <Form.Label column xs={2} style={{borderRight : '1px solid white'}}>제 목</Form.Label>
                        <Col xs={10}>
                            <Form.Control type="text" placeholder="Search..." onChange={ e => {
                                setSearchWord(e.target.value);
                            }}/>
                        </Col>
                    </Form.Group>
                    
                        
                    <Accordion>
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header className='search-detail'>Search Detail</Accordion.Header>
                            <Accordion.Body className='search-detail'>
                                <Form.Group as={Row} className="mb-3 genreGroup" controlId="">
                                    <Form.Label column  xs={2} style={{ borderRight : '1px solid #212529'}}>장 르</Form.Label>
                                    <Col key={'inline-radio'} xs={10} style={{textAlign : 'left'}} >
                                        <Form.Check type={'radio'} inline label={"전체"} name="group1" value={'전체'} id={'inline-radio-0'} className="genreName"  onClick={(e) => {
                                            setSelectGenre(0);
                                        }} />
                                        {
                                            Object.keys(genre).map(function(g, i ){
                                                return <Form.Check type={'radio'} inline label={g} name="group1" value={g} id={'inline-radio-' + i} className="genreName" key={i} onClick={(e) => {
                                                    // console.log(genre[e.target.value]);
                                                    setSelectGenre(genre[e.target.value]);
                                                }} />
                                            })
                                        }
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 genreGroup" controlId="">
                                    <Form.Label column xs={2} style={{ borderRight : '1px solid #212529'}}>개봉연도</Form.Label>
                                    <Col xs={10} className='mt-2 search-year'>
                                        <div key = 'default-checkbox' className="mb-3 w-50">
                                            <Form.Check
                                                    checked={!date_search}
                                                    type = 'checkbox'
                                                    id = 'default-checkbox'
                                                    label = '날짜로 검색'
                                                    onChange = {() => {
                                                        setDate_search(!date_search);
                                                    }}
                                                />
                                        </div>
                                        <div className="datepicker-content">
                                            <DatePicker 
                                                selected={startDate}
                                                onChange={(date) => {
                                                    if (date > endDate){
                                                        alert('잘못된 날짜 설정입니다.');
                                                    } else {
                                                        setStartDate(date)
                                                    }
                                                }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                className='datepicker'
                                                disabled = {date_search}/>
                                        </div>
                                        <div className="datepicker-style datepicker-content" > 년 ~</div>
                                        <div className="datepicker-content">
                                            <DatePicker 
                                                selected={endDate}
                                                onChange={(date) => {
                                                    if (date < startDate){
                                                        alert('잘못된 날짜 설정입니다.');
                                                    } else {
                                                        setEndDate(date);
                                                    }
                                                }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                className='datepicker'
                                                disabled = {date_search}/>
                                        </div>
                                        <div className="datepicker-style datepicker-content" > 년</div>
                                    </Col>
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant="primary" className="mt-3 search-result" type="submit" >Search</Button>
                </Form>

            </div>
            
            {
                showResult
                ? <SearchResult word={searchWord} result={searchResult} modalState={modalState} setModalState={setModalState} className="pb-5"/>
                : null
            }
        </div>
    )
}

function SearchResult(props) {

    var [searchResult, searchResult_change] = useState(props.result);
    var [page, setPage] = useState(1);
    var [pageComp, setPageComp] = useState([]);
    var [modalData, setModalData] = useState({});

    useEffect(() => {
        let items = [];
        for (let number = 1; number <= Math.ceil(searchResult.length/20); number++) {
            items.push(
            <Pagination.Item key={number} active={number === page} onClick={() => {
                setPage(number);
                window.scrollTo(0,0);
            }}>
                {number}
            </Pagination.Item>,
            );
        }
        setPageComp(items);
    }, [page])
    

    return (
        <div className='container mt-5'>
            <div>
                <h2 style={{float:'left', margin:'0'}}><span className='h2 text-primary'>"{props.word}"</span> 에 대한 검색결과</h2>
                <p style={{float:'right'}}>총 <span className='h3 text-primary'>{searchResult.length}</span> 개</p>
            </div>
            <div style={{clear : 'both'}}></div>
            <hr style={{marginTop : '0'}}/>

            <div className='row searchResult-list'>
                <Row style={{margin : 'auto'}}>
                    {
                        
                        searchResult.slice((page-1) * 20, (page-1) * 20 + 20).map(function(m, i) {
                            return (
                            <Col className="mt-3 mb-2" xs={6} md={4} lg={3} key={i}>
                                <Movie source={m} setModalData={setModalData} setModalState = {props.setModalState}/>
                            </Col>
                            )
                        })
                    }
                </Row>
            </div>

            {
                props.modalState
                ? <Moviedetail modalState={props.modalState} onHide={() => props.setModalState(false)} modalData={modalData}/>
                : null
            }

            <Pagination>{pageComp}</Pagination>
        </div>
    )
}

function Moviedetail(props) {
    return (
        <Modal
            show = {props.modalState}
            onHide = {props.onHide}
            size='lg'
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className = "modal-box"
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title">{props.modalData.title.split(/<b>|<\/b>/g).join("")}</Modal.Title>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-sub">{props.modalData.subtitle.split(/<b>|<\/b>/g).join("")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={4} className="border-right">
                        <img className="modal-img" src={ props.modalData.image === "" ? no : props.modalData.image }/>
                    </Col>
                    <Col xs={8}>
                    안녕못해요
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}


function Movie(props) {


    return (
        <Card  className="searchResult_movie" onClick={() => {
            props.setModalData(props.source);
            props.setModalState(true);
        }} >
            <div className="searchResult_img" >
                <Card.Img variant="top" src={ props.source.image === "" ? no : props.source.image } />
            </div>
            <Card.Body className="searchReuslt_content">
                <Card.Title className="searchResult_title">{props.source.title.split(/<b>|<\/b>/g).join("")}</Card.Title>
                <Card.Title className="searchResult_subtitle">{props.source.subtitle.split(/<b>|<\/b>/g).join("")}</Card.Title>
                
                <Card.Text className="searchResult_info mt-4">{props.source.director.split("|").length > 2 ? props.source.director.split("|")[0] + ' 외 ' + (props.source.director.split("|").length - 2) + '명' : props.source.director.split("|").slice(0, -1).join()} / {props.source.pubDate}</Card.Text>
                <Card.Text className="searchResult_info">평점⭐ {props.source.userRating}</Card.Text>
                {/* <Card.Text>{props.source.actor.split("|").slice(0, -1).join()}</Card.Text> */}
            </Card.Body>
                
            <div className='cover'></div>
        </Card>
    )

}


export default Search;