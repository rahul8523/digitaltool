/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import logo from '../assets/new-dx-logo-updated.png';
import backgroundImg from '../assets/background.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate } from "react-router-dom";

const EmployeeLogin = () => {

  const employee = localStorage.getItem("employee");

  if (employee) {
    return <Navigate to="/dashboard/home" replace />;
  }

  const navigate = useNavigate();
  // const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const { setEmployee } = useUser();

  //  Google Login Logic
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      const response = await axiosInstance.post('/employee/google-login', {
        token: googleToken,
      });

      if (response.status === 200) {
        const token = response.data.token; // backend returns custom JWT
        const empData = response.data.employee;

        localStorage.setItem('googleToken', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast.success('Google login successful!');
        setEmployee(empData);
        localStorage.setItem('employee', JSON.stringify(empData));
        navigate('/dashboard/home');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  // ✅ Regular Login
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   if (!employeeId || !password) {
  //     toast.warn('Please enter both Member ID and Password');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await axiosInstance.post('/employee/login-temp', {
  //       emp_id: employeeId,
  //       password: password,
  //     });

  //     const token = response.data.token;
  //     localStorage.setItem('authToken', token);
  //     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  //     if (response.status === 200) {
  //       const empData = response.data.employee;

  //       toast.success('Login successful!');
  //       setEmployee(empData);
  //       localStorage.setItem('employee', JSON.stringify(empData));
  //       navigate('/dashboard/home');
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Login failed');
  //     console.log(error.response?.data?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // New Login testing
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn('Please enter both Email and Password');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/employee/login-temp', {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem('authToken', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token in Header:', axiosInstance.defaults.headers.common['Authorization']);

      if (response.status === 200) {
        const empData = response.data.employee;

        toast.success('Login successful!');
        setEmployee(empData);
        localStorage.setItem('employee', JSON.stringify(empData));
        navigate('/dashboard/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
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
          <h4 className="fw-bold heading">Member Login</h4>
          <p className="text-white">Access your task dashboard by logging in</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="employeeId" className="form-label">Member ID</label>
            {/* <input
              type="text"
              className="form-control"
              id="employeeId"
              placeholder="Enter your Member ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            /> */}
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showpassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showpassword)}
              style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer' }}
            >
              {showpassword ? <FaEyeSlash color='#000' /> : <FaEye color='#000' />}
            </span>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary loginBtn"
              disabled={loading}
            >
              {loading ? 'Wait...' : 'Login'}
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-white">or</p>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log('Google Login Failed');
                toast.error('Google Login Failed');
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
