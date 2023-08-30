import React from "react";
import styled from "styled-components";

const Page = styled.main`
    padding: 2rem;
    color: #FFFFFF
`;

const HomePage = ()=>
{
    return (
        <Page>
            <h1>API Caching</h1>
        </Page>
    );
};

export default HomePage;