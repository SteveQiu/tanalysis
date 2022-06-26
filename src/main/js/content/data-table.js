// app container
import React from 'react';
import Finance from '../tools/finance/finance';
import {connect} from 'react-redux';

class TableHeader extends React.Component {
	constructor(props) {
		super(props);
	}
	get decoded(){
		let str = this.props.id;
		return Finance.dictionary.get(str)||str; 
	}
  render() {
      return (
        <span>{this.decoded}</span>
      );
   }
}

class TableCell extends React.Component {
	constructor(props) {
		super(props);
		this.isNegative = this.props.number && this.props.number[0] ==='-';
		this.sign = (this.isNegative)? '-': '';
		this.isNumber = this.props.number && (this.props.number.indexOf('-')=== -1||this.props.number.indexOf('-')=== 0);
		this.unsigned = (this.props.number && this.isNumber)? this.props.number.replace('-',''):'0';
		this.units = ['','K','M','B','T','Z'];
		this.len = this.unsigned.split('.')[0].length;
		this.index = Math.floor((this.len)/3);
	}
	get unit(){
		if(!this.isNumber) return '';
		return this.units[this.index];
	}
	get number(){
		if(!this.isNumber) return this.props.number;
		return String(Number(this.unsigned)/(Math.pow(1000,this.index))).substring(0,4);
	}
	get growthRate(){
		if(Number(this.props.number)&&Number(this.props.prev)) return (Number(this.props.number)/Number(this.props.prev)*100-100);
		return null;
	}
	get growth(){
		// console.log(this.props);
		let val = this.growthRate;
		if(val) return val.toFixed(2)+'%';
		return '';
	}
	get hasGrown(){
		let current = Number(this.props.number);
		let prev = Number(this.props.prev);
		return current&&prev&& current> prev ;
	}
  render() {
			let txtColor = (this.hasGrown)? 'success-text': 'danger-text';
      return (
        <span>{this.sign}{this.number}{this.unit}<span className={txtColor}>&nbsp;{this.growth}</span> </span>
      );
   }
}

class DataTable extends React.Component {
	constructor(props) {
		super(props);
	}
  render() {
    var self = this;
		var firstRow = (Array.isArray(this.props.data.rawData)&& typeof this.props.data.rawData[0]==='object')? this.props.data.rawData[0]:{};
		var properties = Object.keys(firstRow);
		// move date to the head
		properties.splice(properties.indexOf('date'),1);
		properties.unshift('date');
		// set up header columns
		var tableHeaders = properties.map(function(item, index, array) {
			return (<th key={item}><TableHeader id={item}/></th>);
		});
		
		// setup body cell columns
     var tableContent = this.props.data.rawData.map(function(item,index, arr) {
					var c = [];
					let prev = {};
					if(index>0) prev = arr[index-1];
					for (var i = 0; i < properties.length; i++) {
						if (properties[i] === 'date') {
							c.push((<td key={properties[i]}>{item[properties[i]]}</td>));
						} else {
							c.push((<td key={properties[i]}><TableCell number={item[properties[i]]} prev={prev[properties[i]]}/> </td>));
						}
					}
	        return (
	           <tr key={index}>{c}</tr>
	        );
     });

		 var tableStyle = {'overflow':'auto'};

      return (
        <div className="mui-panel">
					<div style={tableStyle}>
	          <table className="mui-table mui-table--bordered">
	            <thead>
	              <tr>
	                {tableHeaders}
	              </tr>
	            </thead>
	            <tbody>
	              {tableContent}
	            </tbody>
	          </table>
					</div>
        </div>
      );
   }
}

const mapStateToProps = function (state, props) {
	return state;
}

export default connect(mapStateToProps) (DataTable);