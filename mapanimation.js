const colors = [
	'#4caf50',
	'#8bc34a',
	'#9c27b0',
	'#cddc39',
	'#673ab7',
	'#03a9f4',
	'#e91e63',
	'#3f51b5',
	'#9e9e9e',
	'#ffc107',
	'#f44336',
	'#ff9800',
	'#ff5722',
	'#2196f3',
	'#607d8b',
	'#00bcd4',
	'#795548',
	'#009688',
	'#ffeb3b',
  ]

mapboxgl.accessToken =
"pk.eyJ1Ijoic2FnZWRpcGFsbWEiLCJhIjoiY2x4NThlNXg3MDFjZjJqbjhkODNsZGZ4aCJ9.aqOh_wM582RBKOTt-AeLLA";

const map = new mapboxgl.Map({
container: "map", // container ID
style: "mapbox://styles/mapbox/streets-v11", // style URL
center: [-71.104881, 42.365554], // starting position [lng, lat]
zoom: 12, // starting zoom
});
map.resize();

var busesMarkers = [];
async function run(){
	// get bus data    
	const locations = await getBusLocations();
	console.log(locations)
	locations.forEach((bus, i) => {
		var marker = new mapboxgl.Marker({ "color": colors[i] })
		.setLngLat([bus.attributes.longitude, bus.attributes.latitude])
		.setPopup(new mapboxgl.Popup({offset: 25, closeOnClick: false, closeButton: false}).setHTML(`<h3>Bus<br>
		${bus.attributes.label}</h3>`))
		.addTo(map)
		.togglePopup();

		busesMarkers.push(marker);	
	});

	function eraseMarks(){
		if (busesMarkers!==null) {
		for (var i = busesMarkers.length - 1; i >= 0; i--) {
		busesMarkers[i].remove();
		}
	}
	}

	locations.forEach((marker, i)=>{
		let popUp = document.getElementsByClassName('mapboxgl-popup-content');
		popUp[i].style.background = colors[i];
	});

	setTimeout(eraseMarks,7500)

	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

map.on('load', function () {
	run();
  });