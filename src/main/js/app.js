'use strict';

// set up redux
import store from './store';

// console.log(store.getState());
// store.dispatch({
// 	type:'updateTerm',
// 	payload: 'QUATER'
// });
// store.dispatch({
// 	type:'updateQuote',
// 	payload:'AAPL'
// });
// console.log(store.getState());
//  ----- REDUX -----

import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Container from  'muicss/lib/react/container';
import Row from  'muicss/lib/react/row';
import Col from  'muicss/lib/react/col';
import Tabs from  'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import FormQuote from './content/quote-form';
import DataTable from'./content/data-table';
import DataGraph from './content/data-graph';
import TopNavbar from './top-nav/top-navbar';

// app container
class AppContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      appTab:1
    };
		this.updateState = this.updateState.bind(this);
		this.setState = this.setState.bind(this);
	}
  updateState (key, value) {
    var partialState = {};
    partialState[key] = value;
    this.setState(partialState);
  }
  render() {
    return (
		<Provider store={store}>
			<TopNavbar></TopNavbar>
			<Container className="main-content" fluid={true}>
				<Row>
				<Col md="12">
					<FormQuote/>
				</Col>
				<Col md="12">
					<Tabs justified={true}>
						<Tab value="pane-1" label="Graph" onClick={this.updateState.bind(this,'appTab',1)} >
							<DataGraph/>
						</Tab>
						<Tab value="pane-2" label="Table" onClick={this.updateState.bind(this,'appTab',2)} >
							<DataTable/>
						</Tab>
					</Tabs>
				</Col>
				<Col md="12">
					MIT License. ReactJS. Google MUI.
				</Col>
				</Row>
			</Container>
		</Provider>
    );
  }
}


// tag::render[]
ReactDOM.render(
	<AppContainer />,
	document.getElementById('react')
)
// end::render[]
