import React, { Component } from 'react';
import { Nav, Navbar, NavLink } from 'react-bootstrap';
import styled from 'styled-components';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import Switch from "react-switch";
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Search from './SearchInput';

const Styles = styled.div`
    .navbar {
        background-image:linear-gradient(90deg, #11223F, #3960AE);
    }
    .navbar-light .navbar-nav .nav-link {
        color: #5B6E99;
    }
    .navbar-brand {
        width: 30%;
    }
    .no-cursor {
        cursor: default;
    }
    .active {
        color: #ffffff !important;
    }
    .keep-white, .nav_link:hover{
        color: #ffffff !important;
    }
    .my-toggle {
        margin-top: 7px;
    }
    .hide-me {
        display: none;
    }
    @media screen and (max-width: 990px) {
        .navbar-brand {
            width: 90%;
        }
    }
    @media screen and (max-width: 600px) {
        .navbar-brand {
            width: 80%;
        }
    }
    @media screen and (max-width: 392px) {
        .navbar-brand {
            width: 75%;
        }
    }
`;

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            checked: '',
            bookmarkClicked: false,
        };
        let val = window.localStorage.getItem("isGuardian");
        if (val) {
            this.state.checked = (val === 'true') ? true : false ;
        } else {
            this.state.checked = true;
        }
        
        if (window.location.pathname === '/favorites' && !this.state.bookmarkClicked) {
            this.state.bookmarkClicked = true;
        }
        
        window.localStorage.setItem("isGuardian", this.state.checked);
        this.handleChange = this.handleChange.bind(this);
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
        window.localStorage.setItem("isGuardian", checked);
        this.props.parentCallback(checked);
    }

    handleBookmarkClick(location) {
        let self = this;
        return function(){
            if (location === '/favorites') {
                self.setState({bookmarkClicked: true});
            } else if (location !== '/favorites'){
                self.setState({bookmarkClicked: false});
            }
        }
    }

    componentWillReceiveProps() {
        if(window.location.pathname.indexOf('/favorites') === -1 ) {
            this.setState({bookmarkClicked: false});
        } else {
            this.setState({bookmarkClicked: true});
        }
    }

    render() {
        let initialText = this.props.showToggleSwitch ? <NavLink className="no-cursor keep-white">NY Times</NavLink> : null
        let toggleSwitch = this.props.showToggleSwitch ? <Switch className="react-switch my-toggle" onChange={this.handleChange} 
                                                                checked={this.state.checked}
                                                                onColor="#4595EC" uncheckedIcon={false} checkedIcon={false} /> : null
        let finalText = this.props.showToggleSwitch ? <NavLink className="no-cursor keep-white">Guardian</NavLink> : null
        
        let bookMarkIcon;

        if (this.state.bookmarkClicked) {
            bookMarkIcon = <MdBookmark className="keep-white" data-tip="Bookmark" data-place="top" size={25} />
            if (this.props.showArticlePage){
                bookMarkIcon = <MdBookmarkBorder className="keep-white" data-tip="Bookmark" data-place="top" size={25} />
            }
        } else {
            bookMarkIcon = <MdBookmarkBorder className="keep-white" data-tip="Bookmark" data-place="top" size={25} />
        }

        return (
            <Styles>
                <Navbar expand="lg">
                    <Navbar.Brand>
                        <Search />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" defaultActiveKey={window.location.pathname} activeKey={this.state.bookmarkClicked ? null : window.location.pathname}>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/' eventKey="/" onClick={this.handleBookmarkClick('/')}>Home</NavLink>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/world' eventKey="/world" onClick={this.handleBookmarkClick('/world')}>World</NavLink>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/politics' eventKey="/politics" onClick={this.handleBookmarkClick('/politics')}>Politics</NavLink>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/business' eventKey="/business" onClick={this.handleBookmarkClick('/business')}>Business</NavLink>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/technology' eventKey="/technology" onClick={this.handleBookmarkClick('/technology')}>Technology</NavLink>
                            <NavLink className="nav_link" activeClassName="active" as={Link} to='/sports' eventKey="/sports" onClick={this.handleBookmarkClick('/sports')}>Sports</NavLink>
                        </Nav>
                        <Nav>
                            <NavLink as={Link} to='/favorites' onClick={this.handleBookmarkClick('/favorites')}>{bookMarkIcon}<ReactTooltip /></NavLink>
                            {initialText}
                            {toggleSwitch}
                            {finalText}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        )
    }
}
