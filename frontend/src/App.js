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

function NewlineText(props) {
  const text = props.text;
  return <div className='output-formmating'>{text}</div>;
}


function App() {
  const [ text, setText ] = useState('') //State to store editor code
  const [output, setOutput] = useState('')//State to store output
  const [isLoading, setIsLoading] = useState(false);//Loading animations
  const [ input, setInput ] = useState('')
  const [inputOn, setinputOn] = useState(false)

  
  const handleInputChange = (e) => {
    e.preventDefault(); // prevent the default action
    setInput(e.target.value); // set name to e.target.value (event)
    console.log(input)
  };

  const handleInputBox = (e) =>{
    {inputOn ? setinputOn(false) : setinputOn(true)}
    //setinputOn(true)
  }
  //POST request to Flask server
  const handleClick = async () => {
    
    setOutput('')
    setIsLoading(true);
      // POST request using axios inside useEffect React hook
            await axios.post('http://127.0.0.1:5000/run', {code : text, programInput: input})
          .then((response) => {setOutput(response.data.executed)});
          setIsLoading(false);
  }

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

          <TutorialCard />
          {/* Input Box to provide input for program */}
          {/*<InputBox value={input} onChange={handleInputChange}/> */}
          <Button onClick={handleInputBox}>INPUT</Button>
          {inputOn ? <InputBox value={input} onChange={handleInputChange}/> : null}
          
      </div>
      
      </div>
    </div>
  );
}

export default App;
