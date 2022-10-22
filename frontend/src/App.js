//Importing CSS, Ace Editor, Axios, Bootstrap and other components used in app
import './App.css';
import Editor from './Editor';
import { useState } from 'react';
import axios from 'axios';
import Navigationbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import RunCode from './run.png'
import ResetCode from './reset.png'
import Librarylogo from './libs.png'
import InputBox from './InputBox';
import TutorialCard from './TutorialCard';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Tutorial from './tutorial.json' //Tutorial JSON

//Function to push \n in string to new lines
function NewlineText(props) {
  const text = props.text;
  return <div className='output-formmating'>{text}</div>;
}

var libs = []

function App() {
  const [ text, setText ] = useState('') //State to store editor code
  const [output, setOutput] = useState('')//State to store output
  const [isLoading, setIsLoading] = useState(false);//Loading animations
  const [ input, setInput ] = useState('') // user input
  const [inputOn, setinputOn] = useState(false) // toggle for input button
  const [show, setShow] = useState(false); // library modal toggle
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [stdlibOn, setstdlibOn] = useState(false); // state to store package info
  const [exercise, setExercise] = useState(0) // Tutorial Exercise
  const [showTutorial, setshowTutorial] = useState(false)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Handle tutorial buttons
  const goRight = () => {
    if(exercise<Tutorial.length - 1){
    setExercise(exercise + 1)
    }
      
      tutfunc(Tutorial[exercise+1].code)
      
  }
  const goLeft = () => {
    if(exercise>0){
        setExercise(exercise - 1)
    }
    tutfunc(Tutorial[exercise-1].code)
  }


  // Switch toggle for stdlib
  const onSwitchAction = () => {
    setstdlibOn(!stdlibOn);
    if(!stdlibOn){
      libs.push("stdlib")
    }
    else{
      if(libs.includes("stdlib")){
        libs = libs.filter(item => item !== "stdlib")

      }
    }

  };
  
//Changing code inside editor for tutorial
const tutfunc = (TutorialCode) =>{
  setText(TutorialCode)
}
  //Tutorial Prompt
  const startTutorial= () => {
    setshowTutorial(true)
    tutfunc(Tutorial[exercise].code)
  }
  const handleInputChange = (e) => {
    e.preventDefault(); // prevent the default action
    setInput(e.target.value); // set name to e.target.value (event)
    console.log(input)
  };

  //inputbox toggle
  const handleInputBox = (e) =>{
    inputOn ? setinputOn(false) : setinputOn(true)
    //setinputOn(true)
  }
  //POST request to Flask server
  const handleClick = async () => {
    
    setOutput('')
    setIsLoading(true);

    // POST request using axios inside useEffect React hook
    await axios.post(`${process.env.REACT_APP_PLAYGROUND_API_URL}/run`, {code : text, programInput: input, libs: libs})
               .then((response) => {setOutput(response.data.executed)});

    setIsLoading(false);

  }

    //reset code button
  const resetCode = () => {
    setText("")
  }

  const loadCode = () => {
    setText(urlParams.get('code'))
  }

  const handleKeyDown = event => {
    if(event.ctrlKey && event.keyCode === 13){
      handleClick();
    }
  };

  return (
    <div className="App" onLoad={loadCode} tabIndex={0} onKeyDown={handleKeyDown}>
      {/*Navbar*/}
      <div style={{paddingBottom: "0.5rem"}}><Navigationbar/></div> 
      <div className='code-wrapper'>
      {/*Editor Component*/}
      <Editor value={text} height={""} width={"50%"} onChange={value => setText(value)}/>
      
      {/* Buttons */}
      <div className='options'>
        
        <Button title="Reset Editor" className="selector" onClick={resetCode} ><img alt="reset button"  src={ResetCode} /></Button>
        <Button title="Libraries" className="selector" variant="lib" onClick={handleShow}><img alt="libs button"  src={Librarylogo} /></Button>
        <Button title="Run" className="selector" variant="run" onClick={handleClick}><img alt="run button" src={RunCode} /></Button>
      </div>
      <div className='run-button'>
        {/*Custom theming for bootstrap buttons*/}
        <style type="text/css">
            {`
        .btn-run {
          background-color: #734f96;
          color: white;
        }
        .btn-run:hover{
          background-color: #009900 !important;
          color: white;
        }
        .btn-run:active:focus{
          background-color: #734f96;
          color: white;
        }
        .btn-lib{
          background-color: #FF8E00;
          color: white;
        }
        .btn-lib:hover{
          background-color: #FF8E00 !important;
          color: white;
        }
        .btn-lib:active:focus{
          background-color: #ed8502;
          color: white;
        }
        `}
        </style>
        
        
      </div>
      {/*Card component to display output*/}
      <div className='terminal'>
        
          <Card style={{width:'100%'}} className="overflow-auto">
            <Card.Header>Output</Card.Header>
            <Card.Body>
              
              <Card.Text>
                {/* Spinning Animation While Request is processed */}
              {isLoading ? <p className='loading'><Spinner animation="border" size="sm" /></p> : null}
                <NewlineText text={output} />
              </Card.Text>
             
            </Card.Body>
          </Card>
          
          
          {/*Tutorial Card Component */}
          {showTutorial
           ? <>
           <TutorialCard title={Tutorial[exercise].title} content={Tutorial[exercise].content} /> 
           <div className='tutButton'><Button onClick={goLeft} >Prev</Button>&nbsp;
           <Button onClick={goRight}>Next</Button></div>
            </>
          
           : 
           <Card>
           <Card.Title style={{padding: '0.4em'}}>Welcome to the Fortran Playground</Card.Title>
           <Card.Body>
              <p>Use the editor on the left to type your code,
               you can select your <span style={{color: "#FF8E00", fontWeight: "bold" }}>libraries </span>
                and provide <span style={{color: "#0d6efd", fontWeight: "bold" }}>custom input</span> for your code
                using the respective buttons.</p> 
               <p>New to Fortran?
                 <p>Try our Quickstart Tutorial</p>
                 <Button onClick={startTutorial}>Start</Button>
               </p>
          </Card.Body>
         </Card>
           
          }     
          
          {/* Input Box to provide input for program */}
          <br/>
          <Button onClick={handleInputBox}>User Input</Button>
          {inputOn ? <InputBox value={input} onChange={handleInputChange}/> : null} {/*toggle for input */}

                
          
            
          {/*Library selector pop-up modal */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Packages</Modal.Title>
              </Modal.Header>
              <Modal.Body>Please select the packages you want
                    <Form>
                            <Form.Check 
                              type="switch"
                              id="custom-switch"
                              label="stdlib"
                              onChange={onSwitchAction}
                              checked={stdlibOn}
                            />
                    </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
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
