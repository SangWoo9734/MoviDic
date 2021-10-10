import { Navbar, Container, Nav} from 'react-bootstrap';
import React from 'react'

import { Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import whale from './img/whale.png';

import Boxoffice from './main.js'
import Search from './search.js'

function App() {

	

	return (
		<div className="App">
			<Navbar bg="dark" variant="dark">
				<Container className='text-center'>
					<Navbar.Brand href="#home">
						<img src={whale} style={{width: '40px', height : '40px'}}/>
						<span>MOVIEDIC</span>
						</Navbar.Brand>
						<Nav className="me-auto">
						<Nav.Link href="/">HOME</Nav.Link>
						<Nav.Link href="/search">SEARCH</Nav.Link>
						<Nav.Link href="#pricing">HISTORY</Nav.Link>
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
		</div>
	);
}



export default App;
