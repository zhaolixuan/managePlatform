/* eslint-disable no-unused-vars */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './index.module.less';

const Scale = ({ map }) => {
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial',
  });
  map.addControl(scale);
  return null;
};

export default Scale;
