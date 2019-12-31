import React, { Component } from 'react';
import './App.css';

var circle;
let lat = null;
let lon = null;
let google = window.google
var infowindow = new google.maps.InfoWindow({});
class App extends Component {
  state = {
    locAvailable: false
  }

  componentWillMount() {
    //   var script = document.createElement('script');
    // script.src = 'http://maps.googleapis.com/maps/api/js?libraries=geometry';
    // setTimeout(()=>{
    this.initialize();
    // },2000)

  }
  initialize = () => {
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log('aint got location')
    }
  }

  showPosition = (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    // if(lat){
    //   this.setState({locAvailable:true})
    // }
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 20,
      center: new google.maps.LatLng(lat, lon),
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    circle = new google.maps.Circle({
      center: map.getCenter(),
      radius: 100000, // meters
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
        // createMarker(map, point, "marker " + i);
        let mapurl = `http://maps.google.com/maps?q=${ptLat},${ptLng}+(My+Point)&z=14&output=embed`
        //  window.open(mapurl, '_blank');
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", mapurl);
        document.body.appendChild(ifrm);

        console.log('asdf')
        break;
      }
      // return;
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
