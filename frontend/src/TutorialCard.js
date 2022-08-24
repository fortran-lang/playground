import Card from 'react-bootstrap/Card';
import Editor from './Editor';
import Tutorial from './tutorial.json'
import { useState } from 'react';
import Button from 'react-bootstrap/Button'

function TutorialCard(props) {
  
  const [exercise, setExercise] = useState(0)
  const goRight = () => {
    if(exercise<Tutorial.length - 1){
    setExercise(exercise + 1)
    }
  }
  const goLeft = () => {
    if(exercise>0){
        setExercise(exercise - 1)
    }
  }
  return (
    <Card style={{ width: '100%', height: '100%' }}>
      
      <Card.Body>
        <Card.Title>{Tutorial[exercise].title}</Card.Title>
        <Editor   highlight={true}
                  value={Tutorial[exercise].code}
                  snippet={false}
                  gutter={false}
                  height={"50%"}
                  width={"100%"}/> 
        <Card.Text>
          
          {Tutorial[exercise].content}
        </Card.Text>
        
        <Button onClick={goLeft} >Prev</Button>&nbsp;
        <Button onClick={goRight}>Next</Button>
      </Card.Body>
    </Card>
  );
}

export default TutorialCard;