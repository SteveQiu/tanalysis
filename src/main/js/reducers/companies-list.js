const client = require('../tools/rest/client');
// import companies from'./data/companies';

let companies = [];

import {UPDATE_QUOTE} from '../action/quote';

function getList(value){
	var options = [],i, quote=String(value);
	var isTickerFlag, hasNameFlag,hasTickerFlag,foundTicker = false;

	if(companies.length <= 0 || quote ==='') return options;
	
	for (i = 0; i < companies.length; i++) {
		if (!companies[i]) continue;
		isTickerFlag = false; hasNameFlag = false; hasTickerFlag = false;
		// there is a related name in the data
		if (companies[i].NAME) hasNameFlag = companies[i].NAME.toUpperCase().indexOf(quote.toUpperCase())!==-1;
		// there is a related ticker in the data
		if (companies[i].TICKER) { 
			isTickerFlag = companies[i].TICKER.toUpperCase() === quote.toUpperCase();
			hasTickerFlag = companies[i].TICKER.toUpperCase().indexOf(quote.toUpperCase())!==-1;
		}
		if (isTickerFlag){
			foundTicker = true;
			options.unshift(companies[i]);
		}
		else if((hasNameFlag||hasTickerFlag)&& options.length <5){
			options.push(companies[i]);
		}
		if (foundTicker && options.length >4) break;// if we have enough suggestion
	}
	
	return options;
}

client({method: 'GET', path: '/assets/csv/companies.csv', headers: {'Accept':'text/csv'}}).done(response => {
	if (!response.entity) return null;
	var data = (typeof(response.entity)==='string')? response.entity: response.entity.data;
	var header;
	data = data.split('\n');
	header = data.splice(0,1);
	header = header[0].split(',');
	data.forEach(row => {
		var data = row.split(',');
		companies.push({
			TICKER: data[0],
			NAME: data[1],
		});
	});
});

export default function CompanyListReducer(state=[], {type , payload }) {
	switch (type) {
		case UPDATE_QUOTE:
			return getList(payload);
		default:
			return state||[];
	}
};