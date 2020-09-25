import React, { Component } from 'react'
import commentBox from 'commentbox.io';
import styled from 'styled-components';

const Styles = styled.div`
    .my-comments-box {
        margin: 15px;
    }
`

export default class CommentBoxCard extends Component {
    componentDidMount() {
        this.removeCommentBox = commentBox('5688654395604992-proj');
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }
    render() {
        return (
            <Styles>
                <div className="commentbox my-comments-box" id={this.props.value.ID} />
            </Styles>
        )
    }
}
