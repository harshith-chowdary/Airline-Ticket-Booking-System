import React from 'react';

class ControlRadio extends React.Component {
	constructor(props) {
		super();
		this.state = {
		  selectedOption: props.selected
		};

		this.handleOptionChange = this.handleOptionChange.bind(this);
	}

	handleOptionChange(evt) {
		this.setState({
			selectedOption: evt.target.value
		});

		if(this.props.onChange)
			this.props.onChange(evt.target.value);
	}

  render() {
    return (
		<div className="control radio">
			<i className="zmdi zmdi-airline-seat-recline-extra"></i>
			<div className="control-item">
				<h6 style={{marginBottom: '8px'}}>Class</h6>
				<label>
					<input type="radio" 
								value="economy" 
								checked={this.state.selectedOption === "economy"}
								onChange={this.handleOptionChange} />
					<span>Economy</span>
				</label>
				<label>
					<input type="radio" 
								value="business" 
								checked={this.state.selectedOption === "business"}
								onChange={this.handleOptionChange} />
					<span>Business</span>
				</label>
				<label>
					<input type="radio" 
								value="first_class" 
								checked={this.state.selectedOption === "first_class"}
								onChange={this.handleOptionChange} />
					<span>First Class</span>
				</label>
			</div>
		</div>
    )
  }
}

export default ControlRadio;