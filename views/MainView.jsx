'use babel';

import React from 'react';
// import CreateClient from './CreateClient';
import SelectClient from './SelectClient';
// import CreateMeal from './CreateMeal';


const IndexPage = () => {
  return (<div>
    <h2>Home:</h2>
    <NavigationButton text="Add Client" link="CreateClient" />
    <NavigationButton text="Select Client" link="SelectClient"/>
    <NavigationButton text="Add Meal" link="CreateMeal"/>
  </div>);
}



class View extends React.Component {

  constructor(props) {
    super();
    this.state = {
      currentView: props.currentView
    };
  }

  componentWillReceiveProps(props) {
    this.setState({currentView: props.currentView});
  }

  render() {
    if (this.state.currentView == 'SelectClient') return <div><SelectClient/></div>
    return <div>test first</div>
  }

}


export default class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      currentView: "IndexPage"
    };
  }

  handleClick(view) {
    console.log("Click: "+view);
    this.setState({currentView: view});
  }

  render() {
    return <div>
      <h1>Informed Nutrition</h1>
      <div className="nav-buttons">
        <button onClick={this.handleClick.bind(this, "SelectClient")} >Select Client</button>
        <button onClick={this.handleClick.bind(this, "AddClient")} >Add Client</button>
        <button onClick={this.handleClick.bind(this, "AddMeal")} >Add Meal</button>
      </div>
      <View currentView={this.state.currentView}/>
    </div>;
  }
}