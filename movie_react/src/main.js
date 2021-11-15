import { Card, DropdownButton, Dropdown, Form, Button } from 'react-bootstrap';
import React, { useHistory, useEffect, useState} from 'react'
import axios from 'axios';
import './App.css';
import theater from './img/theater.png';
import search from './img/search.png';
import back_history from './img/back-history.jpg';
import back_search from './img/back-search.jpg';


function Boxoffice({history}) {

    var [top10, top10_change] = useState([]);
	var [page, page_change] = useState(1);
	var [slide, slide_change] = useState(0);
    var [searchWord, setSearchWord] = useState('');

	// const getHtml = async() => {
	// 	try {
	// 		return await axios.get('https://movie.naver.com/movie/running/current.naver');
	// 	} catch (err){
	// 		console.log(err);
	// 	}
	// }
	
	useEffect(() => {

		try {
			axios.get("http://localhost:8080/public/top10")
			.then(response => {
				var json = response.data.result;
				top10_change(json);
				// console.log(json);
			})

		} catch {
			// 오류 발생시 실행
		}
	}, [page]);

    const handlerSubmit = (e) => {
        localStorage.setItem('searchWord', searchWord);
        history.push('/search');
    }

    return (
        <div className=" mt-4 main-box">
            
            <Form className='boxoffice-search' onSubmit={handlerSubmit}>
                <img src={search} className = 'boxoffice-search-button'/>
                {/* <div className= 'boxoffice-search-button text-center'>🔎</div> */}
                <Form.Group className="boxoffice-search-input">
                    <Form.Control type="text" placeholder="영화 검색" onChange={ e => {
                        setSearchWord(e.target.value);
                    }}/>
                </Form.Group>
            </Form>

            <h4 className="text-center h2">
                <img src={theater} style={{width: '40px', height : '40px', marginBottom : '5px', marginRight : '10px'}}/>
                TODAY BOXOFFICE
                <img src={theater} style={{width: '40px', height : '40px', marginBottom : '5px', marginLeft : '10px'}}/>
            </h4>
            <div className="boxoffice mt-3" style={{transform : 'translateX(' + {slide} +'%))'}}>
                <div>
                    <div className={ slide === 1 ? "boxoffice-view translate-50" : "boxoffice-view translate50"} >
                        <div className='boxoffice-cardset'>
                            {
                                top10.map((movie, i) => {
                                    return (
                                        <Card className="boxoffice-card" key={i}>
                                            <Card.Img variant="top" className="boxoffice-img" src={movie.posterUrl} />
                                            <Card.Text className={'boxoffice-rank card-' + i}>{movie.id}</Card.Text>
                                            {(() => {
                                                    switch(movie.info[4]){
                                                        case '전체 관람가' :
                                                            return <Card.Text className='boxoffice-agebadge age-all'>ALL</Card.Text>
                                                        case '12세 관람가' :
                                                            return <Card.Text className='boxoffice-agebadge age-12'>12</Card.Text>
                                                        case '15세 관람가' :
                                                            return <Card.Text className='boxoffice-agebadge age-15'>15</Card.Text>
                                                        case '청소년 관람불가' :
                                                            return <Card.Text className='boxoffice-agebadge age-19'>19</Card.Text>
                                                        default :
                                                            return null;
                                                    }
                                            })()}
                                            <Card.Body className="boxoffice-bg">
                                                <Card.Title className ="mb-3">
                                                    <div className="boxoffice-title">{movie.title}</div>
                                                    <div className="boxoffice-subtitle">{movie.subTitle}</div>
                                                </Card.Title>
                                                
                                                
                                                <Card.Text className='boxoffice-content'> {movie.info[0]}</Card.Text>
                                                <Card.Text className='boxoffice-content'>{movie.info[2]}</Card.Text>
                                                <Card.Text className='boxoffice-content'>평점⭐ : {movie.score}</Card.Text>
                                                
                                                
                                                
                                                <Card.Text className='boxoffice-content'>예매율  : <span className='boxoffice-rate'><span>{movie.rate}</span> %</span></Card.Text>

                                            </Card.Body>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='boxoffice-btn'>
                    <button className="btn before" onClick={() => {
                        slide_change(0);
                    }}>&lt;</button>
                    <button className="btn next"onClick={() => {
                        slide_change(1);
                    }}>&gt;</button>
                </div>
            </div>

            <div className="select-box mt-5">
                
                <div>
                    <img src={back_history} className='select-img'/>
                    <div className="select-right h3" style={{"textAlign" : "left"}} onClick={() => history.push('/history')}>🎬 HISTORY</div>
                </div>
                <div>
                    <img src={back_search} className='select-img'/>
                    <div className="select-left h3" style={{"textAlign" : "right"}}>Continue... </div>
                </div>
            </div>
        </div>
    
        
    )
}

export default Boxoffice;