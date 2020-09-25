import React, { Component } from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import styled from 'styled-components'
import Share from './Share';
import Truncate from 'react-text-truncate';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'

const Styles = styled.div`
    .mainLink {
        text-decoration: none;
        color: black;
    }
    .my-row {
        border: 1px solid rgb(214,214,214);
        box-shadow: 0px 10px 18px rgb(214,214,214);
        padding-top: 15px;
        padding-bottom: 15px;
        border-radius: 3px;
        max-width: 100%;
        margin: 15px;
        min-height: 200px;
        font-size: 14px;
    }
    .my-col-image img{
        padding: 3px;
        border: 1px solid rgb(214,214,214);
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        height: 100%;
        border-radius: 3px;
    }
    .headline {
        font-weight: bold;
        font-size: large;
    }
    .description {
        text-align: justify;
        padding-top: 10px;
        padding-bottom: 20px;
    }
    .my-italic {
        font-style: italic;
    }
    .news-tag {
        font-size: 14px;
        float: right;
        font-weight: 400;
    }
`;


export default class NewsCard extends Component {
    render() {
        if (this.props.value && this.props.value.length > 0) {
            return (
                <Styles>
                    {this.props.value.map((item, index) => {
                        let dt = new Date(item.Date);
                        let dd = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
                        let mm = dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
                        let yyyy = dt.getFullYear();
                        dt = yyyy + '-' + mm + '-' + dd;
                        return (
                            <Link to={{
                                pathname: '/article',
                                search: '?id=' + item.ID
                            }} key={index} className="mainLink">
                                <Row className="my-row">
                                    <Col sm={12} md={4} className="my-col-image">
                                        <img src={item.Image} alt="news" />
                                    </Col>
                                    <Col sm={12} md={8}>
                                        <Row>
                                            <Col sm={12} className="headline my-italic">
                                                <span>{item.Title} &nbsp;</span>
                                                <Share name={item.Title} value={item.Link} />
                                            </Col>
                                            <Col sm={12} className="description">
                                                <Truncate line={3} text={item.Description} />
                                            </Col>
                                            <Col sm={12}>
                                                <Row>
                                                    <Col sm={6}><div className="my-italic">{dt}</div></Col>
                                                    <Col sm={6}><Badge style={{ backgroundColor: item.Color, color: item.FontColor }} className="news-tag">{item.Section.toUpperCase()}</Badge></Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Link>
                        )
                    })}
                </Styles>
            )
        } else {
            return (
                <Spinner />
            )
        }
    }
}
