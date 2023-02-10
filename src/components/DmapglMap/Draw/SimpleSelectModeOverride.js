/* eslint-disable */
/* eslint-disable @typescript-eslint/no-var-requires */
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import createSupplementaryPoints from '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points';
import moveFeatures from '@mapbox/mapbox-gl-draw/src/lib/move_features';

import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';

const Constants = require('@mapbox/mapbox-gl-draw/src/constants');

const SimpleSelectModeOverride = MapboxDraw.modes.simple_select;

SimpleSelectModeOverride.dragMove = function(state, e) {
  // Dragging when drag move is enabled
  state.dragMoving = true;
  e.originalEvent.stopPropagation();

  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat
  };

  moveFeatures(this.getSelected(), delta);

  this.getSelected()
    .filter(feature => feature.properties.isCircle)
    .map(circle => circle.properties.center)
    .forEach(center => {
      center[0] += delta.lng;
      center[1] += delta.lat;
    });

  state.dragMoveLocation = e.lngLat;
};

SimpleSelectModeOverride.toDisplayFeatures = function(state, geojson, display) {
    geojson.properties.active = (this.isSelected(geojson.properties.id)) ?
      Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    display(geojson);
    this.fireActionable();
    if (geojson.properties.active !== Constants.activeStates.ACTIVE ||
      geojson.geometry.type === Constants.geojsonTypes.POINT) return;
    const supplementaryPoints = geojson.properties.user_isCircle ?
      createSupplementaryPointsForCircle(geojson) : createSupplementaryPoints(geojson);
    supplementaryPoints.forEach(display);
};

function createSupplementaryPointsForCircle(geojson) {
  const { properties, geometry } = geojson;

  if (!properties.user_isCircle) return null;

  const supplementaryPoints = [];
  const vertices = geometry.coordinates[0].slice(0, -1);
  for (let index = 0; index < vertices.length; index += Math.round((vertices.length / 4))) {
    supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
  }
  return supplementaryPoints;
}

export default SimpleSelectModeOverride;