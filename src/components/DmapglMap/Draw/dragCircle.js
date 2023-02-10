/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multi-assign */
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import {circle, distance, point} from '@turf/turf';

const dragPan = {
  enable(ctx) {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.dragPan || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('dragPan')) return;
      ctx.map.dragPan.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.dragPan.disable();
    }, 0);
  },
};

const DragCircleMode = {...MapboxDraw.modes.draw_polygon};

DragCircleMode.onSetup = function(opts) {
  const polygon = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      isCircle: true,
      center: []
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POLYGON);
  this.setActionableState({
    trash: true
  });

  return {
    polygon,
    currentVertexPosition: 0
  };
};

DragCircleMode.onDrag = DragCircleMode.onMouseMove = function (state, e) {
  const center = state.polygon.properties.center;
  if (center.length > 0) {
    const distanceInKm = distance(
      point(center),
      point([e.lngLat.lng, e.lngLat.lat]),
      { units : 'kilometers'});
    if (distanceInKm > 0) {
      const circleFeature = circle(center, distanceInKm);
      state.polygon.incomingCoords(circleFeature.geometry.coordinates);
      state.polygon.properties.radiusInKm = distanceInKm;
    }
  }
};

DragCircleMode.onMouseUp = DragCircleMode.onTouchEnd = function (state, e) {
  dragPan.enable(this);
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
};

DragCircleMode.onClick = DragCircleMode.onTap = function (state, e) {
  const currentCenter = state.polygon.properties.center;
  if (currentCenter.length === 0) {
    state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
  } else {
    dragPan.enable(this);
    return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
  }
};

DragCircleMode.toDisplayFeatures = function(state, geojson, display) {
  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  return display(geojson);
};

export default DragCircleMode;
