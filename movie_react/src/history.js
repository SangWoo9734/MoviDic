import { Button, Card, ListGroup, Row, Col, Accordion, Table} from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import DatePicker from "react-datepicker";
import ReactDOM from 'react-dom';
import { LinearProgress } from '../node_modules/@mui/material';

import './History.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
    
    var [quote, setQuote] = useState({});
    var [movieChart, setMovieChart] = useState([]);
    var [startDate, setStartDate] = useState(new Date());
    var [loading, setLoading] = useState(false);

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

    useEffect(() => {

        setLoading(true);

        var today = startDate;
        var year = today.getFullYear();
        var month = (today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1);
        var day = (today.getDate() - 1) >= 10 ? (today.getDate() - 1) : '0' + (today.getDate() - 1);
        
        axios.get('/public/history', {
            params : {
                date : parseInt(year + "" + month + "" + day),
            }
        })
        .then(res => {
            let timer = setTimeout(()=>{ 
                setLoading(false);
                setMovieChart(res.data);
            }, 500);
            
        })
    }, [startDate])

    return (
        <div className="container">
            <div className='top-box mt-5 mb-5'>
                <div className='top-title h1'>MOVIE HISTORY</div>
                <div className=''>
                    <div className="quote-content font-italic ">"{quote.text}"</div>
                    <div className="quote-info font-italic text-right">- {quote.title} / {quote.year} -</div>
                </div>
            </div>
            <hr />
            <div className='history-box'>
                <div className="history-date">
                    <Button variant="primary" onClick={() => {
                        setMovieChart([]);
                        var newDate = new Date(startDate);
                        newDate.setDate(newDate.getDate() - 1);
                        setStartDate(newDate);
                    }}>&lt;</Button>
                    <DatePicker 
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                        }}
                        dateFormat="yyyy/MM/dd (EE)"
                        className='datepicker'
                        style = {{width : '100%'}}/>
                    <Button variant="primary" onClick={() => {
                        setMovieChart([]);
                        if (startDate.getDate() >= new Date().getDate())
                            alert('오늘입니다!');
                        else {
                            var newDate = new Date(startDate);
                            newDate.setDate(newDate.getDate() + 1);
                        }
                        setStartDate(newDate);
                    }}>&gt;</Button>
                </div>
                {
                    loading
                    ?  <LinearProgress />
                    : null
                }
                <Moviehistory2 movies={movieChart}/>
                
            </div>

            
        </div>
    )
}

function Moviehistory2(props) {
    return (
        <div className='container'>
            <Row>
            {
                props.movies.map((movie, i) => {
                    return (
                        <Moviecard movie={movie} key={i}/>
                    )
                    
                })
            }
            </Row>
            <div style={{clear : 'both'}}></div>
        </div>
    )
}

function Moviecard(props) {

    var [movieDetail, setMovieDetail] = useState({});

    useEffect(() => {
        axios.get('/public/moviedetail', {
            params : {
                code : props.movie.movieCd,
            }
        })
        .then(res => {
            setMovieDetail(res.data);
        })
    }, [])

    function directors(dir) {
        if (dir == null)
            return ''; 
        else if (dir.length > 1)
            return dir[0].peopleNm + ' 외 ' + (dir.length - 1) + ' 명';
        else 
            return dir[0].peopleNm;
    }

    function rankChange(rank) {
        if(rank > 0) {
            return ['▲ ' + rank, 'text-danger history-updown']
        }
        else if (rank < 0) {
            return ['▼ ' + String(rank * -1), 'text-primary history-updown'];
        }
        else {
            return ['-', 'history-updown'];
        }
    }
    
    return (
        <Col xs={6} className='poster'>
            
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header >
                        <div className="history-rank text-center">
                            <div className="h4">{props.movie.rank}</div>
                            <div className={rankChange(props.movie.rankInten)[1]}>{rankChange(props.movie.rankInten)[0]}</div>
                        </div>
                        <div className='history-title'>{props.movie.movieNm}</div>
                        {
                            props.movie.rankOldAndNew === 'NEW'
                            ? <div className='text-danger history-new' style={{fontWeight : 'bolder', fontSize : '15px'}}>{props.movie.rankOldAndNew}</div>
                            : null
                        }
                        
                        
                    </Accordion.Header>
                    <Accordion.Body className='history-detail'>
                        <Table responsive="sm">
                            <tr>
                                <th>개봉일</th>
                                <th>{props.movie.openDt}</th>
                            </tr>
                            <tr>
                                <th>총 관객수</th>
                                <th>{parseInt(props.movie.audiAcc).toLocaleString('en-US')} 명</th>
                            </tr>
                            <tr>
                                <th>감독</th>
                                <th>{directors(movieDetail.directors)}</th>
                            </tr>
                            <tr>
                                <th>런타임</th>
                                <th>{movieDetail.showTm} 분</th>
                            </tr>
                            <tr>
                                <th>#</th>
                                <th>Table heading</th>
                            </tr>
                        </ Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Col>
    )
}


function Moviehistory(props) {

    function rankChange(rank) {
        if(rank > 0) {
            return ['▲ ' + rank, 'text-danger']
        }
        else if (rank < 0) {
            return ['▼ ' + String(rank * -1), 'text-primary'];
        }
        else {
            return ['-', ''];
        }
    }

    return (
        <div className='container'>
            <ListGroup as="ol">
                {
                    props.movies.map((movie, i) => {
                        return (
                            <ListGroup.Item as="li" key={i} className='history-comp'>
                                <Row>
                                    <Col xs={1} className='history-rank'>
                                        <div className="h4">{movie.rank}</div>
                                        <div className={rankChange(movie.rankInten)[1]}>{rankChange(movie.rankInten)[0]}</div>
                                        {
                                            movie.rankOldAndNew === 'NEW'
                                            ? <div className='text-danger' style={{fontWeight : 'bolder', fontSize : '15px'}}>{movie.rankOldAndNew}</div>
                                            : null
                                        }
                                    </Col>
                                    <Col xs={11} className='history-content'>
                                        <div>
                                            <div className='h4'>{movie.movieNm}</div>
                                            <div>{movie.openDt} 개봉</div>
                                            <div>일 관객수 | {movie.audiCnt} 명</div>
                                            <div>총 관객수 | {movie.audiAcc} 명</div>
                                        </div>
                                        <div>
                                            {movie.watchGradeNm}
                                        </div>
                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
            
            
        </div>
    )
}

export default App;