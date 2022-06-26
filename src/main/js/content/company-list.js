// app container
import {connect} from 'react-redux';
import {updateQuote} from '../action/quote';
const React = require('react');


class TickerList extends React.Component {
	constructor(props) {
		super(props);
		this.selectQuote = this.selectQuote.bind(this);
	}
	selectQuote(val){
		this.props.updateQuote(String(val).toUpperCase());
	}
  render() {
    var options = [];
    var self = this;
    
    if (this.props.companylist && 
      this.props.companylist.length!==0) {
        options = this.props.companylist.map(function(elm,i) {
        return (<li key={i} className="tanalysis-suggestion-item" onClick={self.selectQuote.bind(self, elm.TICKER)}> <span className="mui--text-left">{elm.TICKER}</span><span className="mui--pull-right">{elm.NAME}</span></li>)
      })

      return (
        <div className="tanalysis-suggestion-container">
          <ul className="tanalysis-suggestion-list mui-list--unstyled mui--z1">
            {options}
          </ul>
        </div>
      );
    }
    else {
      return (<div className="tanalysis-suggestion-container"></div>)
    }

    if(options.length===0|| (options.length===1&&options[0].TICKER===this.props.quote)) return(
      <div className="tanalysis-suggestion-container"></div>
    )
  }
};


const mapStateToProps = function (state, props) {
	return state;
}

const mapActionToProps = {
	updateQuote: updateQuote,
};
export default connect(mapStateToProps,mapActionToProps) (TickerList);