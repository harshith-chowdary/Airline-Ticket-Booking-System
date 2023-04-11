import React from 'react';

class ControlPassengers extends React.Component {
	constructor(props) {
		super();
		this.state = {
		  	selectedOption: 'adults',
		  	adults: props.selected.adults,
			kids: props.selected.kids,
			elders: props.selected.elders
		};

		this.handleUpdateQty = this.handleUpdateQty.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
	}

	handleUpdateQty(action) {
		this.setState((prevState, props) => {
			let value = prevState[prevState.selectedOption];

			if (action === 'plus')
				value++;
			else if (value !== 0)
				value--;

			prevState[prevState.selectedOption] = value;
			
			if(this.props.onChange)
				this.props.onChange(prevState);

			//return {[prevState.selectedOption]: value};
			return prevState;
		});
	}

	handleOptionChange(evt) {
		this.setState({
			selectedOption: evt.target.value
		});
	}

  render() {
    return (
		<div className="control radio passengers">
			<i className="zmdi zmdi-accounts"></i>
			<div className="control-item">
				<h6>Passengers</h6>
				<label>
					<input type="radio" 
								value="adults" 
								checked={this.state.selectedOption === "adults"}
								onChange={this.handleOptionChange} />
					<div>
						<span>{this.state.adults}</span>&times;
						<i className="zmdi zmdi-male-alt"></i><small>Adults</small>
					</div>
				</label>
				<label>
					<input type="radio" 
								value="kids" 
								checked={this.state.selectedOption === "kids"}
								onChange={this.handleOptionChange} />
					<div>
						<span>{this.state.kids}</span>&times;
						<i className="zmdi zmdi-face"></i><small>Kids</small>
					</div>
				</label>
				<label>
					<input type="radio" 
								value="elders" 
								checked={this.state.selectedOption === "elders"}
								onChange={this.handleOptionChange} />
					<div>
						<span>{this.state.elders}</span>&times;
						<i className="zmdi zmdi-walk"></i><small>Elders</small>
					</div>
				</label>
			</div>
			<section className="spinner">
				<button onClick={() => this.handleUpdateQty('plus') }><i className="zmdi zmdi-plus"></i></button>
				<button onClick={() => this.handleUpdateQty('minus') }><i className="zmdi zmdi-minus"></i></button>
			</section>
		</div>
    )
  }
}

export default ControlPassengers;