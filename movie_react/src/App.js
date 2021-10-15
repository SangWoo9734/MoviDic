import { Navbar, Container, Nav} from 'react-bootstrap';
import React from 'react'

import { Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import whale from './img/whale.png';

import Boxoffice from './main.js'
import Search from './search.js'
import History from './history.js'

function App() {

	

	return (
		<div className="App">
			<Navbar bg="dark" variant="dark">
				<Container className='text-center'>
						<Navbar.Brand href="/">
						<img src={whale} style={{width: '40px', height : '40px', marginRight : '10px'}} />
						<span>MOVIDIC</span>
						</Navbar.Brand>
						<Nav className="me-auto">
						<Nav.Link href="/search">SEARCH</Nav.Link>
						<Nav.Link href="/history">HISTORY</Nav.Link>
						<Nav.Link href="#pricing">MY</Nav.Link>
					</Nav>
				</Container>
			</Navbar>


			{/* <CaroselSet /> */}
			{/* <button onClick={() => {
				axios.get('local')
			}}></button> */}

			<Route exact path='/'>
				<Boxoffice />
			</ Route>

			<Route exact path='/search'>
				<Search />
			</Route>

			<Route exact path='/history'>
				<History />
			</Route>

			<div className='footer'>
				<p>CopyRight By Sangwoo</p>
			</div>
		</div>
	);
}



export default App;
