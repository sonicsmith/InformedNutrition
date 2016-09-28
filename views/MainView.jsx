'use babel';

import React from 'react';
import NavigationButton from './NavigationButton';
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


const View = ({currentView}) => {
  // Index Page
  // if (currentView == 'SelectClient') {
  //   return (<SelectClient/>);
  // }
  // return (<IndexPage/>);
  return (<h2>{currentView}</h2>);
}


export default class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      currentView: "IndexPage"
    };
  }

  handleClick(action) {
    console.log("Click: "+action);

  }

  render() {
    return <div>
      <h1>Informed Nutrition</h1>
      <button onClick={this.handleClick.bind(this, "SelectClient")} action="SelectClient">Select Client</button>
      <View currentView={this.state.currentView}/>
    </div>;
  }
}