import Card from 'react-bootstrap/Card';



function NewlineText(props) {
  const text = props.text;
  return <div className='output-formmating'>{text}</div>;
}


function TutorialCard(props) {


  return (
    <Card style={{ width: '100%', height: '50%' }} className="overflow-auto">

      <Card.Body>
        <Card.Title>{props.title}</Card.Title>

        <Card.Text>
          <NewlineText text={props.content} />
        </Card.Text>

      </Card.Body>
    </Card>
  );
}

export default TutorialCard;
