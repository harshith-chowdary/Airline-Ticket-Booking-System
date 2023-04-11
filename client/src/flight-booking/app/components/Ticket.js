import React from 'react';
import Feedback from './Feedback';

function TicketInfo(props) {
  //const { airport, aircraft, carrier, city, tax } = props.auxData;
  const { carrier, city } = props.flights.trips.data;
  const flightData = _.findWhere(props.flights.trips.tripOption, {id:props.selectedFlight});

  const fare = flightData.pricing[0].fare[0];
  const carrierData = _.findWhere(carrier, { code: fare.carrier }); 
  
  const slice = flightData.slice[0];
  const stops = slice.segment.length;
  const origin = slice.segment[0].leg[0].origin;
  const destination = slice.segment[stops - 1].leg[0].destination;

  const timeDeparture = new Date(slice.segment[0].leg[0].departureTime);
  const timeArrival = new Date(slice.segment[stops - 1].leg[0].arrivalTime);
  // date departure
  const [w,d,m,...rest] = timeDeparture.toUTCString().split(' ');

  const cityDeparture = _.findWhere(city, {code:fare.origin});
  const cityArrival = _.findWhere(city, {code:fare.destination});

  const ptext = _.map(props.formData.passengers, (val, key) => {
    return (!isNaN(val) && val !== 0)? `${val} ${key}` : '';
  });

  return (
    <section>
      <div className="title">
        <div>
          <small>{timeDeparture.toLocaleTimeString().replace(':00','')}</small>
          <span>{origin}</span>
          <small>{cityDeparture.name}</small>
        </div>
        <span className="separator"><i className="zmdi zmdi-airplane"></i></span>
        <div>
          <small>{timeArrival.toLocaleTimeString().replace(':00','')}</small>
          <span>{destination}</span>
          <small>{cityArrival.name}</small>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <small>Passengers</small><span>{_.compact(ptext).join(', ')}</span>
        </div>
        <div className="cell">
          <small>ClassName</small><span>{props.formData.fclass}</span>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <small>Departure</small><span>{`${w} ${d} ${m}`}</span>
        </div>
        <div className="cell">
          <small>Return</small><span>One Way</span>
        </div>
      </div>
      <div className="row">
        <div className="cell">
          <small>Airline</small><span>{carrierData.name}</span>
        </div>
        <div className="cell">
        </div>
      </div>
      <div className="total">
        <small>Total</small> <span>{flightData.saleTotal.replace('IND', '&#8377')}</span>
      </div>
    </section>
  );
}


class Ticket extends React.Component {
  componentDidMount() {
    this.props.setCurrentPath(location.pathname);
  }

  bookFlight() {
    console.log('Flight Booked, Happy Trip :D');
  }

  render() {
    const isEmpty = _.isEmpty(this.props.flights);
    return (
      <div className="content">
        <div className="ticket">
        	{!isEmpty ? 
            <TicketInfo {...this.props} /> :
            <Feedback text="No Data" />
          }

          {!isEmpty && 
            <button 
              onClick={this.bookFlight}
              className="btnBook">
              BOOK FLIGHT
            </button>
          }
        </div>
      </div>
    )
  }
}

export default Ticket;