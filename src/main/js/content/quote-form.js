// app container
// const Input  = require( 'muicss/lib/react/input');
// const Textarea  = require( 'muicss/lib/react/textarea');
import React from 'react';
import Form  from 'muicss/lib/react/form';
import Button from 'muicss/lib/react/button';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import Input from 'muicss/lib/react/input';
import CompanyList from './company-list';
import Finance from '../tools/finance/finance';
import {connect} from 'react-redux';
import {updateData} from '../action/data';
import {updateQuote} from '../action/quote';
import { bindActionCreators } from 'redux';

class FormQuote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			quote:'AAPL',
			reporttype: 1,
			toggleSuggestionList: false,
		};
		this.changeQuote = this.changeQuote.bind(this);
		this.queryData = this.queryData.bind(this);
		this.getAnnualData = this.getAnnualData.bind(this);
		this.getQuarterlyData = this.getQuarterlyData.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.isDone = true;
		// call to warm up db
		Finance.getStatement('AAPL', new Date().getFullYear());
	}
	changeQuote(event){
		if (event && event.target){
			this.props.updateQuote((event.target.value||'').toUpperCase());
		}
	}
	handleBlur(event){
		setTimeout(()=>{
			this.setState({
				toggleSuggestionList: false
			});
		},200);
	}
	handleFocus(event){
		this.setState({
			toggleSuggestionList: true
		});
	}
	changeReportType(val){
		this.setState({
			reporttype:val
		});
	}
	getAnnualData(){
		let ticker = this.props.quote.toUpperCase();
		var now = new Date().getFullYear();
		
		this.isDone = false;

		Promise.all(
			[1].map((yrsAgo)=>Finance.getStatement(ticker, now-yrsAgo))
		)
		.then(data=>{
			this.isDone = true;
			let filteredData= data[0].filter(d=>d.date.length===4);
			this.props.updateData(filteredData);
		}).catch(error => { 
			this.isDone = true;
		});
	}
	getQuarterlyData(){
		let ticker = this.props.quote.toUpperCase();
		var now = new Date().getFullYear();
		var queries = [];
		
		this.isDone = false;
		
		[1].forEach(yrAgo=> {
			[1].forEach(season=>{
				queries.push(Finance.getStatement(ticker, now-yrAgo, season));
			});
		});

		Promise.all(queries)
		.then(data=>{
			this.isDone = true;
			let filteredData= data[0].filter(d=>d.date.length>4);
			this.props.updateData(filteredData);
		}).catch(error => { 
			this.isDone = true;
		});
	}
  queryData (event) {
		event.preventDefault();
		if (typeof this.props.quote !== 'string' || this.props.quote ===''){
			return;
		}
		if (this.state.reporttype===1) {
			console.log("year");
			this.getAnnualData();
		} else {
			console.log("quarter");
			this.getQuarterlyData();
		}
  }
  render() {
	var reporttype = (this.state.reporttype ===1)? 'Annual':'Quarter';
	var extraLinks = [];
	var suggestionList = [];
	var button = [];
	var self = this;

	if (this.props.quote) {
		extraLinks.push(<DropdownItem key={'0'} target="_blank" link={'https://www.cnbc.com/quotes/?symbol='+this.props.quote}>CNBC »</DropdownItem>);
		extraLinks.push(<DropdownItem key={'1'} target="_blank" link={'http://quotes.wsj.com/'+this.props.quote+'/research-ratings'}>WSJ »</DropdownItem>);
		extraLinks.push(<DropdownItem key={'2'} target="_blank" link={'http://finance.google.com/finance?q='+this.props.quote}>GOOGLE »</DropdownItem>);
	}
	if(self.state.toggleSuggestionList){
		suggestionList.push(<CompanyList key={'3'}/>);
	}

	if(this.isDone){
		button.push(<Button className="mui--pull-right" variant="raised" type="submit" color="primary">Search</Button>)
	} else {
		button.push(<Button className="mui--pull-right" variant="raised" color="primary" disabled>Loading</Button>);
	}

    return (
      <div className="mui-panel">
      <Form onSubmit={this.queryData}>
        <div className="row">
			<Input 	label="Ticker" floatingLabel={true} value={this.props.quote} 
					onChange={self.changeQuote} onBlur={this.handleBlur}
 					onFocus={this.handleFocus} />
			{suggestionList}
			<Dropdown color="default" label={reporttype}>
				<DropdownItem onClick={this.changeReportType.bind(this,1)}>Annual</DropdownItem>
				<DropdownItem onClick={this.changeReportType.bind(this,2)}>Quarter</DropdownItem>
				{extraLinks}
			</Dropdown>
			{button}
        </div>
      </Form>
      </div>
    );
  }
};

const mapStateToProps = function (state, props) {
	return state;
}

const mapActionToProps = function (dispatch, props) {
	// console.log(props);
	return bindActionCreators({
		updateData: updateData,
		updateQuote: updateQuote,
	},dispatch);
}

module.exports = connect(mapStateToProps, mapActionToProps) (FormQuote);