import React, { Component } from 'react';
import './App.css';

var circle;
let lat = null;
let lon = null;
let google = window.google
var infowindow = new google.maps.InfoWindow({});
class App extends Component {
  state = {
    locAvailable: false,
    loading: false
  }

  componentWillMount() {
    this.initialize();

  }
  componentDidMount() {
    var div = document.createElement("div");
    div.setAttribute("id","content-d");
    document.body.appendChild(div);
    document.getElementById("content-d").addEventListener("click", this.refreshMap);
  }

  initialize = () => {
    this.setState({loading:true})
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log('aint got location')
    }
  }
  
  refreshMap = () => {
    var elem = document.getElementById("ifrmMap");
    elem.parentNode.removeChild(elem);
    this.initialize();
  }
  showPosition = (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 20,
      center: new google.maps.LatLng(lat, lon),
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    circle = new google.maps.Circle({
      center: map.getCenter(),
      radius: 50000, // meters
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.26
    });

    circle.setMap(map);

    var bounds = circle.getBounds();
    map.fitBounds(bounds);
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    for (var i = 0; i < 100; i++) {
      var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
      var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
      var point = new google.maps.LatLng(ptLat, ptLng);
      console.log('log lat', ptLat, ptLng)
      if (google.maps.geometry.spherical.computeDistanceBetween(point, circle.getCenter()) < circle.getRadius()) {
        let mapurl = `https://maps.google.com/maps?q=${ptLat},${ptLng}+(My+Point)&z=14&output=embed`
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("id","ifrmMap");
        ifrm.setAttribute("src", mapurl);
        document.body.appendChild(ifrm);
        console.log('asdf')
        this.setState({loading:false})
        break;
      }
    }
  }

  createMarker = (map, point, content) => {
    var marker = new google.maps.Marker({
      position: point,
      map: map
    });
    google.maps.event.addListener(marker, "click", function (evt) {
      infowindow.setContent(content + "<br>" + marker.getPosition().toUrlValue(6));
      infowindow.open(map, marker);
    });
    return marker;
  }
  render() {
    return (
      <div id="map">
  
      </div>
    )
  }
}

export default App;
