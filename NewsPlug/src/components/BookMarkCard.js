import React, { Component } from 'react'
import { Row, Col, Badge } from 'react-bootstrap'
import styled from 'styled-components'
import Share from './Share';
import { Link } from 'react-router-dom'
import { MdDelete } from 'react-icons/md'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

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
    .toast-container {
        color: black !important;
    }
`;

export default class BookMarkCard extends Component {
    constructor(props) {
        super(props);
        this.addcontent = this.addcontent.bind(this);
        this.state = {
            results: [],
        }
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(item) {
        let self = this
        return function (event) {
            let bookmarks = JSON.parse(window.localStorage.getItem("bookmarks"));
            bookmarks = bookmarks.filter(record => record.ID !== item.ID);
            window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            toast("Removing " + item.Title, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
            self.setState({ results: bookmarks });
            event.stopPropagation();
            event.preventDefault();
        }
    }

    componentDidMount() {
        let bookmarks = JSON.parse(window.localStorage.getItem('bookmarks'));
        this.setState({ results: bookmarks });
    }

    addcontent() {
        let content = []
        this.state.results.map((item, index) => {
            let dt = new Date(item.Date);
            let dd = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            let mm = dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
            let yyyy = dt.getFullYear();
            dt = yyyy + '-' + mm + '-' + dd;

            let textWidth = 0;
            let truncatedTitle = item.Title;
            if (window.innerWidth <= 600) {
                textWidth = ((window.innerWidth - 90) * 1.5) / 7.5;
            } else {
                textWidth = ((((window.innerWidth - 30) / 4) - 60) * 1.5) / 8.5;
            }
            
            if (item.Title.length > textWidth) {
                truncatedTitle = item.Title.substring(0, item.Title.substring(0, parseInt(textWidth)).lastIndexOf(' ')) + '...';
            }
            let sendTOShare = {
                Type: item.Type.toUpperCase(),
                Title: item.Title
            };
            content.push(
                <Link to={{
                    pathname: '/article',
                    search: '?id=' + item.ID
                }} key={index} className="mainLink col-md-3 col-sm-12">
                    <div className="my-row">
                        <Row className="my-first-row">
                            <Col sm={12} className="headline my-italic">
                                {truncatedTitle}
                                <Share name={sendTOShare} value={item.Link} />
                                <MdDelete className="clickme" onClick={this.handleDelete(item)} />
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
                                            &nbsp;
                                            <Badge style={{ backgroundColor: item.Type_color, color: item.Type_FontColor }} className="news-tag">{item.Type.toUpperCase()}</Badge>
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
        if (this.state.results.length > 0) {
            return (
                <Styles>
                    <ToastContainer hideProgressBar={true} transition={Zoom}
                        toastClassName="toast-container" />
                    <Row className="my-container">
                        {this.addcontent()}
                    </Row>
                </Styles>
            )
        } else {
            return (
                <Styles>
                    <ToastContainer hideProgressBar={true} transition={Zoom}
                        toastClassName="toast-container" />
                    <div style={{ textAlign: "center", fontWeight: "bold", padding: "10px" }}>
                        You have no saved articles
                    </div>
                </Styles>
            )
        }
    }
}
