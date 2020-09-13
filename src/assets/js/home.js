var jsMap = L.map("jsMap").setView([34.5, 130.5], 6);
var geojson;
var info = L.control();
const accessToken =
  "pk.eyJ1IjoibmFrZ3VhbiIsImEiOiJja2V3eWN6MGcwcXpwMnJsOWE1Zzl3eXNzIn0.Ijjd7dxJM-Gs5OTBzNphRA";

//style
function getColor(d) {
  const colorList = [
    "#800026",
    "#BD0026",
    "#E31A1C",
    "#FC4E2A",
    "#FD8D3C",
    "#FEB24C",
    "#FED976",
    "#FFEDA0",
  ];
  randNum = Math.floor(Math.random() * (colorList.length - 1));
  color = colorList[randNum];
  return color;
}

function style(feature) {
  return {
    fillColor: getColor(),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

//mouseover
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

//mouseout
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

//click
function zoomToFeature(e) {
  jsMap.fitBounds(e.target.getBounds());
}

const getMovieListUrl = "/movie/movieListByState";

const getMovieList = async (e) => {
  console.log(e.target.feature.properties);
  response = await axios.get(getMovieListUrl, {
    params: {
      state: e.target.feature.properties.name,
    },
  });

  console.log(response.data.movieList);
};

function stateClickHandler(e) {
  zoomToFeature(e);
  getMovieList(e);
}

//addEventHandlerOnMap
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: stateClickHandler,
  });
}

//info control

const mapboxUrl =
  "https://api.mapbox.com/styles/v1/nakguan/ckezuedjp206419pfgdaifmaw/tiles/{z}/{x}/{y}?access_token={accessToken}";
//"https://api.maptiler.com/maps/voyager/{z}/{x}/{y}.png?key=Ibx5NHRn2Y0gufOihNMV"
//'<a href="https://carto.com/" target="_blank">&copy; CARTO</a> <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

L.tileLayer(mapboxUrl, {
  attribution: "",
  accessToken: accessToken,
}).addTo(jsMap);

geojson = L.geoJson(states, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(jsMap);

info.onAdd = function (jsMap) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>지명</h4>" +
    (props
      ? "<b>" + props.name + "</b>"
      : "지명 이름을 알고싶으시면 마우스를 올려주세요");
};

info.addTo(jsMap);
