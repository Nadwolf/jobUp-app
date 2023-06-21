import './map.css';
import app from '../../components/app';

const location = document.getElementById('location');
let mapData = null;
const markers = [];
// инициализация карты

mapboxgl.accessToken =
  'pk.eyJ1IjoibmFkd29sZiIsImEiOiJjbGoyenF6OWsxbGV0M2xxaGs4NHhzOGNtIn0.0KZe_kPZLdJ3LGI-Yj502g';

const map = new mapboxgl.Map({
  container: 'map-section',
  style: 'mapbox://styles/nadwolf/clj2zyzxa00y201p78z813aax',
});

function renderMarkersDashboard() {
  const tasks = app.tasks.filter((task) => !task.isArchive);
  renderMarkers(tasks);
}

function renderMarkersArchive() {
  const tasks = app.tasks.filter((task) => task.isArchive);
  renderMarkers(tasks);
}

function renderMarkers(tasks) {
  clearMarkers();
  tasks.forEach((task) => {
    if (!task.features) {
      return null;
    }
    const el = document.createElement('div');
    el.className = 'marker';

    const marker = new mapboxgl.Marker(el)
      .setLngLat(task.features.geometry.coordinates)
      .addTo(map);
    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach((marker) => marker.remove());
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15,
  });
}

map.on('load', () => {
  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': 'transparent',
      'circle-stroke-color': '#2577ff',
      'circle-stroke-width': 5,
    },
  });
});

const el = document.createElement('div');
el.className = 'marker';

location.addEventListener('change', () => {
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.value}.json?country=ua&bbox=30%2C50%2C31%2C51&limit=5&proximity=ip&types=address&autocomplete=true&access_token=pk.eyJ1IjoibmFkd29sZiIsImEiOiJjbGoyenF6OWsxbGV0M2xxaGs4NHhzOGNtIn0.0KZe_kPZLdJ3LGI-Yj502g`
  )
    .then((response) => response.json())
    .then((data) => {
      const features = data?.features[0];
      mapData = features;
      flyToStore(features);

      map.getSource('single-point').setData(features.geometry);

      const address = features.place_name.replace('Ukraine, ', '');
      location.value = address;

      const event = new Event('input');
      location.dispatchEvent(event);
    })
    .catch((err) => {
      console.log(err);
      mapData = null;
    });
});

function getMapData() {
  return mapData;
}

export default {
  mapData,
  getMapData,
  renderMarkersDashboard,
  renderMarkersArchive,
};
