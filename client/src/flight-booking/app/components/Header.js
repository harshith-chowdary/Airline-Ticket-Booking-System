import React from 'react';

class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			fromRotate: '',
			toRotate: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.from !== this.props.from) {
			this.setState({ fromRotate: 'rotate' });
			setTimeout(() => this.setState({ fromRotate: '' }), 900);
		}
		if (nextProps.to !== this.props.to) {
			this.setState({ toRotate: 'rotate' });
			setTimeout(() => this.setState({ toRotate: '' }), 900);
		}
	}

  render() {
		const {fromRotate, toRotate} = this.state;
    return (
      <div className='header'>
        <div className="bg"></div>
				<div className="filter"></div>
				<div className="title">
					<div className={`fromPlace ${fromRotate}`}>
						{this.props.from.split('').map((v, i) => <span key={i}>{v}</span>)}
					</div>
					<span className="separator"><i className="zmdi zmdi-airplane"></i></span>
					<div className={`toPlace ${toRotate}`}>
						{this.props.to.split('').map((v, i) => <span key={i}>{v}</span>)}
					</div>
				</div>
				<div className="map"></div>
      </div>
    )
  }
}

export default Header;