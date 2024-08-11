import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [state, setState] = useState({
        f_name: '',
        l_name: '',
        username: '',
        password: '',
        password1: '',
        email: '',
        message: '',
        flag: null,
    });
    const navigate = useNavigate();

    const changeHandler = (ev) => {
        const { name, value } = ev.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submit = (e) => {
        e.preventDefault();
        if (state.password === state.password1) {
            if (state.email && state.username) {
                axios.post('http://localhost:3001/register', state)
                    .then((response) => {
                        if (response.data.message) {
                            setState({
                                message: response.data.message,
                                flag: 1
                            });
                        } else {
                            setState({
                                message: response.data.warning,
                                flag: 2
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("There was an error!", error);
                        setState({
                            message: 'An error occurred while registering. Please try again later.',
                            flag: 1
                        });
                    });
            } else {
                alert("Please fill all form");
            }
        } else {
            alert("Entered Passwords do not match. Please try again.");
        }
    }

    const goToLogin = () => {
        navigate('/login');
    }

    let message;
    if (state.flag === 1) {
        message = <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{state.message}</strong><br />
        </div>
    } else if (state.flag === 2) {
        message = <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{state.message}</strong><br />
            Forget Your password?<a href='#'>Click Here</a>
        </div>
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={10} className="border p-4 rounded shadow-sm">
                    {message}
                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control name='f_name' type="text" placeholder="First Name" onChange={changeHandler} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control name='l_name' type="text" placeholder="Last Name" onChange={changeHandler} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control name='username' type="text" placeholder="User Name" onChange={changeHandler} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name='email' type="email" placeholder="Enter Email" onChange={changeHandler} required />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name='password' type="password" placeholder="Password" onChange={changeHandler} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control name='password1' type="password" onChange={changeHandler} placeholder="Confirm Password" />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-2">
                            Submit
                        </Button>
                        <Button onClick={goToLogin} variant="secondary" className="w-100">
                            Back to Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
