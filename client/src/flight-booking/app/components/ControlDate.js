import React from 'react';

class ControlDate extends React.Component {
  constructor(props) {
		super();
		this.state = {
		  isOpen: false,
		  dateSelected: {},
		  calendarDate: {}
		};

		this.handleSelectDate = this.handleSelectDate.bind(this);
		this.handleChangeMonth = this.handleChangeMonth.bind(this);
		this.handleOpenControl = this.handleOpenControl.bind(this);
		this.handleCloseControl = this.handleCloseControl.bind(this);
	}

	componentDidMount() {
		const today = new Date(this.props.selected);
		const [weekDay, day, monthName, year,,] = today.toUTCString().split(' ');
		const dateSelected = {
				day: today.getDate(),
				month: today.getUTCMonth(),
				year: year,
				monthName: monthName,
				weekDay: weekDay
			};
		
		this.setState(prevState => ({
			dateSelected: dateSelected,
			calendarDate: dateSelected
		}));
	}

	getFirstLastDays() {
		const {month, year} = this.state.calendarDate;
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		return {
			firstDay,
			lastDay
		};
	}

	handleChangeMonth(evt) {
		const action = evt.currentTarget.getAttribute('data-action');
		let {month, year, day} = this.state.calendarDate;
		let newMonth = (action === 'back')? month - 1 : month + 1;

		if (newMonth > 12) {
			newMonth = 1;
			year++;
		}	
		else if (newMonth < 1) {
			newMonth = 12;
			year--;
		}

		const date = new Date(year, newMonth, day);
		const [weekDay,, monthName,,,] = date.toUTCString().split(' ');
		
		this.setState(prevState => {
			return {
				calendarDate: {
					month: newMonth,
					day,
					year,
					monthName,
					weekDay
				}
			};
		});		
	}

	handleSelectDate(evt) {
		const selectedDay = evt.currentTarget.getAttribute('data-day');
		const {year, month} = this.state.calendarDate;
		const date = new Date(year, month, selectedDay);
		const [weekDay,, monthName,,,] = date.toUTCString().split(' ');

		this.setState(prevState => {
			prevState.calendarDate.day = selectedDay;
			prevState.dateSelected = {
				day: parseInt(selectedDay),
				weekDay,
				monthName,
				month,
				year
			};
			return prevState;
		});

		if(this.props.onChange)
			this.props.onChange(date.getTime());
	}

	handleOpenControl() {
		if (this.state.isOpen)
			return;
		this.setState(prevState => ({isOpen: true})); 
	}

	handleCloseControl() {
		this.setState(prevState => ({isOpen: false}));
	}

	render() {
		const _this = this;
		const clsOpen = (this.state.isOpen)? 'open' : '';
		const {monthName,year} = this.state.calendarDate;
		const {day, weekDay, monthName:selMonthName} = this.state.dateSelected;
		const {firstDay, lastDay} = this.getFirstLastDays();

		// short-circuit evaluation
		// { isVisible && <Component /> }

		let daysRender = [];
		const daysBeforeInit = firstDay.getDay();
		const len = lastDay.getDate() + daysBeforeInit;

		for(let i = 0; i < len; i++) {
			const dayNum = i - daysBeforeInit + 1;
			let span;

			if(i < daysBeforeInit) {
				span = <span key={i}></span>;
			}
			else {				
				span = (
					<span 
						key={i}
						data-day={dayNum}
						className={dayNum === day && monthName === selMonthName? 'checked' : ''}
						onClick={_this.handleSelectDate}>
						{dayNum}
					</span>
				);
			}				
			daysRender.push(span);
		}

    	return (
			<div className={`control dateinput ${clsOpen}`}>
				<div className="control-head" onClick={this.handleOpenControl}>
					<i className="zmdi zmdi-calendar"></i>
					<span className="close" onClick={this.handleCloseControl}>
						<i className="zmdi zmdi-close"></i>
					</span>
					<div className="control-item">
						<h6>Depar</h6>
						<span>{weekDay} {day} {selMonthName}</span>
					</div>
					<div className="control-item">
						<h6>Return</h6>
						<span>One Way</span>
					</div>
				</div>
				<div className="control-body">
					<div className="info-message">
						<i className="zmdi zmdi-info"></i>
						<span>By the moment theres only One Way tickets, thanks.</span>
					</div>
					<div className="calendar">
						<div className="month">
							<i className="zmdi zmdi-chevron-left"
								data-action="back"
								onClick={this.handleChangeMonth}>
							</i>
							<span>{monthName}</span>
							<i className="zmdi zmdi-chevron-right"
								data-action="forward"
								onClick={this.handleChangeMonth}>
							</i>
						</div>
						<div className="center-content">
							<div className="week">
								<span>S</span>
								<span>M</span>
								<span>T</span>
								<span>W</span>
								<span>T</span>
								<span>F</span>
								<span>S</span>
							</div>
							<div className="days">
								{daysRender}
							</div>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

export default ControlDate;