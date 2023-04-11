import React from 'react';
import Feedback from './Feedback';

function Flight(props) {
  //const { airport, aircraft, carrier, city, tax } = props.auxData;
  const { carrier } = props.auxData;

  const fare = props.flightData.pricing[0].fare[0];
  const carrierData = _.findWhere(carrier, { code: fare.carrier }); 
  const slice = props.flightData.slice[0];
  const stops = slice.segment.length;

  const timeDeparture = new Date(slice.segment[0].leg[0].departureTime);
  const timeArrival = new Date(slice.segment[stops - 1].leg[0].arrivalTime);

  const origin = slice.segment[0].leg[0].origin;
  const destination = slice.segment[stops - 1].leg[0].destination;

  const duration = slice.duration; // to hour mins
  const durationText = `${Math.floor(duration/60)}h ${duration%60} min`;

  const peopleCount = _.reduce(
    props.passengers, 
    (memo, num) => {
      return (!isNaN(num))? memo + num : memo;
    }, 0);

  return (
    <article onClick={() => props.onFlightClicked(props.flightData.id)}>
      <div className="img">
        <h4>{carrierData.code}</h4>
      </div>
      <div className="info">
        <span className="time">{durationText}</span>
        <span className="airline">
          {timeDeparture.toLocaleTimeString().replace(':00','')} - {timeArrival.toLocaleTimeString().replace(':00','')}
        </span>
        <span>{carrierData.name} {origin} - {destination}</span>
        <span>{( stops > 1)? `${stops} stops` : 'Non-stop'}</span>

        <h5><small>{peopleCount} people</small> {props.flightData.saleTotal.replace('IND','&#8377')}</h5>
      </div>
    </article>
  );
}

class FlightList extends React.Component {
  constructor() {
    super();
    this.state = { showCls: '' }

    this.handleFlightClicked = this.handleFlightClicked.bind(this);
  }

  componentDidMount() { 
    this.props.setCurrentPath(location.pathname);
    this.props.searchFlights()
      .then(response => setTimeout(() => this.setState({ showCls: 'show' }), 50));
  }

  handleFlightClicked(flight) {
    if(this.props.onFlightSelected) {
      this.props.onFlightSelected(flight);
      this.props.history.push('/ticket');
    }
  }

  render() {
    const isEmpty = _.isEmpty(this.props.flights);
    const flights = (!isEmpty)? this.props.flights.trips.tripOption : {};

    return (
     <div className="content">
        <div className={`list ${this.state.showCls}`}>
          <div className="nano">
					    <div className="nano-content">
              {isEmpty 
                ? <Feedback text="Loading..." />
                : flights.map(flightData => (
                  <Flight 
                    key={flightData.id}
                    flightData={flightData} 
                    auxData={this.props.flights.trips.data}
                    passengers={this.props.passengers}
                    onFlightClicked={this.handleFlightClicked} 
                  />
                ))
              }		    	
					    </div>
					</div>
        </div>
      </div>
    )
  }
}

export default FlightList;