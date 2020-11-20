import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import {getUser} from './../../spotify/index.js';

const LandingContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Landing = () => {

    useEffect(() => {
        console.log('I am here');
        async function testingFunction(){
            const response = await getUser();
            const data = await response.json();
            console.log(data);
        }
        testingFunction();
    })

    return(
        <LandingContainer>
        </LandingContainer>
    );
}

export default Landing;