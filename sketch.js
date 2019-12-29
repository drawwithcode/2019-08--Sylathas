var myMap;
var canvas;
var mappa = new Mappa(
  "MapboxGL",
  "pk.eyJ1IjoiZG9rc2F2cGMiLCJhIjoiY2sybTUxeXJnMGQycjNqbjVrYjE5dmg3YyJ9.n7CmQCAd4zSI0VxLgEb4DA"
);

//declaring the elements for the Religion selection (a container div, a title and a selection element)
var selDiv;
var selText;
var sel;
//declaring the variables for latitude and longitude of the selected Religion
var religionLat;
var religionLon;
//declaring the variable for the data from the json file
var data;
//declaring the variable for the index number of the selected religion
var selIndex;
//declaring the starting options for the map using my custom mapbox style
var options = {
  lat: 0,
  lng: 0,
  zoom: 2,
  style: 'mapbox://styles/mapbox/traffic-night-v2'
};
//preloading the json with the religions and explanation
function preload() {
  data = loadJSON("./assets/religion.json");
}

function setup() {
  //creating the canvas
  canvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
    
  //creating the map and making it overlay the canvas
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
    
  //creating and styling the html elements for the country selection (a container div, a title and the selection input)
  selDiv = createDiv();
  selDiv.position(20, 40);
  selDiv.style("z-index", "999");
  selDiv.style("background-color", "green");
  selDiv.style("padding", "20px");
  selText = createElement("h1", "Select a Religion");
  selText.style("color", "white");
  selText.parent(selDiv);
  sel = createSelect();
  sel.id("religionSelect");
    
  //Creating options for Religions in the input
  for (var i = 0; i < data.religion.length; i++) {
    sel.option(data.religion[i].ReligionName);
  }
  sel.parent(selDiv);
}

function draw() {
  clear();
    
  //Get the index number of the selected option
  var selIndex = document.getElementById("religionSelect").selectedIndex;
    
  //latitude and longitude of the selected Religion
  religionLat = data.religion[selIndex].ReligionLatitude;
  religionLon = data.religion[selIndex].ReligionLongitude;
    
  //mapping lon and lat of Holy Cities
  var religion = myMap.latLngToPixel(religionLat, religionLon);
    
  //Create ellipses around Holy Cities
  push();
  noStroke();
  fill("Lime");
  ellipse(religion.x, religion.y, 10);
  pop();
  push();
  textAlign(CENTER);
  textSize(20);
  fill("Lime");
  textStyle(BOLD);
  text(data.religion[selIndex].ReligionName, religion.x, religion.y - 10);
  pop();
    
  //Informations about the Religions
  textAlign(LEFT);

  //Box
  noStroke();
  fill("rgba(0,155,0,0.75)");
  rect(20,200,385,280,16);

  //Holy City
  noStroke();
  fill("White");
  textSize(20);
  text("Holy City:", 40, 240);
  textSize(30);
  text(data.religion[selIndex].HolyCity, 130, 240);

  //Text
  fill("rgba(255,255,255,0.95)");
  textFont("Alegreya");
  textSize(16);
  textLeading(21);
  text(data.religion[selIndex].ReligionStory, 40, 260, 320, windowHeight-100);
}