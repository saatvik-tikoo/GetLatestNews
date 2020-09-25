import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import World from './World';
import Politics from './Politics';
import Business from './Business';
import Technology from './Technology';
import Sports from './Sports';
import Article from './Article';
import Search from './Search';
import Favorites from './Favorites';
import NoMatch from './NoMatch';
import { Layout } from './components/Layout'
import NavigationBar from './components/Navigation'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuardian: null,
      showToggle: true,
      showArticlePage: false,
    }
    this.myCallback = this.myCallback.bind(this);
    this.showToggleSwitch = this.showToggleSwitch.bind(this);
    if (!localStorage.getItem("bookmarks")) {
      window.localStorage.setItem("bookmarks", JSON.stringify([]))
    }
  }

  myCallback(dataFromChild) {
    this.setState({ isGuardian: dataFromChild });
  }

  showToggleSwitch() {
    let allowed = ['/', '/world', '/politics', '/business', '/technology', '/sports'];
    if (allowed.indexOf(window.location.pathname) >= 0) {
      if (!this.state.showToggle) {
        this.setState({showToggle: true});
      }
    } else {
      if (this.state.showToggle) {
        this.setState({showToggle: false});
      }
      if ('/article' === window.location.pathname) {
        if (!this.state.showArticlePage){
          this.setState({showArticlePage: true});
        }
      } else {
        if (this.state.showArticlePage){
          this.setState({showArticlePage: false});
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Layout>
          <Router>
            <NavigationBar parentCallback={this.myCallback} showToggleSwitch={this.state.showToggle} showArticlePage={this.state.showArticlePage}/>
            <Switch>
              <Route exact path='/' render={props => {this.showToggleSwitch(); return(<Home {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/world' render={props => {this.showToggleSwitch(); return(<World {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/politics' render={props => {this.showToggleSwitch(); return(<Politics {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/business' render={props => {this.showToggleSwitch(); return(<Business {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/technology' render={props => {this.showToggleSwitch(); return(<Technology {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/sports' render={props => {this.showToggleSwitch(); return(<Sports {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/article' render={props => {this.showToggleSwitch(); return(<Article {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/search' render={props => {this.showToggleSwitch(); return(<Search {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route path='/favorites' render={props => {this.showToggleSwitch(); return(<Favorites {...props} isGuardian={this.state.isGuardian} />)}} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
