import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from "react-share";
import { Link } from "react-scroll";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactTooltip from 'react-tooltip'

const Styles = styled.div`
    .my-row {
        border: 1px solid rgb(214,214,214);
        box-shadow: 0px 10px 40px rgb(210,210,210);
        padding: 15px;
        max-width: 100%;
        margin: 15px;
        font-size: 18px;
    }
    .my-col-image img{
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        height: 100%;
    }
    .headline {
        font-weight: bold;
        width: 100%;
        max-width: 100%;
        font-size: 25px;
    }
    .description {
        text-align: justify;
        padding-top: 10px;
        padding-bottom: 20px;
    }
    .my-italic {
        font-style: italic;
    }
    .shift-right {
        float: right;
    }
    .middle-row {
        margin: 10px 0px 10px 0px;
    }
    .my-bookmark {
        color: red;
    }
    .toast-container {
        color: black !important;
    }
`;

export default class ArticleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            direction: 'down',
            isBookmarked: false,
        };
        this.handleChanged = this.handleChanged.bind(this);
        this.storeBookMarks = this.storeBookMarks.bind(this);
    }

    storeBookMarks(id, isBookmarked) {
        let self = this;
        return function () {
            let value = self.props.value
            let bookmarks = JSON.parse(window.localStorage.getItem("bookmarks"));
            let start_message = '';
            if (!isBookmarked) {
                bookmarks.push({
                    'ID': value.ID,
                    'Title': value.Title,
                    'Image': value.Image,
                    'Date': value.Date,
                    'Color': value.Color,
                    'FontColor': value.FontColor,
                    'Section': value.Section,
                    'Type': value.Type,
                    'Type_color': value.Type_color,
                    'Type_FontColor': value.Type_FontColor,
                    'Link': value.Link
                });
                start_message = "Saving ";
            } else {
                bookmarks = bookmarks.filter(record => record.ID !== id);
                start_message = "Removing ";
            }
            window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            toast(start_message + value.Title, {
                position: toast.POSITION.TOP_CENTER
            });
            self.setState({ isBookmarked: isBookmarked });
        }
    }

    handleChanged() {
        if (this.state.direction === 'down') {
            this.setState({
                direction: 'up'
            });
        } else if (this.state.direction === 'up') {
            this.setState({
                direction: 'down'
            });
        }
    }

    render() {
        let dt = new Date(this.props.value.Date);
        let dd = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        let mm = dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
        let yyyy = dt.getFullYear();
        dt = yyyy + '-' + mm + '-' + dd;

        let desc = this.props.value.Description.split('.');
        let initial_desc = '', remaining_desc = '';
        let line_count = 0;
        for (let i = 0; i < desc.length && line_count < 4; i++) {
            if (desc[i].trim() !== '') {
                initial_desc += desc[i].trim() + '. ';
                line_count++;
            }
        }
        for (let i = line_count; i < desc.length; i++) {
            if (desc[i].trim() !== '') {
                remaining_desc += desc[i].trim() + '. ';
                line_count++;
            }
        }
        if (remaining_desc.length < 5) {
            initial_desc += remaining_desc;
            remaining_desc = "";
        }
        if (remaining_desc[0] === ' ') {
            remaining_desc = remaining_desc.substring(0, remaining_desc.length - 1);
        }

        if (this.props.value.Image.substring(0, 4) !== 'http' && this.props.value.ID.includes('nytimes')) {
            this.props.value.Image = 'https://nyt.com/' + this.props.value.Image
        }
        let button, extraText;
        if (this.state.direction === 'down') {
            if (remaining_desc.length > 0) {
                button = <Link activeClass="active" to="my-desc" spy={true} smooth={true} offset={50} duration={500}>
                    <MdKeyboardArrowDown className="shift-right" size={25} onClick={this.handleChanged} />
                </Link>
                extraText = ''
            } else {
                button = ''
            }
        } else {
            if (remaining_desc.length > 0) {
                extraText = <p>{remaining_desc}</p>
                button = <Link activeClass="active" to="my-top" spy={true} smooth={true} offset={50} duration={500}>
                    <MdKeyboardArrowUp className="shift-right" size={25} onClick={this.handleChanged} />
                </Link>;
            } else {
                button = ''
            }
        }
        let bookmark_button = '';
        let bookmarks = JSON.parse(window.localStorage.getItem("bookmarks"));
        let rec_art = bookmarks.filter(record => record.ID === this.props.value.ID);
        if (rec_art.length > 0) {
            bookmark_button = <MdBookmark data-tip="Bookmark" data-place="top"
                className="shift-right my-bookmark" size={25}
                onClick={this.storeBookMarks(this.props.value.ID, true)} />
        } else {
            bookmark_button = <MdBookmarkBorder data-tip="Bookmark" data-place="top"
                className="shift-right my-bookmark" size={25}
                onClick={this.storeBookMarks(this.props.value.ID, false)} />
        }

        return (
            <Styles>
                <div className="my-row" id="my-top">
                    <ToastContainer hideProgressBar={true} transition={Zoom}
                        toastClassName="toast-container" autoClose={2000} />
                    <ReactTooltip />
                    <Row key={0}>
                        <Col sm={12} className="headline my-italic">
                            <span>{this.props.value.Title} &nbsp;</span>
                        </Col>
                    </Row>
                    <Row className="middle-row">
                        <Col xs={5} md={9} className="my-italic">
                            {dt}
                        </Col>
                        <Col xs={5} md={2}>
                            <div className="shift-right">
                                <FacebookShareButton
                                    url={this.props.value.Link}
                                    hashtag={"#CSCI_571_NewsApp"}
                                    data-tip="Facebook" data-place="top">
                                    <FacebookIcon size={25} round={true} />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={this.props.value.Link}
                                    hashtags={["CSCI_571_NewsApp"]}
                                    data-tip="Twitter" data-place="top">
                                    <TwitterIcon size={25} round={true} />
                                </TwitterShareButton>
                                <EmailShareButton
                                    url={this.props.value.Link}
                                    subject={"#CSCI_571_NewsApp"}
                                    data-tip="Email" data-place="top">
                                    <EmailIcon size={25} round={true} />
                                </EmailShareButton>
                            </div>
                        </Col>
                        <Col xs={2} md={1}>
                            {bookmark_button}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="my-col-image">
                            <img src={this.props.value.Image} alt="news" />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="description">
                            <p>{initial_desc}</p>
                        </Col>
                        <Col id="my-desc" sm={12} className="description">
                            {extraText}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {button}
                        </Col>
                    </Row>
                </div>
            </Styles >
        )
    }
}
