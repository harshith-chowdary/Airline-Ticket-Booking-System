function _get(url) {
	return new Promise(function(resolve, reject){
		let request = new XMLHttpRequest();

		request.open('GET', url, true);
		
		request.onload = function() {
			if(request.status >= 200 && request.status < 400){
				resolve(JSON.parse(request.response));
			} else {
				reject(new Error(request.status));
			}
		};

		request.onerror = function() {
			reject(new Error("Error Fetching Results"));
		};

		request.send();
	});
}

function getAirportsList() {
	let request = _get('assets/airports.json');
	
	return request.then(response => {
		return response;
	});
}

function _getFlightsTest() {
	let request = _get('assets/flights.json');
	
	return request.then(response => {
		console.log('Test data Enabled');
		return response;
	});
}

function _getFlights(o) {
	const date = new Date(o.date);
	const cabin = (o.fclass === 'economy')? 
									'COACH' : (o.fclass === 'bussiness')? 
									'BUSSINESS' : 'FIRST';
	const reqBody = {
		request: {
			slice: [
				{
					origin: o.from,
					destination: o.to,
					date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
					preferredCabin: cabin
				}
			],
			passengers: {
				childCount: o.passengers.kids,
				adultCount: o.passengers.adults,
				seniorCount: o.passengers.elders
			},
			solutions: 10,
			refundable: false
		}
	};

	const apiKey = '#YOUR_QPX_API_KEY#';
	const request = fetch(
		`https://www.googleapis.com/qpxExpress/v1/trips/search?key=${apiKey}`, 
		{
			method: 'POST',
			body: JSON.stringify(reqBody),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}
	);

	return request.then(response => {
		return response.json();
	});
}

function getFlights(data) {
	const useTestData = true;
	
	if (useTestData)
		return _getFlightsTest();
	else
		return _getFlights(data);
}

function getHashCode(str) {
  const len = str.length;
	let hash = 0, i, chr;

  if (len === 0) return hash;
  for (i = 0; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export default { 
	getAirportsList,
	getFlights,
	getHashCode
};