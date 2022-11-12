import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../assets/logo.png'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes'

function Register(props) {

    const navigate = useNavigate()

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(handleValidation()) {
            try {
                const {username, email, password} = values
                const {data} = await axios.post(registerRoute, {
                    username,
                    email,
                    password
                }, {withCredentials: true})
                if(data.status === false) {
                    toast.error(data.message, toastOptions) 
                }
                if(data.status === true) {
                    toast.success(data.message, toastOptions)
                    navigate("/setAvatar")
                }
            } catch (err) {
                navigate("/login")
            }
        }
    }

    const handleValidation = () => {
        const {username, email, password, confirmPassword} = values
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if (password !== confirmPassword) {
            toast.error(
                "Password and Confirm Password must be same!", 
                toastOptions
            )
            return false
        } else if (username.length < 3) {
            toast.error(
                "Username should be greater than 3 characters!", 
                toastOptions
            ) 
            return false
        } 
        else if (email === "") {
            toast.error(
                "Email is required!", 
                toastOptions
            ) 
            return false
        }
        else if (!regex.test(values.email)) {
            toast.error(
                "This is not a valid email format!", 
                toastOptions
            ) 
            return false
        }
        else if (password.length < 8) {
            toast.error(
                "Password should be greater that or equal to 8 characters!", 
                toastOptions
            ) 
            return false
        }
        return true
    }

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(event)=>handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>Chat App</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name='username' 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="text" 
                        placeholder="Email" 
                        name='email' 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name='password' 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        name='confirmPassword' 
                        onChange={e=>handleChange(e)}
                    />
                    <button type='submit'>Sign Up</button>
                    <span>
                        Already have an account? <Link to="/login">Login</Link>
                    </span>
                </form>
            </FormContainer>
        </>
    );

}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: rgb(38, 38, 38);
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 4rem;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: rgb(114, 212, 183);
        border-radius: 2rem;
        padding: 3rem 7rem;
        input {
            background-color: rgb(38, 38, 38);
            padding: 1rem;
            border: 0.1rem solid rgb(38, 38, 38);
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid black;
                outline: none;
            }
        }
        button {
            background-color: black;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            &:hover {
                color: black;
                background-color: rgb(237, 112, 107);
                transition: 0.5s ease-in-out;
            }
        }
        span {
            a {
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`

export default Register;