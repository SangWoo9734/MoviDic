import { Button, Card, ListGroup, Row, Col, Accordion, Table} from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom';

import './MyPage.css';
import user from './img/user.png';
import no from './img/noimage.png';

function App() {
    
    var [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    var [likedMovie, setLikedMovie] = useState(JSON.parse(localStorage.getItem('liked')));

    console.log(likedMovie)

    
    return (
        <div className='container mypage-bg'>
            <Row className=''>
                <Col className='mt-5 mypage-userinfo'>
                    <div className='mypage-userinfo-img'>
                        <img src={user}/>
                    </div>
                    <div className='mypage-userinfo-info'>
                        <p className='h2'>{userInfo.firstName + " " + userInfo.lastName}</p>
                        <p>E-mail : {userInfo.email}</p>
                    </div>
                </Col>
            </Row>
            <hr style={{width : "90%", margin : '30px auto'}}/>
            <Row className="mypage-movie">
                <p className="h3 text-center">😎 관심 작품 😎</p>
                <Col className="mt-3 mypage-movie">
                    {
                        likedMovie != {}
                        ? <LikedMovie likedMovie={likedMovie}/>
                        : <p className='no-result'>🙄 관심 작품이 없습니다!</p>
                    }
                </Col>
            </Row>

        </div>
        
    )
}

function LikedMovie(props) {
    
    const [likeMovie, setLikedMovie] = useState(props.likedMovie);

    console.log(likeMovie);
    return (
        <Row>
            {
                Object.values(likeMovie).map(function(source, i) {
                    return (
                    <Col className="mt-3 mb-2" xs={6} md={4} lg={3} key={i}>
                        <Card  className="searchResult_movie">
                            <div className="searchResult_img" >
                                <Card.Img variant="top" src={ source.image === "" ? no : source.image } />
                            </div>
                            <Card.Body className="searchReuslt_content">
                                <Card.Title className="searchResult_title">{source.title.split(/<b>|<\/b>/g).join("")}</Card.Title>
                                <Card.Title className="searchResult_subtitle">{source.subtitle.split(/<b>|<\/b>/g).join("")}</Card.Title>
                                
                                <Card.Text className="searchResult_info mt-4">{source.director.split("|").length > 2 ? source.director.split("|")[0] + ' 외 ' + (source.director.split("|").length - 2) + '명' : source.director.split("|").slice(0, -1).join()} / {source.pubDate}</Card.Text>
                                <Card.Text className="searchResult_info">평점⭐ {source.userRating}</Card.Text>
                            </Card.Body>
                            <div className='cover'></div>
                        </Card>
                    </Col>
                    )
                })
            }
        </Row>
        
    )

}



export default App;