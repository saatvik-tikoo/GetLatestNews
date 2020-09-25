import React from 'react';
import Container from 'react-bootstrap/Container';
import styled from 'styled-components'

const Styles = styled.div`
.container-fluid {
    margin: 0px;
    padding: 0px;
    font-family: 'Roboto', sans-serif;
}
`

export const Layout = (props) => (
    <Styles>
        <Container fluid>
            {props.children}
        </Container>
    </Styles>
)