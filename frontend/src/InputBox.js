import Form from 'react-bootstrap/Form'

export default function InputBox(props){
    

    
    return(
        <>
            <Form>
                <Form.Group>
                    <Form.Control placeholder="Enter your input..." value={props.value} onChange={props.onChange} as="textarea" rows={3} />
                </Form.Group>
            </Form>
        </>
    )
}