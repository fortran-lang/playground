import logo from "./fortran-logo.png"
import Navbar from 'react-bootstrap/Navbar'
import Nav from  'react-bootstrap/Nav'

export default function Navigationbar(){
    return(
        <Navbar className="px-3" bg="dark" variant="dark" expand="lg">
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
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="justify-content-end">
                    <Nav.Link href="https://fortran-lang.org/" target="_blank" rel="noopener noreferrer" >
                        <span className="linkText">Home</span>
                    </Nav.Link>
                    <Nav.Link href="https://fortran-lang.org/learn/" target="_blank" rel="noopener noreferrer" >
                        <span className="linkText">Learn</span>
                    </Nav.Link>
                    <Nav.Link href="https://github.com/fortran-lang/playground" target="_blank" rel="noopener noreferrer" >
                        <span className="linkText">Github</span>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
