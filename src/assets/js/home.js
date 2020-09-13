var jsMap = L.map("jsMap").setView([34.5, 130.5], 6);
var geojson;
var stateInfo = L.control();
var movieInfo = L.control();

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

  stateInfo.update(layer.feature.properties);
}

//mouseout
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  stateInfo.update();
}

//click
function zoomToFeature(e) {
  jsMap.fitBounds(e.target.getBounds());
}

function zoomOutFromFeature() {
  jsMap.setView([34.5, 130.5], 6);
}

const getMovieListUrl = "/movie/movieListByState";
const getMovieList = async (e) => {
  var layer = e.target;
  console.log(e.target.feature.properties);
  response = await axios.get(getMovieListUrl, {
    params: {
      state: e.target.feature.properties.name,
    },
  });

  var movieList = response.data.movieList;

  movieInfo.update(layer.feature.properties, movieList);
  console.log(movieList);
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

const mapboxUrl =
  "https://api.mapbox.com/styles/v1/nakguan/ckezuedjp206419pfgdaifmaw/tiles/{z}/{x}/{y}?access_token={accessToken}";

L.tileLayer(mapboxUrl, {
  attribution: "",
  accessToken: accessToken,
}).addTo(jsMap);

//geojson을 통해 지역경계 설정
geojson = L.geoJson(states, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(jsMap);

function closeMovieInfoClick() {
  movieInfo.update();
  zoomOutFromFeature();
}

//1. control
// 1) stateInfo control
stateInfo.onAdd = function (jsMap) {
  this._div = L.DomUtil.create("div", "stateInfo");
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
stateInfo.update = function (props) {
  this._div.innerHTML =
    "<h4>지명</h4>" +
    (props
      ? "<b>" + props.name + "</b>"
      : "<b>지명 이름을 알고싶으시면 마우스를 올려주세요</b>");
};

// 2)movieInfo
movieInfo.onAdd = function (jsMap) {
  this._div = L.DomUtil.create("div", "movieInfo");
  this.update();

  return this._div;
};

movieInfo.update = function (props, movieList) {
  movieInfoHtml = `<h4> ${props ? props.name + "의 영화" : ""}</h4>`;
  this._div.style.padding = "0px";
  if (movieList) {
    for (movie of movieList) {
      movieInfoHtml = movieInfoHtml + "<b>" + movie + "</b></br>";
    }

    btnHtml = `<button id = "closeMovieInfoBtn" style = "margin-top: 7px" onClick="closeMovieInfoClick()">닫기</button>`;
    movieInfoHtml = movieInfoHtml + btnHtml;

    this._div.style.padding = "8px";
  }

  this._div.innerHTML = movieInfoHtml;
};

stateInfo.addTo(jsMap);
movieInfo.addTo(jsMap);
