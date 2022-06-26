const React = require('react');

module.exports = 	class TopNavbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

  render() {

		// <a className="sidedrawer-toggle mui--visible-xs-inline-block mui--visible-sm-inline-block js-show-sidedrawer">☰</a>
    return (
      <header>
        <div className="mui-appbar mui--appbar-line-height">
          <div className="mui-container-fluid">
            <div id="sidedrawer-brand" className="mui--appbar-line-height mui-btn--primary">
              <span className="sidedrawer-site-icon"></span>
              <span className="mui--text-title">Target Analysis</span>
            </div>
          </div>
        </div>
      </header>
    );
  }
};
