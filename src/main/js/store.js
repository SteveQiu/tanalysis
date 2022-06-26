import {createStore, applyMiddleware, compose,combineReducers} from 'redux';
import quoteReducer from './reducers/quote';
import dataReducer from './reducers/data';
import companylistReducer from './reducers/companies-list';
import thunk from 'redux-thunk';

const allReducers = combineReducers({
	quote: quoteReducer,
	data: dataReducer,
	companylist: companylistReducer,
});
const middleWare = compose( applyMiddleware(thunk));
const initState = {};
const store = createStore(allReducers, initState, middleWare);

export default store;