
import React, { useState } from 'react';
import { TextInput, Button, Paper, Container, Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const token = response.data.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.data.data));
            navigate('/universities');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <Container >
            <Grid justify="center">
                <Grid.Col >
                    <h2>Login to University Application</h2>
                    <Paper padding="md" shadow="xs">
                        <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                        <TextInput
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            style={{ marginTop: 15 }}
                        />
                        <Button fullWidth style={{ marginTop: 15 }} onClick={handleLogin}>
                            Login
                        </Button>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
}

export default Login;
