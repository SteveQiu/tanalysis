import client from '../rest/client';

class Finance {
	constructor() {}

	static get dictionary(){
		if(!this.map)this.map = new Map();
		return this.map;
	}

	static isQuarterPassed(q){
		var THRESHOLD = 0;
		var now = new Date();
		let _q1 = new Date(now.getFullYear(), 2+THRESHOLD, 31);
		let _q2 = new Date(now.getFullYear(), 5+THRESHOLD, 30);
		let _q3 = new Date(now.getFullYear(), 8+THRESHOLD, 30);
		let _q4 = new Date(now.getFullYear(), 11+THRESHOLD, 31);
		var testDate;
		switch (q) {
			case 1:
				testDate = _q1;
				break;
			case 2:
				testDate = _q2;
				break;
			case 3:
				testDate = _q3;
				break;
			default:
				testDate = _q4;
		}

		return now.getTime()>testDate.getTime();
	}

    static getStatement(ticker, year, quarter){
        return client({
            method: 'GET', 
            path: `/finance?name=${ticker}`
            // path: `/finance?name=${ticker}&year=${year}`+ ((quarter)? `&quarter=${quarter}`:'')
        })
        .then(response => {
			var res = null;
			const QUARTERLIST = ["", '-03-31', '-06-30', '-09-30', '-12-30'];

			if (!response.entity||!Array.isArray(response.entity.response)||response.entity.response.length===0){
				return res;
			}

			res = [];
			for (const statement of response.entity.response) {
				if (statement.response == null || statement.response.data.length===0) {
					continue;
				}
				let q ={};
				for (let {tag, name, value} of statement.response.data){
					q[tag.toLowerCase()] = value;
					Finance.dictionary.set(tag.toLowerCase(), name);
				}
				let timeSplit = statement.year.split("Q");
				q.date = timeSplit[0]+ QUARTERLIST[parseInt(timeSplit[1])||"0"]
				res.push(q);
			}
			console.log(res);
            return Promise.resolve(res);
		}, response=>{
			// console.log(response);
            return Promise.resolve(null);
        });
    }
    
}

export default Finance;