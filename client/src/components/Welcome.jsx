import React from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';

function Welcome({currentUser}) {
    return <Container>
        <img src={Robot} alt="robot" />
        <h1>Welcome, {currentUser.username}!</h1>
        <h3>Please select a chat to start messaging! </h3>
    </Container>  
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgb(218, 217, 217);
    img {
        height: 20rem;
    }
    span {
        color: #4e00ff;
    }
`

export default Welcome;