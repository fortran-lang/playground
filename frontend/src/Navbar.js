import logo from "./fortran-logo.png"
import Navbar from 'react-bootstrap/Navbar'
import Nav from  'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
export default function Navigationbar(){
    return(
                <>
        
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="#home">
                <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />{' '}
            Fortran Playground
            </Navbar.Brand>
            </Container>
            <Nav.Link href="https://fortran-lang.org/learn/" target="_blank" rel="noopener noreferrer" ><span className="linkText">Learn</span></Nav.Link>
        <Nav.Link href="https://fortran-lang.org/" target="_blank" rel="noopener noreferrer" ><span className="linkText">Home</span></Nav.Link>
        </Navbar>
        
        </>
    )
}