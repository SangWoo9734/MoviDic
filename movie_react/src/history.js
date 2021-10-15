import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css';

function App() {

    var [hisDate, setHisDate] = useState(0);
    var [quote, setQuote] = useState({});
    var [movieChart, setMovieChart] = useState([]);

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

        var today = new Date();
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
    }, [hisDate])

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
        </div>
    )
}

export default App;