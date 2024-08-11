import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Register from './Register'; // Assurez-vous que le chemin vers Register est correct

const Login = () => {
    const [state, setState] = useState({
        username: '',
        password: '',
        role: '',
        logedInName: '',
        logedFailed: '',
        flag: null,
    });
    const [showRegister, setShowRegister] = useState(false); // État pour afficher le formulaire d'inscription
    const navigate = useNavigate();

    const changeHandler = (ev) => {
        let nam = ev.target.name;
        let val = ev.target.value;
        setState({
            ...state,
            [nam]: val
        });
    }

    const submitLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', state)
            .then((response) => {
                if (response.data.length) {
                    setState({
                        ...state,
                        logedInName: response.data[0].f_name.toUpperCase() + ' ' + response.data[0].l_name.toUpperCase(),
                        role: response.data[0].role,
                        flag: 1
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    setState({
                        ...state,
                        logedFailed: response.data.message,
                        flag: 0
                    });
                }
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }

    const toggleForm = () => {
        setShowRegister(!showRegister);
    }

    let loginStatus;
    if (state.flag === 1) {
        loginStatus = <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Welcome {state.role}</strong>
        </div>
    } else if (state.flag === 0) {
        loginStatus = <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{state.logedFailed}</strong><br /> Please try again!
        </div>
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    {showRegister ? (
                        <Register /> // Afficher le formulaire d'inscription
                    ) : (
                        <Form>
                            <h2 className="text-center mb-4">Login</h2>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>User Name</Form.Label>
                                <Form.Control onChange={changeHandler} name='username' type="text" placeholder="User name" required />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onChange={changeHandler} name='password' type="password" placeholder="Password" />
                            </Form.Group>

                            <Button onClick={submitLogin} variant="primary" type="submit" className="w-100 mt-3">
                                Submit
                            </Button>
                            <Button onClick={toggleForm} variant="secondary" className="w-100 mt-2">
                                Register
                            </Button>
                        </Form>
                    )}
                    {loginStatus && <div className="mt-3">{loginStatus}</div>}
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
