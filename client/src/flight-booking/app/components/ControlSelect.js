import React from 'react';
import ReactDOM from 'react-dom';


function ControlSelectList(props) {
	const airportsRender = _.map(props.data, (countryOpts, countryName) => {
		let firstLeter = countryName.split('')[0];
		let arr = [];
		
		arr.push(
			<li
				className="sep"
				key={countryName}  
				data-index={firstLeter}>
					{countryName}
			</li>
		);

		countryOpts.forEach((airport, i) => { 
			arr.push(
				<li
					key={airport.IATA} 
					className={(props.selectedId === airport.IATA)? 'selected' : ''}
					onClick={() => props.onOptionSelected(airport)}
				>
					{airport.IATA}, {airport.name}
				</li>);
		});

		return arr;
	});

	return (
		<ul className="select-data">
			{airportsRender}
		</ul>
	);
}

function ControlSelectIndex(props) {
	let leters = _.chain(props.data)
				.keys()
				.map(cname => cname.split('')[0])
				.uniq()
				.value();
	return (
		<ul className="select-index">
			{leters.map(leter => (
				<li 
					key={leter}
					onClick={() => props.onIndexSelected(leter)}
				>
					{leter}
				</li>
			))}
		</ul>
	);
}

class ControlSelect extends React.Component {
  	constructor(props) {
		super();
		this.state = {
		  isOpen: false,
		  airports: [],
		  selectedValue: {}
		};

		this.handleOpenControl = this.handleOpenControl.bind(this);
		this.handleCloseControl = this.handleCloseControl.bind(this);
	}

	componentDidMount() {
		// to set airports data after navigate
		this.updateStates(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.selected != this.state.selectedValue.IATA)
			this.updateStates(nextProps);
	}

	updateStates(nextProps) {
		//console.log('newProps');
		this.setState({
			airports: _.groupBy(nextProps.data, o => o.country),
			selectedValue: _.findWhere(nextProps.data, {IATA: nextProps.selected}) || {}
		});
	}

	handleOpenControl() {
		if (this.state.isOpen)
			return;
		this.setState({isOpen: true}); 
	}

	handleCloseControl() {
		this.setState({isOpen: false});
	}

	handleIndexSelected(index) {
		const $content = ReactDOM.findDOMNode(this.refs.content);
		const $selected = $content.querySelector(`.select-data .sep[data-index="${index}"]`);
		$content.scrollTop = $selected.offsetTop;
	}

	handleOptionSelected(opt) {
		this.setState({
			//selectedValue: opt,
			isOpen: false
		});

		if(this.props.onChange)
			this.props.onChange(opt.IATA);
	}

	render() {
		const clsOpen = (this.state.isOpen)? 'open' : '';
		const {IATA, name} = this.state.selectedValue || {};
		const selectedText = (IATA === undefined)? this.props.placeholder : `${IATA}, ${name}`; 

		return (
			<div className={`control select ${clsOpen}`}>
				<div className="control-head" onClick={this.handleOpenControl}>
					<i className="zmdi zmdi-flight-takeoff"></i>
					<span className="close" onClick={this.handleCloseControl}>
						<i className="zmdi zmdi-close"></i>
					</span>
					<div>
						<h6>{this.props.label}</h6>
						<span className="airport-name">{selectedText}</span>
					</div>			
				</div>
				<div className="control-body">
					<ControlSelectIndex 
						data={this.state.airports}
						onIndexSelected={index => this.handleIndexSelected(index)} 
					/>
					<div className="nano">
						<div className="nano-content" ref="content">
							<ControlSelectList 
								data={this.state.airports}
								selectedId={IATA}
								onOptionSelected={opt => this.handleOptionSelected(opt)}
							/>
						</div>
					</div>
				</div>
			</div>
			)
		}
}

export default ControlSelect;