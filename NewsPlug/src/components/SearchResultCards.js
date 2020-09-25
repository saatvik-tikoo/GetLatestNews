import React, { Component } from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import styled from 'styled-components'
import Share from './Share';
import { Link } from 'react-router-dom'

const Styles = styled.div`
    .row: {
        max-width: 100%;
        width: 100%;
    }
    .my-container {
        margin: 15px;
    }
    .mainLink {
        text-decoration: none;
        color: black;
    }
    .my-row {
        border: 1px solid rgb(214,214,214);
        box-shadow: 0px 10px 18px rgb(214,214,214);
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 3px;
        font-size: 14px;
    }
    .my-first-row, .my-second-row {
        padding-bottom: 10px;
    }
    .my-third-row .col-8{
        margin-left: -15px
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
        font-size: 12px;
        font-weight: 400;
    }
    .shift-right {
        float: right;
    }
    .shift-left{
        float: left
    }
    .inline-data{
        display: inline;
    }
    .clickme: hover {
        cursor: pointer !important;
    }
`;

export default class SearchResultCards extends Component {
    constructor(props) {
        super(props);
        this.addcontent = this.addcontent.bind(this);
        this.state = {
            results: [],
        }
    }

    addcontent() {
        let content = []
        this.props.value.map((item, index) => {
            let dt = new Date(item.Date);
            let dd = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            let mm = dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
            let yyyy = dt.getFullYear();
            dt = yyyy + '-' + mm + '-' + dd;

            let textWidth = 0;
            let truncatedTitle = item.Title;
            if (window.innerWidth <= 700) {
                textWidth = ((window.innerWidth - 90) * 1.5) / 12.5;
            } else {
                textWidth = ((((window.innerWidth - 30) / 4) - 60) * 1.5) / 8.5;
            }
            
            if (item.Title.length > textWidth) {
                truncatedTitle = item.Title.substring(0, item.Title.substring(0, parseInt(textWidth)).lastIndexOf(' ')) + '...';
            }

            content.push(
                <Link to={{
                    pathname: '/article',
                    search: '?id=' + item.ID
                }} key={index} className="mainLink col-md-3 col-sm-12">
                    <div className="my-row">
                        <Row className="my-first-row">
                            <Col sm={12} className="headline my-italic">
                                {truncatedTitle}
                                <Share name={item.Title} value={item.Link} />
                            </Col>
                        </Row>
                        <Row className="my-second-row">
                            <Col sm={12} className="my-col-image">
                                <img src={item.Image} alt="news" />
                            </Col>
                        </Row>
                        <Row className="my-third-row">
                            <Col sm={12}>
                                <Row>
                                    <Col xs={12} className="inline-data">
                                        <div className="my-italic shift-left">{dt}</div>
                                        <div className="shift-right">
                                            <Badge style={{ backgroundColor: item.Color, color: item.FontColor }} className="news-tag">{item.Section.toUpperCase()}</Badge>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Link>
            )
        })
        return content
    }

    render() {
        return (
            <Styles>
                <Row className="my-container">
                    {this.addcontent()}
                </Row>
            </Styles>
        )
    }
}
