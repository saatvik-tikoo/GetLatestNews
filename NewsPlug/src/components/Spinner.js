import React, { Component } from 'react'
import BounceLoader from "react-spinners/BounceLoader";
import styled from 'styled-components'


const Styles = styled.div`
    .override {
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .loading-text {
        margin-left: -15px;
    }
    @media screen and (max-width: 600px) {
        .override {
            position: relative;
            padding-top: 20%;
        }
    }
`

export default class Spinner extends Component {
    render() {
        return (
            <Styles>
                <div className="override">
                    <BounceLoader
                        size={20}
                        color={"#123abc"}
                    />
                    <div className="loading-text">Loading</div>
                </div>
            </Styles>
        )
    }
}
