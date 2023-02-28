import Card from 'react-bootstrap/Card';

function NewlineText(props) {
	const text = props.text;
	return <div className='output-formmating'>{text}</div>;
}

function TutorialCard(props) {
	return (
		<Card
			style={
				props.theme === 'monokai'
					? { width: '100%', height: '50%', backgroundColor: '#212529', color: 'white' }
					: { width: '100%', height: '50%', backgroundColor: 'white', color: '#212529' }
			}
			className='overflow-auto'
		>
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
