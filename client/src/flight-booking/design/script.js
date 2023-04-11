(function () {
	
	var _airports = _.groupBy(airports, o => o.country),
		selectIndex = [], 
		selectData = [];

	_.each(_airports, (countryList, countryName) => {
		var firstLeter = countryName.split('')[0];
		selectData.push(`<li class="sep" data-index="${firstLeter}">${countryName}</li>`);
		selectIndex.push(`<li>${firstLeter}</li>`);

		_.each(countryList, (airport, i) => {
			selectData.push(`<li data-iata="${airport.IATA}" data-city="${airport.city}">
				${airport.IATA}, ${airport.name}</li>`);
		});
	});

	$('.select ul.select-index').html(_.uniq(selectIndex).join(''));
	$('.select ul.select-data').html(selectData.join(''));


	// Calendar days
	var days = [30];
	for (var i = 0; i < 31; i++) { days.push(i); }

	var daysRender = _.map(days, function(i) {
		return `<span>${i+1}</span>`;
	});
	
	$('.calendar .days').html(daysRender.join(''));
	$('.calendar .days span').eq(8).addClass('checked');

	// Flight Results
	doFlightsRender(true);


	// Events
	// Open inputs
	$('.control:not(.open) .control-head').on('click', function(evt) {
		$(evt.currentTarget).parent('.control').addClass('open');
	});

	$('.control .close').on('click', function(evt) {
		var z = $(evt.currentTarget).closest('.control');
		setTimeout(() => { z.removeClass('open') }, 50);
	});

	// SpinnerInput add/substract action
	$('.spinner button').on('click', function(evt) {
		var isAdding = evt.currentTarget.getAttribute('data-action') == 'plus',
			$input = $('input[name="passengers"]:checked'),
			$control = $input.siblings('div').find('span'),
			value = parseInt($control.text());

		if(isAdding)
			value++;
		else if (value !== 0)
			value--;

		$control.text(value);
	});

	// SelectInput find index
	$('.select-index').on('click', 'li', function(evt) {
		var index = evt.currentTarget.textContent,
			$nano = $(evt.currentTarget).parent('.select-index').siblings('.nano'),
			el = $nano.find(`li.sep[data-index="${index}"]`)[0];

		$nano.find('.nano-content').animate({ scrollTop: el.offsetTop }, 600);
	});

	// SelectInput set data
	$('.select-data').on('click', 'li:not(.sep)', function(evt) {
		var text = evt.currentTarget.textContent,
			iata = evt.currentTarget.getAttribute('data-iata'),
			$select = $(evt.currentTarget).closest('.select'),
			$nameContainer = $select.find('.airport-name');

		if($nameContainer.data('role') == 'from') {
			var _iata = iata.split('');
			var div = $('.header .fromPlace').addClass('rotate');
			var span = $('.header .fromPlace span');
			span.eq(0).text(_iata[0]);
			span.eq(1).text(_iata[1]);
			span.eq(2).text(_iata[2]);
			setTimeout(() => div.removeClass('rotate'), 900);
			//$('.xfrom').text(iata);
		}
		else {
			var _iata = iata.split('');
			var div = $('.header .toPlace').addClass('rotate');
			var span = $('.header .toPlace span');
			span.eq(0).text(_iata[0]);
			span.eq(1).text(_iata[1]);
			span.eq(2).text(_iata[2]);
			setTimeout(() => div.removeClass('rotate'), 900);
			//$('.xto').text(iata);
		}

		$nameContainer.text(text);
		$select.toggleClass('open');

		$(evt.currentTarget).addClass('selected').siblings('li').removeClass('selected');
	});

	// Date input
	$('.calendar .days span').on('click', function(evt) {
		var $this = $(evt.currentTarget),
			day = evt.currentTarget.textContent;

		$this.addClass('checked').siblings('span').removeClass('checked');

		var date = new Date(`5/${day}/2017`);
		var [wd, m, d] = date.toDateString().split(' ');
		$('.dateinput .control-item span').eq(0).text(`${wd.toUpperCase()}, ${d} ${m}`);
	});


	$('.btnBack').on('click', function(evt) {
		var wrap = document.querySelector('.wrap'),
			index = parseInt(wrap.getAttribute('data-pos'));
		
		$('.ticket button.btnBook').text('Book Flight');
		wrap.setAttribute('data-pos', index - 1);
	});

	// Search button
	$('.btnSearch').on('click', function(evt) {
		doFlightsRender(false);
		setTimeout(() => {
			document.querySelector('.wrap').setAttribute('data-pos', 1);
		}, 50);
	});

	// $('.ticket button').on('click', function(evt) {
	// 	var $button = $(evt.currentTarget);
	// 	var $loader = $('.loader').show();
	// 	$button.text('Booking...');

	// 	setTimeout(() => {
	// 		$loader.hide();
	// 		$button.html('<i class="zmdi zmdi-check-circle"></i> Flight Booked');
	// 		$button.addClass('success');
	// 	}, 1200);
	// });  

	// Select Flight
	$('.list').on('click', 'article', function(evt) {
		var index = parseInt(evt.currentTarget.getAttribute('data-index')),
			flight = flights[$('.fromPlace span').text()][index];

		var [from, t1, to, t2] = flight.nodes[0].split(' ');

		var p = $('.radio.passengers label span'),
			peopleTotal = 0,
			num_of_kids = 0,
			people = _.map(p, function(el, i) {
				var v = parseInt(el.textContent),
					str = '';

				if(i == 0 && v){
					str = `${v} Adults`;
				}
				if(i == 1 && v){
					str = `${v} Kids`;
					num_of_kids++;
				}
				if(i == 2 && v){
					str = `${v} Elders`;
				}

				peopleTotal += v;

				return str;
			});

		from = $('.fromPlace span').text();
		to = $('.toPlace span').text();

		var time1 = new Date(t1),
			time2 = new Date(t2);

		var clase = $('input[name="seat"]:checked').val(),
			dates = $('.dateinput .control-item span'),
			place1 = _.findWhere(airports, {IATA: from}),
			place2 = _.findWhere(airports, {IATA: to});

		peopleTotal -= num_of_kids/2;

		let bookingPrice = peopleTotal * flight.price;
		let gstPrice =  bookingPrice * 0.05;

		if(clase==='Business'){
			bookingPrice *= 1.8;
			gstPrice = bookingPrice*0.12;
		}
		if(clase==='First Class'){
			bookingPrice *= 5;
			gstPrice = bookingPrice*0.18;
		}

		let totalPrice = bookingPrice + gstPrice;
		
		var flightRender = `
			<div class="title">
				<div>
					<small>${time1.toLocaleTimeString().replace(':00','')}</small>
					<span>${from}</span>
					<small>${place1.city}</small>
				</div>
				<span class="separator"><i class="zmdi zmdi-airplane"></i></span>
				<div>
					<small>${time2.toLocaleTimeString().replace(':00','')}</small>
					<span>${to}</span>
					<small>${place2.city}</small>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Passengers</small><span id="passengers">${_.compact(people).join(', ')}</span>
				</div>
				<div class="cell">
					<small>Class</small><span id="classs">${clase}</span>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Departure</small><span id="depart">${dates[0].textContent}</span>
				</div>
				<div class="cell">
					<small>Return</small><span>${dates[1].textContent}</span>
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<small>Airline</small><span>${carrier[flight.carrier.slice(0,2)]}</span>
				</div>
				<div class="cell">
					<small>Service</small><span id="service">${flight.carrier}</span>
				</div>
			</div>
			<div class="total">
				<small>Booking</small> <span id="booking" "text-align:left;">&#8377;${bookingPrice.toFixed(2)}</span>
				<small>GST</small> <span id="gst" "text-align:center;">&#8377;${gstPrice.toFixed(2)}</span>
				<small>Total</small> <span id="total" "text-align:right;">&#8377;${totalPrice.toFixed(2)}</span>
			</div>
		`;

		$('.ticket section').html(flightRender);

		$('.ticket button').on('click', function(evt) {
			var $button = $(evt.currentTarget);
			var $loader = $('.loader').show();
			$button.text('Booking...');

			// var service_info = `${flight.carrier}-${place1.city}-${place2.city}`

			var dataToSend = {
				passengers: _.compact(people).join(', '),
				departure: dates[0].textContent,
				classs: clase,
				service: flight.carrier,
				booking: bookingPrice.toFixed(2),
				status: 'Processing'
			};
	
			$.ajax({
				type: "POST",
				url: "http://localhost:8080/api/data",
				data: JSON.stringify(dataToSend),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data) {
					console.log(data);
					$loader.hide();
					$button.text('Booking Processed').addClass('disabled');
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
					$loader.hide();
					alert('There was an error processing your request. Please try again later.');
				}
			});
	
			setTimeout(() => {
				$loader.hide();
				$button.html('<i class="zmdi zmdi-check-circle"></i>Redirecting to Airlines Page');
				$button.addClass('success').addClass('disabled');
			}, 1000);

			setTimeout(() => {
				window.open('http://localhost:3000/details', '_blank');
			}, 1000);
		});

		setTimeout(() => {
			document.querySelector('.wrap').setAttribute('data-pos', 2);
		}, 50);
	});

	// Init scroll
	$(".nano").nanoScroller();


	function doFlightsRender(isInit) {
		var flightsRender = _.map(flights[$('.fromPlace span').text()], function(o, i) {
			var sumText = "";
			var [from, t1, to, t2] = o.nodes[0].split(' ');

			var d1 = new Date(t1), 
				d2 = new Date(t2);

			let from_f = from
			let to_f = to
			
			let price = 1;

			if(!isInit) {
				let clase = $('input[name="seat"]:checked').val()

				var ppl = $('.radio.passengers label span'),
					sum = parseInt(ppl.eq(0).text()) + parseInt(ppl.eq(1).text()) + parseInt(ppl.eq(2).text());

				let net = sum - parseInt(ppl.eq(1).text())/2;
				
				if(clase==='Business') price *= 1.8;
				if(clase==='First Class') price *= 5;

				sumText = `${sum} people &#8377;${(o.price * price * net).toFixed(2)}`;
				from = $('.fromPlace span').text();
				to = $('.toPlace span').text();
			}

			if(from_f!==from){
				return '<div></div>'
			}

			if(to_f!==to){
				return '<div></div>'
			}

			var img = logo[o.carrier.slice(0,2)];

			return `<article data-index="${i}">
				<div class="img">
					<img src="${img}" alt="ualogo" />
				</div>
				<div class="info">
					<span class="time">${o.time}</span>
					<span class="airline">
						${d1.toLocaleTimeString().replace(':00','')} - 
						${d2.toLocaleTimeString().replace(':00','')}
					</span>
					<span style="margin-top:5px;">${carrier[o.carrier.slice(0,2)]} ${from} - ${to}</span>
					<span style="margin-top:3px;">Non-Stop</span>
					<span style="margin-top:3px;">${o.carrier}</span>

					<h5><small>${sumText}</small> &#8377;${(o.price * price)}</h5>
				</div>
			</article>`;
		});

		$('.list .nano-content').html(flightsRender.join(''));
	}

})();