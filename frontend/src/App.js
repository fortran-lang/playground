//Importing CSS, Ace Editor, Axios, Bootstrap and other components used in app
import './App.css';
import Editor from './Editor';
import { useState } from 'react';
import axios from 'axios';
import Navigationbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import InputBox from './InputBox';
import TutorialCard from './TutorialCard';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Tutorial from './tutorial.json'; //Tutorial JSON
import {
	ArrowClockwise,
	MoonStarsFill,
	PlayFill,
	Stack,
	SunFill
} from 'react-bootstrap-icons';
//Function to push \n in string to new lines
function NewlineText(props) {
	const text = props.text;
	return <div className='output-formmating'>{text}</div>;
}

var libs = [];

function App() {
	const [text, setText] = useState(''); //State to store editor code
	const [output, setOutput] = useState(''); //State to store output
	const [isLoading, setIsLoading] = useState(false); //Loading animations
	const [input, setInput] = useState(''); // user input
	const [inputOn, setinputOn] = useState(false); // toggle for input button
	const [show, setShow] = useState(false); // library modal toggle
	const [height, setHeight] = useState('calc(100vh - 72px)');
	const [potrait, setPotrait] = useState(false); // potrait view
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [stdlibOn, setstdlibOn] = useState(false); // state to store package info
	const [exercise, setExercise] = useState(0); // Tutorial Exercise
	const [showTutorial, setshowTutorial] = useState(false);
	const [theme, setTheme] = useState('monokai');
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// Handle tutorial buttons
	const goRight = () => {
		if (exercise < Tutorial.length - 1) {
			setExercise(exercise + 1);
		}

		tutfunc(Tutorial[exercise + 1].code);
	};
	const goLeft = () => {
		if (exercise > 0) {
			setExercise(exercise - 1);
		}
		tutfunc(Tutorial[exercise - 1].code);
	};

	// Switch toggle for stdlib
	const onSwitchAction = () => {
		setstdlibOn(!stdlibOn);
		if (!stdlibOn) {
			libs.push('stdlib');
		} else {
			if (libs.includes('stdlib')) {
				libs = libs.filter((item) => item !== 'stdlib');
			}
		}
	};

	//Changing code inside editor for tutorial
	const tutfunc = (TutorialCode) => {
		setText(TutorialCode);
	};
	//Tutorial Prompt
	const startTutorial = () => {
		setshowTutorial(true);
		tutfunc(Tutorial[exercise].code);
	};
	const handleInputChange = (e) => {
		e.preventDefault(); // prevent the default action
		setInput(e.target.value); // set name to e.target.value (event)
		console.log(input);
	};

	//inputbox toggle
	const handleInputBox = (e) => {
		inputOn ? setinputOn(false) : setinputOn(true);
		//setinputOn(true)
	};
	//POST request to Flask server
	const handleClick = async () => {
		setOutput('');
		setIsLoading(true);

		// POST request using axios inside useEffect React hook
		await axios
			.post(`${process.env.REACT_APP_PLAYGROUND_API_URL}/run`, { code: text, programInput: input, libs: libs })
			.then((response) => {
				setOutput(response.data.executed);
			});

		setIsLoading(false);
	};

	const handleLayout = () => {
		const container = document.querySelector('.main-container');
		const editor = document.querySelector('.my-editor');
		const options = document.querySelector('.options');
		const terminal = document.querySelector('.terminal');

		if (potrait) {
			container.style.flexDirection = 'row';
			options.classList.remove('potrait-options');
			options.style.flexDirection = 'column';
			terminal.classList.remove('w-100');
			editor.classList.remove('w-100');
			setHeight('calc(100vh - 72px)');
		} else {
			container.style.flexDirection = 'column';
			options.classList.add('potrait-options');
			options.style.flexDirection = 'row';
			terminal.classList.add('w-100');
			editor.classList.add('w-100');
			setHeight('calc((100vh - 132px) / 2)');
		}
		setPotrait(!potrait);
	};

	//reset code button
	const resetCode = () => {
		setText('');
	};

	const loadCode = () => {
		setText(urlParams.get('code'));
	};

	const handleKeyDown = (event) => {
		if (event.ctrlKey && event.keyCode === 13) {
			handleClick();
		}
	};

	const toggleTheme = () => {
		if (theme === 'monokai') {
			setTheme('solarized_light');
		} else {
			setTheme('monokai');
		}
	};

	const LayoutIcon = ({ portrait }) => {
		return (
			<div style={{
				width: "24px",
				height: "24px",
				border: "2px solid white",
				margin: "0 auto",
				borderRadius : "3px",
				transform: (portrait ? "none" : "rotate(90deg)")
			}}>
				<span style={{ border: "0.1px solid white", borderBottom: "0px" }}></span>
			</div>
		)
	}

	return (
		<div className='App' onLoad={loadCode} tabIndex={0} onKeyDown={handleKeyDown}>
			{/*Navbar*/}
			<div>
				<Navigationbar />
			</div>
			<div
				className='main-container'
				style={theme === 'monokai' ? { backgroundColor: 'black' } : { backgroundColor: 'white' }}
			>
				{/*Editor Component*/}
				<div className='my-editor' style={{ height: height }}>
					<Editor value={text} height={height} theme={theme} onChange={(value) => setText(value)} />
				</div>

				{/* Buttons */}
				<div className='options'>
					<Button title='Run' className='selector' variant='run' onClick={handleClick}>
						<PlayFill style={{ color: 'white', fontSize: '24px' }} />
					</Button>
					<Button title='Reset Editor' className='selector' onClick={resetCode}>
						<ArrowClockwise style={{ color: 'white', fontSize: '24px' }} />
					</Button>
					<Button title='Libraries' className='selector' variant='lib' onClick={handleShow}>
						<Stack style={{ color: 'white', fontSize: '24px' }} />
					</Button>
					<Button title='Layout' className='selector' variant='rotate' onClick={handleLayout}>
						<LayoutIcon portrait={potrait} />
					</Button>
					<Button
						title={theme === 'monokai' ? 'Light Mode' : 'Dark Mode'}
						className='selector'
						variant='light'
						onClick={toggleTheme}
					>
						{theme !== 'monokai' ? (
							<MoonStarsFill style={{ color: 'black', fontSize: '24px' }} />
						) : (
							<SunFill style={{ color: '#F7B011', fontSize: '24px' }} />
						)}
					</Button>
				</div>

				{/*Card component to display output*/}
				<div className='terminal' style={{ height: height }}>
					<Card
						style={
							theme === 'monokai'
								? { width: '100%', backgroundColor: '#212529', color: 'white' }
								: { width: '100%', backgroundColor: 'white', color: '#212529' }
						}
						className='overflow-auto'
					>
						<Card.Header>Output</Card.Header>
						<Card.Body>
							<Card.Text>
								{/* Spinning Animation While Request is processed */}
								{isLoading ? (
									<p className='loading'>
										<Spinner animation='border' size='sm' />
									</p>
								) : null}
								<NewlineText text={output} />
							</Card.Text>
						</Card.Body>
					</Card>
					{/*Tutorial Card Component */}
					{showTutorial ? (
						<>
							<TutorialCard title={Tutorial[exercise].title} theme={theme} content={Tutorial[exercise].content} />
							<div className='tutButton'>
								<Button onClick={goLeft}>Prev</Button>&nbsp;
								<Button onClick={goRight}>Next</Button>
							</div>
						</>
					) : (
						<Card
							style={
								theme === 'monokai'
									? { width: '100%', height: '70%', backgroundColor: '#212529', color: 'white' }
									: { width: '100%', height: '70%', backgroundColor: 'white', color: '#212529' }
							}
							className='overflow-auto'
						>
							<Card.Title style={{ padding: '0.4em' }}>Welcome to the Fortran Playground</Card.Title>
							<Card.Body>
								<p>
									Use the editor on the left to type your code, you can select your{' '}
									<span style={{ color: '#FF8E00', fontWeight: 'bold' }}>libraries </span>
									and provide <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>custom input</span> for your code
									using the respective buttons.
								</p>
								<p>
									New to Fortran?
									<p>Try our Quickstart Tutorial</p>
									<Button onClick={startTutorial}>Start</Button>
								</p>
							</Card.Body>
						</Card>
					)}
					{/* Input Box to provide input for program */}
					<br />
					<Button onClick={handleInputBox}>User Input</Button>
					{inputOn ? <InputBox value={input} onChange={handleInputChange} /> : null} {/*toggle for input */}
					{/*Library selector pop-up modal */}
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Packages</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Please select the packages you want
							<Form>
								<Form.Check
									type='switch'
									id='custom-switch'
									label='stdlib'
									onChange={onSwitchAction}
									checked={stdlibOn}
								/>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={handleClose}>
								Close
							</Button>
							<Button variant='primary' onClick={handleClose}>
								Save Changes
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>
		</div>
	);
}

export default App;
