import React from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import FlightList from './FlightList';
import Header from './Header';
import Form from './Form';
import Ticket from './Ticket';
import Feedback from './Feedback';
import api from '../utils/api';


function Headbar(props) {
  const canGoBack = location.pathname !== '/';
  return (
    <div className="headbar">
      {canGoBack && (<i onClick={props.onGoBack}
        className="zmdi zmdi-arrow-left btnBack">
      </i>)} 
      <span>Flight</span>
      <span className="blue">.Book</span>
    </div>
  );
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      airports: [],
      flights: {},
      selectedFlight: {},
      lastQueryHash: '',
      currentPath: '/',
      form: {
        from: 'DUB',
        to: 'HAM',
        date: Date.now(),
        passengers: {
          adults: 1,
          kids: 0,
          elders: 0
        },
        fclass: 'economy'
      }
    };
    
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSearchFlights = this.handleSearchFlights.bind(this);
    this.handleFlightSelected = this.handleFlightSelected.bind(this);
    this.handleSetCurrentPath = this.handleSetCurrentPath.bind(this);
  }

  componentDidMount() {
		api.getAirportsList()
			.then(result => {
				this.setState({ airports: result });
			});
	}

  handleSearchFlights() {
    const result = new Promise(resolve => {
      // to avoid unnecesary requests
      const currentQueryHash = api.getHashCode(JSON.stringify(this.state.form));

      if (currentQueryHash !== this.state.lastQueryHash) {
        this.setState({ flights: [] });
        api.getFlights(this.state.form)
          .then(result => {
            this.setState({ 
              flights: result,
              lastQueryHash: currentQueryHash 
            });

            resolve();
          });
      }
      else
        resolve();
    });

    return result;
  }

  handleFormChange(key, val) {
    this.setState(prevState => {
      prevState.form[key] = val;
      return prevState;
    });
  }

  handleFlightSelected(flight) {
    this.setState({ selectedFlight: flight });
  }

  handleSetCurrentPath(path) {
    this.setState({ currentPath: path });
  }

  handleGoBack() {
    history.back();
  }

  render() {
    const wrapCls = (this.state.currentPath === '/ticket')? 'wrap headerCollapsed' : 'wrap';
    return (
      <Router>
        <div className={wrapCls}>
          <Headbar onGoBack={this.handleGoBack} />
          <Header from={this.state.form.from} to={this.state.form.to} />

          <Switch>
            <Route exact path="/" render={props => (
              <Form {...props} 
                    formData={this.state.form}
                    airports={this.state.airports} 
                    setCurrentPath={this.handleSetCurrentPath}
                    onFormChanged={this.handleFormChange} />
            )}/>
            <Route exact path="/flights" render={props => (
              <FlightList {...props} 
                    flights={this.state.flights}
                    passengers={this.state.form.passengers}
                    searchFlights={this.handleSearchFlights}
                    setCurrentPath={this.handleSetCurrentPath}
                    onFlightSelected={this.handleFlightSelected} />
            )}/>
            <Route exact path="/ticket" render={props => (
              <Ticket {...props} 
                    formData={this.state.form}
                    flights={this.state.flights}
                    setCurrentPath={this.handleSetCurrentPath}
                    selectedFlight={this.state.selectedFlight} />
            )}/>
            <Route render={() => <Feedback text="Not Found" />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;