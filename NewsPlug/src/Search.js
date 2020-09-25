import React, { Component } from 'react';
import SearchResultCards from './components/SearchResultCards';
import Spinner from './components/Spinner'

export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
        }
    }
    componentDidMount() {
        const guardian = fetch('http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/guardian/search' + this.props.location.search)
            .then(res => res.json());
        const nytimes = fetch('http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/nytimes/search' + this.props.location.search)
            .then(res => res.json());
        Promise.all([guardian, nytimes])
            .then(([guardianData, nytimesData]) => {
                let combinedData = guardianData.response.concat(nytimesData.response);
                this.setState({ results: combinedData });
            }).catch(function (error) {
                console.log(error);
            });
    }
    componentDidUpdate(previousProps) {
        if (this.props.location.search !== previousProps.location.search) {
            const guardian = fetch('http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/guardian/search' + this.props.location.search)
                .then(res => res.json());
            const nytimes = fetch('http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/nytimes/search' + this.props.location.search)
                .then(res => res.json());
            Promise.all([guardian, nytimes])
                .then(([guardianData, nytimesData]) => {
                    let combinedData = guardianData.response.concat(nytimesData.response);
                    this.setState({ results: combinedData });
                }).catch(function (error) {
                    console.log(error);
                });
        }
    }
    render() {
        if (this.state.results && this.state.results.length > 0) {
            return (
                <React.Fragment>
                    <div style={{ fontSize: "20px", fontWeight: "bold", padding: "10px 30px 0px 30px" }}>Results</div>
                    <SearchResultCards value={this.state.results} />
                </React.Fragment>
            )
        } else {
            return (
                <Spinner />
            )
        }
    }
}