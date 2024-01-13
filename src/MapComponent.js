import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import jsonData from './net_data.json';
import { interpolateBlues } from 'd3-scale-chromatic';

const MapComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(jsonData);
  }, []);

  const getColor = (dataValue) => {
    const maxData = Math.max(...data.map((item) => item.data));
    const scale = 255 / maxData;
    const shade = Math.floor(dataValue * scale);
    return interpolateBlues(shade / 255);
  };

  const legend = () => {
    const maxData = Math.max(...data.map((item) => item.data));
    const steps = 5;
    const stepSize = maxData / steps;
  
    const legendItems = data.map((item, index) => {
      const startValue = index * stepSize;
      const endValue = (index + 1) * stepSize;
      const color = interpolateBlues((startValue + endValue) / (2 * maxData));
      const valuesInRange = data.filter((item) => item.data >= startValue && item.data < endValue);
      const percentage = (valuesInRange.length / data.length) * 100;
    
      return (
        <div key={index} style={{ height: '5px', width: `${(percentage + 1) * 12}px`, backgroundColor: color }}>
          <br />
          <span style={{ display: 'inline-block', textAlign: 'center', fontSize: '12px', width: '100%' }}>{`${startValue.toFixed(2)} - ${endValue.toFixed(2)}`}</span>
          <br />
          <span style={{ display: 'inline-block', textAlign: 'center', fontSize: '12px', width: '100%' }}>{`${percentage.toFixed(2)}%`}</span>
        </div>
      );
    });
    
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {legendItems}
      </div>
    );
  };

  return (
    <div style={{ paddingLeft: '7.5rem', position: 'relative' }}>
      <h1>DATA USAGE AS PER REGION</h1>
      <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '600px', width: '85%' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=JYkNfj9TnawOgTr2hsYd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {data.map((item, index) => (
          <CircleMarker
            key={index}
            center={[item.latitude, item.longitude]}
            pathOptions={{ fillColor: getColor(item.data), color: 'blue', weight: 1, opacity: 0.45, fillOpacity: 0.8 }}
            radius={Math.sqrt(item.data)}
          >
            <Popup>{`Data: ${item.data.toFixed(2)}`}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {legend()}
    </div>
  );
};

export default MapComponent;
