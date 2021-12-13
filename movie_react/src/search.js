import { Form, Button, Row, Col, Accordion, Card, Modal, Pagination, OverlayTrigger, Tooltip, Dropdown, DropdownButton } from 'react-bootstrap';
import React, { useEffect, useState }from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';
import $ from 'jquery';
import no from './img/noimage.png';


import './Search.css';
import "react-datepicker/dist/react-datepicker.css";

function Search() {
    
    
    const [genre, genre_change] = useState({
        '드라마' : 1, '판타지' : 2, '서부': 3, '공포' : 4, '로맨스': 5, '모험':  6, '스릴러': 7, '느와르' : 8,
        '컬트' : 9, '다큐멘터리' : 10, '코미디' : 11, '가족' : 12, '미스터리' : 13, '전쟁' : 14, '애니메이션' : 15,
        '범죄' : 16, '뮤지컬' : 17, 'SF' : 18, '액션' : 19, '무협' : 20, '에로' : 21, '서스펜스' : 22, '서사' : 23, '블랙코미디' : 24,
        '실험' : 25, '영화카툰' : 26, '영화음악' : 27, '영화패러디포스터' : 28
    })
    
    const [searchWord, setSearchWord] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [date_search, setDate_search] = useState(true);
    const [selectGenre, setSelectGenre] = useState(0);
    const [searchResult, searchResult_change] = useState([])
    const [showResult, showResult_change] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [items, setItems] = useState([]);
    const [quote, setQuote] = useState({});
    const [searchInMain, setSearchInMain] = useState(localStorage.getItem('searchWord') != null ? localStorage.getItem('searchWord') : '');
    
    useEffect(() => {
        var quoteNum = Math.floor(Math.random() * 50) + 1;

        axios.get('/public/quote', {
            params : {
                q : quoteNum,
            }
        }).then( result => {
            setQuote(result.data);
        })

        if(searchInMain){
            localStorage.removeItem('searchWord');
            handlerSubmit();
        }
    }, []);

    const handlerSubmit = (e) => {
        if (searchInMain == "") {
            e.preventDefault();
        }
        
        var setting;
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
            if(searchInMain){
                setting = {
                    query : searchInMain,
                    genre : selectGenre,
                    display : 100,
                }
            }
            else {
                setting = {
                    query : searchWord,
                    genre : selectGenre,
                    display : 100,
                }
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
                            }} value = {
                                searchInMain
                                ? searchInMain
                                : searchWord
                            }
                            />
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

    const [searchResult, searchResult_change] = useState(props.result);
    const [page, setPage] = useState(1);
    const [pageComp, setPageComp] = useState([]);
    const [modalData, setModalData] = useState({});
    
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
                <DropdownButton id="dropdown-basic-button" title="Filter" style={{float:'right'}} onChange={() => {console.log(1)}}>
                    <Dropdown.Item >이름</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">연도</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">평점 높은 순</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">평점 낮은 순</Dropdown.Item>
                </DropdownButton>
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
    const [posterUrl, setPosterUrl] = useState('');
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [likedList, setLikedList] = useState(localStorage.getItem('liked') ? JSON.parse(localStorage.getItem('liked')) : []);
    const [like, setLike] = useState(Object.keys(likedList).includes(props.modalData.link.split('=')[1]));


    useEffect(() => {
        axios.get('/public/poster',{
            params : {
                code : props.modalData.link.split("=")[1],
            }
        })
        .then(res => {
            setPosterUrl(res.data);
        })
    }, [])
    
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem('liked', JSON.stringify(likedList));
            axios.get('/public/addLike', {
                params : {
                    email : userInfo.email,
                    likedList : likedList,
                }
            })
        }
    }, [like]);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Like
        </Tooltip>
      );

    return (
        <Modal
            show = {props.modalState}
            onHide = {props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className = "search-modal"
            >
            <Modal.Header closeButton/>
            <Modal.Body>
                <Row className='modal-info'>
                    <Col xs={3} className="modal-img">
                        <img className="" src={ posterUrl === "" ? null : posterUrl }/>
                    </Col>
                    <Col xs={9} className="modal-detail">
                        <div className="modal-titleBox mb-3">
                            <div id="contained-modal-title-vcenter" className="modal-title">{props.modalData.title.split(/<b>|<\/b>/g).join("")}</div>
                            <div id="contained-modal-title-vcenter" className="modal-sub">{props.modalData.subtitle.split(/<b>|<\/b>/g).join("")} / {props.modalData.pubDate}</div>
                        </div>
                        <div className='mt-2 mb-2'><span>런타임 : </span></div>
                        <div className='mt-2 mb-2'><span>국가 / 장르 : </span></div>
                        <div className='mt-2 mb-2'><span>감독 : </span>{props.modalData.director.split("|").slice(0, -1).join(', ')}</div>
                        <div className='mt-2 mb-2'><span>배우 : </span>{props.modalData.actor.split("|").slice(0, -1).join(', ')}</div>
                        <div className='mt-2 mb-2'><span>평점 : </span>⭐ {props.modalData.userRating}</div>
                        <div className='mt-2 mb-2'><span>관객 수 : </span></div>
                        <div className='mt-2 mb-2'><span>사이트 : </span><a target="_blank" href={props.modalData.link }>바로가기</a></div>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 50, hide: 50 }}
                            overlay={renderTooltip}
                            >
                            <button className="btn btn-secondary like" onClick = {() => {
                                if (!userInfo){
                                    alert('로그인 해주세요😁');
                                }
                                else {
                                    var l = {};
                                    let code = props.modalData.link.split('=')[1]
                                    let key = Object.keys(likedList);
                                    if (like) {
                                        for (let i = 0; i < key.length; i++){
                                            if (key[i] !== code)
                                                l[key[i]] = likedList[key[i]]
                                        }   
                                    }
                                    else {
                                        if (likedList !== []){
                                            for (let i = 0; i < key.length; i++){
                                                l[key[i]] = likedList[key[i]]
                                            }   
                                        }
                                        l[code] = (props.modalData);
                                    
                                    }
                                    setLikedList(l);
                                    setLike(!like);
                                }
                            }} style={
                                like
                                ? ({'color' : 'red'})
                                : null
                            }> ♥ </button>
                        </OverlayTrigger>
                        
                    </Col>
                    <hr className="mt-3 mb-3"/>
                    <Col xs={12} className="modal-analy">
                        <p>여기에 뭐 넣지</p>
                    </Col>
                </Row>
                
            </Modal.Body>
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
            </Card.Body>
                
            <div className='cover'></div>
        </Card>
    )

}


export default Search;