//Declare variables
var myMap, canvas, selDiv, selText, sel, religionLat, religionLon, data, selIndex, myLoc, myLat, myLon;
var mappa = new Mappa(
  "MapboxGL",
  "pk.eyJ1Ijoic3lsYXRoYXMiLCJhIjoiY2szNzF1ZTR5MDc5MzNtbnM0dmwzNzdyMCJ9.EN7o0z5fjNZqb_aQFTe8vg"
);

//Starting options for Mapbox
var options = {
  lat: 42.504154,
  lng: 12.646361,
  zoom: 4,
  style: 'mapbox://styles/mapbox/traffic-night-v2'
};

//Preloading the json with the religions and explanation and my location
function preload() {
  myLoc = getCurrentPosition();
  data = loadJSON("./assets/religion.json");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
    
  //creating the map and making it overlay the canvas
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
    
  //Creating and styling the Div and Select for the religion selection
  selDiv = createDiv();
  selDiv.position(20, 40);
  selDiv.style("z-index", "2");
  selDiv.style("background-color", "green");
  selDiv.style("padding", "20px");
  selDiv.style("border-radius", "10%");
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
    
  //latutude and longitude of my Position
  myLat = myLoc.latitude;
  myLon = myLoc.longitude;
    
  //Transforming positions into pixels 
  var religion = myMap.latLngToPixel(religionLat, religionLon);
  var io = myMap.latLngToPixel(myLat, myLon);
    
  //Calculate distance in km from me to Holy City
  var distance = Math.round(
    calcGeoDistance(myLat, myLon, religionLat, religionLon, "km")
  );
    
  //Create ellipses around Holy Cities and me
  push();
  noStroke();
  fill("Lime");
  ellipse(religion.x, religion.y, 10);
  ellipse(io.x, io.y, 10);
  pop();
  push();
  textAlign(CENTER);
  textSize(20);
  fill("Lime");
  textStyle(BOLD);
  text(data.religion[selIndex].ReligionName, religion.x, religion.y - 10);
  pop();
    
  //Create line between me and holy city
  push();
  stroke("Lime");
  line(io.x, io.y, religion.x, religion.y);
  pop();
    
  //Text on me and distance in km
  fill("Lime");
  textSize(20);
  text("You", io.x-20, io.y - 10);
  textSize(10);
  text(distance + " km", (io.x + religion.x) / 2, (io.y + religion.y) / 2 - 10);
    
  //Informations about the Religions
  textAlign(LEFT);

  //Box
  noStroke();
  fill("rgba(0,155,0,0.75)");
  rect(20,200,385,280,16);

  //Holy City
  noStroke();
  fill("White");
  textSize(30);
  text("Holy City:" + data.religion[selIndex].HolyCity, 40, 240);

  //Text
  fill("White");
  textSize(16);
  textLeading(21);
  text(data.religion[selIndex].ReligionStory, 40, 260, 320, windowHeight-100);
}