import React, { Component } from "react";
import AsyncSelect from 'react-select/lib/Async';
import _ from "lodash";
import { withRouter } from 'react-router-dom'

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            results: [], 
            selectedValue: null,
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    async handleSearchChange(value, callback) {
        try {
            const response = await fetch(
                `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=${value}`,
                {
                    headers: {
                        "Ocp-Apim-Subscription-Key": "90ec36b3c34c49d6993e17b0deb1b799"
                    }
                }
            );
            const data = await response.json();
            const resultsRaw = data.suggestionGroups[0].searchSuggestions;
            const results = resultsRaw.map(result => ({ label: result.displayText, value: result.displayText }));
            this.setState({ results });
            return (callback(this.state.results))
        } catch (error) {
            console.error(`Error fetching search ${value}`);
        }
    };

    handleChange = (value) => {
        this.setState({selectedValue: value});
        this.props.history.push({
            pathname: '/search',
            search: `?q=${value.value}`
          })
    }

    componentWillReceiveProps() {
        if(window.location.pathname.indexOf('/search') === -1 ) {
            this.setState({selectedValue: null});
        } else {
            let val = decodeURI(this.props.history.location.search.split('?q=')[1])
            this.setState({selectedValue: {label: val, value: val}});
        }
    }

    render() {
        let val = this.state.selectedValue;
        // if (this.props.cleanSearchBar === true) {
        //     val = null
        // }
        return (
            <div>
                <AsyncSelect
                    value={val}
                    loadOptions={_.debounce(this.handleSearchChange, 1000, {
                        trailing: true
                    })}
                    onChange={this.handleChange}
                    placeholder="Enter Keyword .."
                />
            </div>
        );
    }
}

export default withRouter(SearchInput);