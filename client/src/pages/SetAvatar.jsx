import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { Buffer } from 'buffer'
import { ClipLoader } from 'react-spinners'
import { currentUserRoute, setAvatarRoute } from '../utils/APIRoutes'

function SetAvatar(props) {

    const api = "https://api.multiavatar.com"

    const navigate = useNavigate()

    const [avatars, setAvatars] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatar, setSelectedAvatar] = useState(undefined)

    useEffect(() => {
        async function myFunc() {
            try {
                await axios.get(currentUserRoute, {withCredentials: true})
            } catch (err) {
                navigate("/login")
            } 
        }
        myFunc()
    }, [])

    useEffect(() => {
        const data = []
        async function fetchMyAPI() {
            for(let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
                console.log(image)
                const buffer = new Buffer(image.data)
                data.push(buffer.toString("base64"))
            }
            setAvatars(data)
            setIsLoading(false)
        }
        fetchMyAPI()
    }, []);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000, 
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    const setProfilePicture = async () => {
        if(isLoading) {
            toast.error("Please wait for the Avatars to Load!", toastOptions)
            return false
        }
        if(selectedAvatar === undefined) {
            toast.error("Please select an Avatar!", toastOptions)
            return false
        }
        try {
            const {data} = await axios.post(setAvatarRoute, {
                image: avatars[selectedAvatar]
            }, {withCredentials: true})
            if(data.isSet) {
                toast.success(data.msg, toastOptions)
                navigate('/')
            } else {
                toast.error("Error setting Avatar. Please try again!", toastOptions)
                return false
            }
        } catch (err) {
            navigate("/login")
        }
    }

    return (
        <>
            <Container>
                <div className="title-container">
                    <h1>Pick an Avatar as your Profile Picture</h1>
                </div>
                {
                    isLoading ? 
                        <ClipLoader color="rgb(114, 212, 183)" loading={isLoading} size={100} /> : 
                        <div className="avatars">
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div 
                                            key={index}
                                            className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                        >
                                            <img 
                                                src={`data:image/svg+xml;base64,${avatar}`} 
                                                alt="avatar"
                                                onClick={() => setSelectedAvatar(index)} 
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                }
                <button 
                    className='submit-btn' 
                    onClick={setProfilePicture}
                >
                    Set as Profile Picture
                </button> 
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: rgb(38, 38, 38);
    height: 100vh;
    width: 100vw;
    .title-container {
        h1 {
            color: white;
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;
            }
        }
        .selected {
            border: 0.4rem solid rgb(114, 212, 183);
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
            background-color: rgb(114, 212, 183);
            transition: 0.5s ease-in-out;
        }
    }
`

export default SetAvatar