import { Navbar, Container, Nav, Modal, Button, Form} from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import whale from './img/whale.png';
import google from './img/google.png';

import Boxoffice from './main.js';
import Search from './search.js';
import History from './history.js';
import { authService, firebaseInstance } from './fbase';

function App() {

	var [loginModal, setLoginModal] = useState(false);
	var [loginState, setLoginState] = useState(false);
	var [userInfo, setUserInfo] = useState({});

	const onLogOutClick = () => {
		authService.signOut();
		setLoginState(false);
		setUserInfo({});
	}

	return (
		<div className="App">
			<Navbar bg="dark" variant="dark">
				<Container className='text-center'>
						<Navbar.Brand href="/">
							<img src={whale} style={{width: '40px', height : '40px', marginRight : '10px'}} />
							<span>MOVIDIC</span>
						</Navbar.Brand>
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav className="me-auto">
								{/* <Nav.Link href="/search">SEARCH</Nav.Link>
								<Nav.Link href="/history">HISTORY</Nav.Link> */}
								{
									loginState
									? <Nav.Link href="/my">MY</Nav.Link>
									: null
								}
								
							</Nav>
							<Nav>
								{
									loginState
									? <button className='btn btn-primary' onClick={() => {
										onLogOutClick();
										alert('로그아웃 되었습니다.');
									}}>LOGOUT</button>
									: <button className='btn btn-primary' onClick={() => {setLoginModal(true)}}>LOGIN</button>
								}
								
							</Nav>

						</Navbar.Collapse>
						
				</Container>
			</Navbar>

			
			< Login show = {loginModal} onHide={() => setLoginModal(false)} setLoginState={setLoginState} setUserInfo={setUserInfo}/>
			
			<BrowserRouter>
				<Switch>
					<Route exact path={"/"} component={Boxoffice} />
					<Route exact path={"/search"} component={Search} />
					<Route exact path={"/history"} component={History} />
				</Switch>
			</BrowserRouter>

			{/* <div className='footer'>
				<p>CopyRight By Sangwoo</p>
			</div> */}
		</div>
	);
}

function Login(props) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [newAcc, setNewAcc] = useState(true);

	const onChange = (e) => {
		const {target : {name, value}} = e;
		if (name === 'email'){
			setEmail(value)
		} else if (name === 'password') {
			setPassword(value);
		} else if (name === 'firstName') {
			setFirstName(value);
		} else if (name === 'lastName') {
			setLastName(value);
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let data;
			if (newAcc) {
				// login
				data = await authService.signInWithEmailAndPassword(email, password);
			  } else {
				// create account
				data = await authService.createUserWithEmailAndPassword(email, password);
			  }
			console.log(data);
			setEmail('');
			setPassword('');
			props.onHide(false);
			props.setLoginState(true);
		} catch (err) {
			console.log(err);
			alert('유효한 사용자가 없습니다.');
		}
	}

	const onGoogleClick = async (event) => {
		const {target: {name}} = event;
		let provider;
		if (name === 'google') {
		  provider = new firebaseInstance.auth.GoogleAuthProvider();
		}
		const data = await authService.signInWithPopup(provider);
		console.log(data.additionalUserInfo.profile);
		props.onHide(false);
		props.setLoginState(true)
	}

	
	const toggleAccount = () => setNewAcc((prev) => !prev);
	return (
		<Modal
		show = {props.show}
		onHide = {props.onHide}
		className='login-modal'
		size="lg"
		aria-labelledby="contained-modal-title-vcenter"
		centered
		>
			<Modal.Header >
				<Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={onSubmit}>
					{
						!newAcc
						? <span><input className='login-input' name="firstName" type="text" placeholder="First Name" required value={firstName} onChange={onChange}/>
						<input className='login-input' name="lastName" type="text" placeholder="Last Name" required value={lastName} onChange={onChange}/></span>
						: 	null
					}
					<input className='login-input' name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
					<input className='login-input' name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
					
					<input  className={ newAcc ? 'btn btn-primary' : 'btn btn-success' } type="submit" value={ newAcc ? "Login" : "Create Account" } />
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button name="google" className='btn btn-secondary' onClick={onGoogleClick}><img src={google} style={{width: '20px', height : '20px', marginBottom : '5px', marginRight : '10px'}} />Login with Google</button>
				<button className={ newAcc ? 'btn btn-success' : 'btn btn-primary' } onClick={toggleAccount}>{newAcc ? "Create New Account" : "Login"}</button>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	)
}



export default App;
