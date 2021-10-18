import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css';
import next from './img/next.png';
import before from './img/before.png';



function Boxoffice() {

    var [top10, top10_change] = useState([]);
	var [page, page_change] = useState(1);
	var [slide, slide_change] = useState(0);

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
				console.log(json);
			})

		} catch {
			// 오류 발생시 실행
		}
	}, [page]);

    return (
        <div className="container mt-4 main-box">
            <h4 className="text-center">TODAY BOXOFFICE</h4>
            <div className="boxoffice mt-4" style={{transform : 'translateX(' + {slide} +'%))'}}>
                <div className={ slide === 1 ? "boxoffice-view translate-50" : "boxoffice-view translate50"} >
                    <div className='boxoffice-cardset'>
                        {
                            top10.slice(0, 5).map((movie, i) => {
                                return (
                                    <Card className="boxoffice-card"key={i}>
                                        <Card.Img variant="top" className="boxoffice-img" src={movie.posterUrl} />
                                        <Card.Text className={'boxoffice-rank card-' + i}>{movie.id}</Card.Text>
                                        <Card.Body className="boxoffice-bg">
                                            <Card.Title >
                                                <div className="boxoffice-title">{movie.title}</div>
                                                <div className="boxoffice-subtitle">{movie.subTitle}</div>
                                            </Card.Title>
                                            
                                            
                                            <Card.Text className='boxoffice-content'> {movie.info[0]}</Card.Text>
                                            <Card.Text className='boxoffice-content'>{movie.info[2]}</Card.Text>
                                            
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
                                            
                                            <Card.Text className='boxoffice-content'>예매율 <span className='boxoffice-rate'><span>{movie.rate}</span> %</span></Card.Text>
                                            <DropdownButton id="dropdown-basic-button" title="예매하기">
                                                <Dropdown.Item href="#/action-1">CGV</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">LOTTECINEMA</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">MEGA BOX</Dropdown.Item>
                                            </DropdownButton>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </div>
                    <div className='boxoffice-cardset'>
                        {
                            top10.slice(5, 10).map((movie, i) => {
                                return (
                                    <Card className="boxoffice-card" 	key={i}>
                                        <Card.Img variant="top" className="boxoffice-img" src={movie.posterUrl} />
                                        <Card.Text className={'boxoffice-rank card-' + i}>{movie.id}</Card.Text>
                                        <Card.Body className="boxoffice-bg">
                                            <Card.Title className="boxoffice-title">
                                                <div>{movie.title}</div>
                                                <div className="boxoffice-subtitle">{movie.subTitle}</div>
                                            </Card.Title>
                                            
                                            
                                            <Card.Text className='boxoffice-content'> {movie.info[0]}</Card.Text>
                                            <Card.Text className='boxoffice-content'>{movie.info[2]}</Card.Text>
                                            
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
                                            
                                            <Card.Text className='boxoffice-content'>예매율 <span className='boxoffice-rate'><span>{movie.rate}</span> %</span></Card.Text>
                                            <DropdownButton id="dropdown-basic-button" title="예매하기">
                                                <Dropdown.Item href="#/action-1">CGV</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">LOTTECINEMA</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">MEGA BOX</Dropdown.Item>
                                            </DropdownButton>
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
                    }}><img src={before}/></button>
                    <button className="btn next"onClick={() => {
                        slide_change(1);
                    }}><img src={next}/></button>
            </div>
        </div>
    )
}

export default Boxoffice;