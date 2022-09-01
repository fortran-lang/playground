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
import InputBox from './InputBox';
import TutorialCard from './TutorialCard';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


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

  {/*switch toggle for stdlib */}
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
  


  
  const handleInputChange = (e) => {
    e.preventDefault(); // prevent the default action
    setInput(e.target.value); // set name to e.target.value (event)
    console.log(input)
  };

  //inputbox toggle
  const handleInputBox = (e) =>{
    {inputOn ? setinputOn(false) : setinputOn(true)}
    //setinputOn(true)
  }
  //POST request to Flask server
  const handleClick = async () => {
    
    setOutput('')
    setIsLoading(true);
      // POST request using axios inside useEffect React hook
            await axios.post('http://127.0.0.1:5000/run', {code : text, programInput: input, libs: libs})
          .then((response) => {setOutput(response.data.executed)});
          setIsLoading(false);
  }

    //reset code button
  const resetCode = () => {
    setText("")
  }


  return (
    <div className="App">
      {/*Navbar*/}
      <div style={{paddingBottom: "0.5rem"}}><Navigationbar/></div> 
      <div className='code-wrapper'>
      {/*Editor Component*/}
      <Editor value={text} height={""} width={"50%"} onChange={value => setText(value)}/>
      
      {/* Buttons */}
      <div className='options'><Button onClick={resetCode} ><img src={ResetCode} /></Button>
      <Button variant="run" onClick={handleClick}><img src={RunCode} /></Button>
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
          background-color: #009900;
          color: white;
        }
        .btn-run:focus{
          background-color: #734f96;
          color: white;
        }
        `}
        </style>
        
        
      </div>
      {/*Card component to display output*/}
      <div className='terminal'>
        
          <Card style={{width:'100%'}} className="overflow-auto">
            <Card.Header>Terminal</Card.Header>
            <Card.Body>
              
              <Card.Text>
                {/* Spinning Animation While Request is processed */}
              {isLoading ? <p className='loading'><Spinner animation="border" size="sm" /></p> : null}
                <NewlineText text={output} />
              </Card.Text>
             
            </Card.Body>
          </Card>


          {/*Tutorial Card Component */}
          <TutorialCard />
          {/* Input Box to provide input for program */}
          <div>
          <Button onClick={handleInputBox}>Input</Button>
          {inputOn ? <InputBox value={input} onChange={handleInputChange}/> : null} {/*toggle for input */}

                
            <Button variant="primary" onClick={handleShow}>
              Libraries
            </Button>
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
    </div>
  );
}

export default App;
