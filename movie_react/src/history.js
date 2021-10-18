import { Button, Card, ListGroup, Row, Col, } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import DatePicker from "react-datepicker";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './History.css';
import poster from './img/back.jpg'
import "react-datepicker/dist/react-datepicker.css";

function App() {

    var [quote, setQuote] = useState({});
    var [movieChart, setMovieChart] = useState([]);
    var [startDate, setStartDate] = useState(new Date());

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
            setMovieChart(res.data);
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
                        setStartDate(startDate.date);
                    }}>&lt;</Button>
                    <DatePicker 
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                        }}
                        showYearPicker
                        dateFormat="yyyy/MM/dd (EE)"
                        className='datepicker'
                        style = {{width : '100%'}}/>
                    <Button variant="primary" onClick={() => {
                        setStartDate(parseInt(startDate) + 1);
                    }}>&gt;</Button>
                </div>
                <Moviehistory2 movies={movieChart}/>
            </div>
        </div>
    )
}

function Calendar() {

}

function Moviehistory2(props) {
    return (
        <div className='container'>
            {
                props.movies.map((movie, i) => {
                    return (
                        <Moviecard movie={movie} key={i}/>
                    )
                    
                })
            }
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
        <Col xs={2} className='poster'>
            <Card className='history-card text-center'>
                <div className="history-rank">
                    <div className="h4">{props.movie.rank}</div>
                    <div className={rankChange(props.movie.rankInten)[1]}>{rankChange(props.movie.rankInten)[0]}</div>
                </div>
                
                {
                    props.movie.rankOldAndNew === 'NEW'
                    ? <div className='text-danger history-new' style={{fontWeight : 'bolder', fontSize : '15px'}}>{props.movie.rankOldAndNew}</div>
                    : null
                }
                
                <Card.Body  className='history-content'>
                    
                    
                    <Card.Title className='h2 history-title'>{props.movie.movieNm}</Card.Title>
                    <Card.Text>
                        <div>{props.movie.openDt} 개봉</div>
                        <div>금일 관객수 | {props.movie.audiCnt} 명</div>
                        <div>총 관객 수 | {props.movie.audiAcc} 명</div>
                        
                        <div>감독 | {movieDetail.directors}</div>
                        
                        <div>런타임 | {movieDetail.showTm}분</div>
                    </Card.Text>
                </Card.Body>
                <Card.Img variant="top" src={poster} className='history-poster' />
            </Card>
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
        <div className='container '>
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
                                        <div className='poster-box'>
                                            <img src={poster} />
                                        </div>
                                        <div>
                                            <div className='h4'>{movie.movieNm}</div>
                                            <div>{movie.openDt} 개봉</div>
                                            <div>금일 관객수 | {movie.audiCnt} 명</div>
                                            <div>총 관객 수 | {movie.audiAcc} 명</div>
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