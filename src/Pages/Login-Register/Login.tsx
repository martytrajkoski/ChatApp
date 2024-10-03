import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { getSeasonBackground } from '../../Components/Background/Background';
import Input from '../../Components/Inputs/Input';

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const seasonBackground = getSeasonBackground();
        setBackgroundImage(seasonBackground);
    }, [])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [backgroundImage, setBackgroundImage] = useState<string>('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!email || !password){
            alert('All fields are required')
        }
        
        try {
            const res = await axiosClient.post('auth/login', {
                email: email,
                password: password
            });
            const token = res.data.token;
            localStorage.setItem('token', token);
            navigate('/chat');
        } catch (error) {
            console.error('Error:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})`}}>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <Input
                    type="email"
                    label='Email:'
                    value={email}
                    handleChange={(value) => {
                        typeof value === 'string' && setEmail(value);
                        }}
                    className='input-field'
                />
                <Input
                    type="password"
                    label='Password:'
                    value={password}
                    handleChange={(value) => {
                        typeof value === 'string' && setPassword(value);
                        }}
                    className='input-field'
                />
                <button type="submit" className='submit-button'>Login</button>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </form>
        </div>
    );
};

export default Login;
