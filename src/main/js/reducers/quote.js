import {UPDATE_QUOTE} from '../action/quote';

export default function quoteReducer(state='', {type , payload }) {
	switch (type) {
		case UPDATE_QUOTE:
			return payload;
		default:
			return state||'';
	}
};