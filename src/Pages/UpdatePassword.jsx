import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import logo from '../assets/new-dx-logo-updated.png';
import backgroundImg from '../assets/background.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdatePassword = () => {
    const navigate = useNavigate();
    // const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const { setEmployee } = useUser();

    // const handleLogin = async (e) => {
    //     e.preventDefault();

    //     if (!password) {
    //         toast.error('Password cannot be empty');
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const response = await axiosInstance.post('/employee/login-temp', {
    //             email: email,
    //             password: password,
    //         });

    //         const token = response.data.token;
    //         localStorage.setItem('authToken', token);
    //         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //         console.log('Token in Header:', axiosInstance.defaults.headers.common['Authorization']);

    //         if (response.status === 200) {
    //             const empData = response.data.employee;

    //             toast.success('Login successful!');
    //             setEmployee(empData);
    //             localStorage.setItem('employee', JSON.stringify(empData));
    //             navigate('/dashboard/home');
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || 'Login failed');
    //         console.log(error.response?.data?.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!password || !repassword) {
            toast.error('Please fill both fields');
            return;
        }

        if (password !== repassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await axiosInstance.post('/employee/change-password', {
                password: password,
            });

            toast.success(response.data.message);
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password change failed');
            console.log(error)
        }
    };


    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="card shadow p-4 customLoginCard" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" className="mb-3 mainLogo" />
                    <h4 className="fw-bold heading">Update Password</h4>
                    <p className="text-white">Change your password</p>
                </div>

                <form onSubmit={handleChangePassword}>
                    {/* <div className="mb-3">
                        <label htmlFor="employeeId" className="form-label">Member ID</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div> */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label">New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer' }}
                        >
                            {showPassword ? <FaEyeSlash color='#000' /> : <FaEye color='#000' />}
                        </span>
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="repassword" className="form-label">Confirm New Password</label>
                        <input
                            type={showRePassword ? "text" : "password"}
                            className="form-control"
                            id="repassword"
                            placeholder="Please re-enter your new password"
                            value={repassword}
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowRePassword(!showRePassword)}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer' }}
                        >
                            {showRePassword ? <FaEyeSlash color='#000' /> : <FaEye color='#000' />}
                        </span>
                    </div>
                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary loginBtn"
                            disabled={loading}
                        >
                            {loading ? 'Wait...' : 'Change password'}
                        </button>
                    </div>

                    {/* <div className="text-center mt-3">
                        <p className="text-white">or</p>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {
                                console.log('Google Login Failed');
                                toast.error('Google Login Failed');
                            }}
                        />
                    </div> */}
                </form>
            </div>
        </div>
    )
}

export default UpdatePassword