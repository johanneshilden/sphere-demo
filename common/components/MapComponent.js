import React                from 'react'
import {GoogleMaps, Marker} from 'react-google-maps'

const MapComponent = React.createClass({
    render: function() {
        let position = {
            lat: this.props.latitude,
            lng: this.props.longitude
        }
        return (
            <div style={{height: '500px'}}>
                <GoogleMaps 
                  containerProps={{
                      style: {
                          height: '100%'
                      }
                  }}
                  googleMapsApi={window.google.maps}
                  zoom={14}
                  center={position}>
                  <Marker
                    position={position}
                    key={this.props.label} />
                </GoogleMaps>
            </div>
        )
    }
})

module.exports = MapComponent
