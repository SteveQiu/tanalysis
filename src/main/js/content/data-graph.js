// app container
const React = require('react');
import {connect} from 'react-redux';

// google charts
google.charts.load('current', {packages: ['corechart']});

class DataGraph extends React.Component {
	constructor(props) {
		super(props);
    var self = this;
    
    google.charts.setOnLoadCallback(() =>{
      self.state.chart =  new google.visualization.LineChart(document.getElementById('curve_chart'));
      self.state.chart.draw(self.getGoogleDataTable(this.props.data.statusData), self.getConfig('Financial Status'));

      self.state.analysisChart =  new google.visualization.LineChart(document.getElementById('curve_analysis_chart'));
      self.state.analysisChart.draw(self.getGoogleDataTable(this.props.data.analysis), self.getConfig('Financial Analysis'));

      self.state.rateChart =  new google.visualization.LineChart(document.getElementById('curve_rate_chart'));
      self.state.rateChart.draw(self.getGoogleDataTable(this.props.data.rate), self.getConfig('Rate'));

      self.state.cycleChart =  new google.visualization.LineChart(document.getElementById('curve_cycle_chart'));
      self.state.cycleChart.draw(self.getGoogleDataTable(this.props.data.cycle), self.getConfig('Cycle'));

      self.state.doneInit=true;
    });
		this.state = {
      doneInit:false,
      chart:{draw:function () {}},
      analysisChart:{draw:function () {}}
    };
	}

  drawChart () {
    if (this.state.doneInit) {

			if (this.state.chart) this.state.chart.draw(this.getGoogleDataTable(this.props.data.statusData), this.getConfig('Financial Status'));
      if (this.state.analysisChart) this.state.analysisChart.draw(this.getGoogleDataTable(this.props.data.analysis), this.getConfig('Financial Analysis'));
      if (this.state.rateChart) this.state.rateChart.draw(this.getGoogleDataTable(this.props.data.rate), this.getConfig('Rate'));
      if (this.state.cycleChart) this.state.cycleChart.draw(this.getGoogleDataTable(this.props.data.cycle), this.getConfig('Cycle'));
    }
  }
  getConfig (title) {
    return {
      title: title,
      curveType: 'function',
      legend: { position: 'bottom' },
      interpolateNulls: true,
      vAxis: { format:'short'}
      // width: window.$('#curve_chart').get(0).clientWidth,//500,//window.outerWidth*0.9,
      // height: 300,//(window.outerHeight)*0.7,
      // chartArea:{width:"100%",height:"100%"}
      // chartArea:{width:"100%"}
    };
  }
  getGoogleDataTable (data) {
    var table = new google.visualization.DataTable();

    if (data&&data[0]) {
      // add columns
      var header = Object.keys(data[0]);
      header.splice(header.indexOf('date'),1);
      table.addColumn('string', 'Date');
      header.forEach(function (col) {
        table.addColumn('number', col);
      });
      header.unshift('date');
      // parse each row according to the header position
      var content= [];
      data.forEach(function (row) {
        var rowArray =header.map(function (col) {
          if (col ==='date') {
            return row[col];
          }else {
            if (parseFloat(row[col]) !== NaN) {
              return parseFloat(row[col]);
            }
            else {
              return null;
            }
          }
        });
        content.push(rowArray);
      });
			// console.log(content);
      // append all rows
      table.addRows(content);
    }else {
			// console.log('empty');
      table = google.visualization.arrayToDataTable([
           ['Year', 'Asset'],
           ['1990',  0    ]
      ]);
    }
     return table;
  }
  render() {
    this.drawChart();
      return (
        <div className="mui-panel">
          <div id="curve_chart" />
          <div id="curve_analysis_chart" />
          <div id="curve_rate_chart" />
          <div id="curve_cycle_chart" />
        </div>
      );
   }
}

const mapStateToProps = function (state, props) {
	return state;
}

export default connect(mapStateToProps) (DataGraph);