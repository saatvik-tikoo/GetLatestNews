import React, { Component } from 'react'
import { Modal, Col, Row, Container } from 'react-bootstrap'
import { MdShare } from 'react-icons/md';
import { EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from "react-share";

export default class Share extends Component {
    constructor(props){
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.stop = this.stop.bind(this);

        this.state = {showModal: false}

    }
    getInitialState() {
        return { showModal: false };
    }

    stop(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    handleShow(event) {
        this.setState({ showModal: true });
        event.stopPropagation();
        event.preventDefault();
    }

    render() {
        let title;
        if (this.props.name && this.props.name.Type) {
            title = <div><div>{this.props.name.Type}</div><div>{this.props.name.Title}</div></div>;
        } else {
            title = this.props.name;
        }
        return (
            <React.Fragment>
                <span style={{cursor: "pointer"}} onClick={this.handleShow}><MdShare /></span>
                <span onClick={this.stop}>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col sm={12} style={{textAlign: "center", fontWeight: "600", fontSize: "16px"}}>Share via</Col>
                            </Row>
                            <Row>
                                <Col xs={4} style={{textAlign: "center"}}>
                                    <FacebookShareButton
                                        url={this.props.value}
                                        hashtag={"#CSCI_571_NewsApp"}>
                                        <FacebookIcon size={50} round={true} />
                                    </FacebookShareButton>
                                </Col>
                                <Col xs={4} style={{textAlign: "center"}}>
                                    <TwitterShareButton
                                        url={this.props.value}
                                        hashtags={["CSCI_571_NewsApp"]}>
                                        <TwitterIcon size={50} round={true} />
                                    </TwitterShareButton>
                                </Col>
                                <Col xs={4} style={{textAlign: "center"}}>
                                    <EmailShareButton
                                        url={this.props.value}
                                        subject={"#CSCI_571_NewsApp"}>
                                        <EmailIcon size={50} round={true} />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
                </span>
            </React.Fragment>
        )
    }
}
