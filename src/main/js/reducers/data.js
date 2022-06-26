import {UPDATE_DATA} from '../action/data';
var DataProcessor = require('../tools/finance/data-processor');


export default  function termReducer(state, {type , payload} ) {
	switch (type) {
		case UPDATE_DATA:
			return new DataProcessor((Array.isArray(payload))? payload:[]);
		default:
			return new DataProcessor((Array.isArray(state))? state:[]);
	}
};