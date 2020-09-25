import React, { Component } from 'react'
import NewsCard from './components/SectionNewsCard'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
        }
    }

    componentDidMount() {
        let url;
        let val = window.localStorage.getItem("isGuardian");
        if (val === "true") {
            url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/guardian?section=sport'
        } else {
            url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/nytimes?section=sports'
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
    componentDidUpdate(previousProps) {
        if (previousProps.isGuardian !== this.props.isGuardian) {
            let url;
            if (this.props.isGuardian === true) {
                url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/guardian?section=sport'
            } else if (this.props.isGuardian === false) {
                url = 'http://ec2-54-197-200-149.compute-1.amazonaws.com:8000/api/nytimes?section=sports'
            }
            if (this.props.isGuardian !== null) {
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
        }
    }
    render() {
        return (<NewsCard value={this.state.results.response} />)
    }
}