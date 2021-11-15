import { Button, Card, ListGroup, Row, Col, Accordion, Table} from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom';

import './MyPage.css';
import user from './img/user.png';

function App() {
    
    var [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    var [likedMovie, setLikedMovie] = useState({})

    useEffect(() => {
        axios.get('/public/createUserLike', {
			params : {
				email : userInfo.email,
			}
		}).then( result => {
			console.log(result.data.liked);
		})

    }, []);

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
                        likedMovie
                        ? <p className='no-result'>🙄 관심 작품이 없습니다!</p>
                        : 'HIHI'
                    }
                </Col>
            </Row>

        </div>
        
    )
}

// function Movie(props) {


//     return (
//         <Card  className="searchResult_movie" onClick={() => {
//             props.setModalData(props.source);
//             props.setModalState(true);
//         }} >
//             <div className="searchResult_img" >
//                 <Card.Img variant="top" src={ props.source.image === "" ? no : props.source.image } />
//             </div>
//             <Card.Body className="searchReuslt_content">
//                 <Card.Title className="searchResult_title">{props.source.title.split(/<b>|<\/b>/g).join("")}</Card.Title>
//                 <Card.Title className="searchResult_subtitle">{props.source.subtitle.split(/<b>|<\/b>/g).join("")}</Card.Title>
                
//                 <Card.Text className="searchResult_info mt-4">{props.source.director.split("|").length > 2 ? props.source.director.split("|")[0] + ' 외 ' + (props.source.director.split("|").length - 2) + '명' : props.source.director.split("|").slice(0, -1).join()} / {props.source.pubDate}</Card.Text>
//                 <Card.Text className="searchResult_info">평점⭐ {props.source.userRating}</Card.Text>
//             </Card.Body>
                
//             <div className='cover'></div>
//         </Card>
//     )

// }



export default App;