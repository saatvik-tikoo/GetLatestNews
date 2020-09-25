import React, { Component } from 'react'
import ArticleCard from './components/ArticleCard';
import CommentBoxCard from './components/CommentBoxCard';
import Spinner from './components/Spinner'

export default class Article extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
        }
    }
    componentDidMount() {
        let url;
        if (this.props.location.search.includes('nytimes')) {
            url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/nytimes/article' + this.props.location.search
        } else {
            url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/guardian/article' + this.props.location.search
        }
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                if (data.message !== 'success') {
                    console.log('Something wrong with the API call');
                } else {
                    this.setState({ results: data })
                }
            })
            .catch((error) => console.log(error))
    }
    render() {
        if (this.state.results.response && this.state.results.response.ID) {
            return (
                <React.Fragment>
                    <ArticleCard value={this.state.results.response} />
                    <CommentBoxCard value={this.state.results.response} />
                </React.Fragment>
            )
        } else {
            return (
                <Spinner />
            )
        }
    }
}
