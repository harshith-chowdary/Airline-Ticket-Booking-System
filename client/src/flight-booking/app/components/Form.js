import React from 'react';
import { Link } from 'react-router-dom';
import ControlPassengers from './ControlPassengers';
import ControlSelect from './ControlSelect';
import ControlRadio from './ControlRadio';
import ControlDate from './ControlDate';


class Form extends React.Component {
	componentDidMount() {
    	this.props.setCurrentPath(location.pathname);
  	}

	render() {
		const {from, to, date, passengers, fclass} = this.props.formData;
		return (
		  <div className="content">
		    <div className="form">
		    	<ControlSelect 
		    		data={this.props.airports} 
		    		label="From" 
		    		placeholder="Your departure place"
					selected={from}
					onChange={(v) => this.props.onFormChanged('from', v)} 
		    	/>
		    	<ControlSelect
		    		data={this.props.airports} 
		    		label="To" 
		    		placeholder="Your destiny place" 
					selected={to}
					onChange={(v) => this.props.onFormChanged('to', v)}
		    	/>
		    	<ControlDate 
					selected={date}
					onChange={(v) => this.props.onFormChanged('date', v)} 
				/>
		    	<ControlPassengers 
					selected={passengers}
					onChange={(v) => this.props.onFormChanged('passengers', v)} 
				/>
		    	<ControlRadio 
					selected={fclass}
					onChange={(v) => this.props.onFormChanged('fclass', v)} 
				/>

		    	<div className="control">
					<Link className='btnSearch' to='/flights'>Search Flights</Link>
				</div>

		    </div>
		  </div>
		);
  	}
}

export default Form;