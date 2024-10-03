import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { getSeasonBackground } from '../../Components/Background/Background';
import Input from '../../Components/Inputs/Input';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string>('');

    useEffect(() => {
        const seasonBackground = getSeasonBackground();
        setBackgroundImage(seasonBackground);
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', confirmPassword);

        if(!username || !email || !password || !confirmPassword){
            alert('All fields are required');
        }

        if(password.length < 8){
            alert("Password must contain at least 8 characters")
        }else{
            if(password !== confirmPassword){
                alert('Confirm password does not match')
            }
        }
        
        if (file) {
            formData.append('profile_picture', file);
        }

        try {
            await axiosClient.post('auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (selectedFile && validTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
        } else {
            alert('Please select a valid image file (jpeg, png, jpg, gif).');
            setFile(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div
            className="login-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form">
                    <div className='form-section'>
                        <Input
                            type="text"
                            label="Username:"
                            value={username}
                            handleChange={(value) => {
                                typeof value === "string" && setUsername(value);
                            }}
                            className="input-field"
                        />
                        <Input
                            type="text"
                            label="Email:"
                            value={email}
                            handleChange={(value) => {
                                typeof value === "string" && setEmail(value);
                            }}
                            className="input-field"
                        />
                        <Input
                            type="password"
                            label="Password:"
                            value={password}
                            handleChange={(value) => {
                                typeof value === "string" && setPassword(value);
                            }}
                            className="input-field"
                        />
                        <Input
                            type="password"
                            label="Confirm Password:"
                            value={confirmPassword}
                            handleChange={(value) => {
                                typeof value === "string" && setConfirmPassword(value);
                            }}
                            className="input-field"
                        />
                        <button type="submit" className="submit-button">
                            Register
                        </button>
                        <p>
                            Have an account? <a href="/login">Login</a>
                        </p>
                    </div>

                    <div
                        className="upload-container"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="upload-content">
                            <div className="upload-icon">
                                <i onClick={() => navigate(-1)}>
                                    {" "}
                                    <FontAwesomeIcon
                                        icon={faUpload}
                                        style={{ width: "30px", height: "30px" }}
                                    />{" "}
                                </i>
                            </div>
                            <p>
                                Drag & drop or{" "}
                                <span className="upload-choose">Choose profile picture</span>{" "}
                                to upload
                            </p>
                            <p className="upload-formats">PNG, JPG, JPEG</p>
                            <input
                                type="file"
                                className="upload-input"
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg"
                            />
                        </div>
                        {file && <p>Selected file: {file.name}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
