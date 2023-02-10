/* eslint-disable */
import React from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DrawLineStringIcon from './assets/icon_draw_line_string.svg';
import DrawCircleIcon from './assets/icon_draw_circle.svg';
import DrawPolygonIcon from './assets/icon_draw_polygon.svg';
import DrawReactagleIcon from './assets/icon_draw_rectangle.svg';
import withMap from '../BaseMap/withmap';
import DrawRectangle from './mapbox-gl-draw-rectangle-mode';
import CircleMode from './CircleMode';
import dragCircleMode from './dragCircle';
import SimpleSelectMode from './SimpleSelectModeOverride';
import DirectMode from './DirectModeOverride';
import './Draw.less';
import { DrawProps } from './Draw.types';
import getTheme from './theme';

class Draw extends React.Component<DrawProps, any> {
  drawIns = null;

  ids = [];

  actions = [
    { mode: 'draw_line_string', icon: DrawLineStringIcon },
    { mode: 'draw_polygon', icon: DrawPolygonIcon },
    { mode: 'draw_rectangle', icon: DrawReactagleIcon },
    {
      mode: 'draw_circle',
      params: { initialRadiusInKm: this.initialRadiusInKm },
      icon: DrawCircleIcon,
    },
  ];
  get modes() {
    const { modes = ['draw_polygon'] } = this.props;
    return modes;
  }
  componentDidMount() {
    if (!this.drawIns) {
      const {
        map,
        lineColor = '#3bb2d0',
        lineWidth = 2,
        lineActiveColor = '#fbb03b',
        lineActiveWidth = 2,
        fillColor = '#3bb2d0',
        fillOpacity = 0.1,
        fillActiveColor = '#fbb03b',
        fillActiveOpacity = 0.1,
        lineVertexRadius = 5,
        lineVertexColor = '#fff',
        styles,
        data = [],
        load,
      } = this.props;
      this.drawIns = new MapboxDraw({
        // modes: Object.assign(MapboxDraw.modes, {
        //   simple_select: SimpleSelectMode,
        //   direct_select: DirectMode,
        //   draw_rectangle: DrawRectangle,
        //   draw_circle: this.initialRadiusInKm > 0 ? CircleMode : dragCircleMode,
        // }),
        defaultMode: 'draw_polygon',
        displayControlsDefault: false,
        styles: getTheme({
          // modes: this.modes,
          lineColor,
          lineWidth,
          lineActiveColor,
          lineActiveWidth,
          fillColor,
          fillOpacity,
          fillActiveColor,
          fillActiveOpacity,
          lineVertexRadius,
          lineVertexColor,
          styles,
        }),
        controls: {},
      });
      map.addControl(this.drawIns);
      load && load(this.drawIns);
      data.map(d => {
        this.drawIns.add(d);
      });
      map.on('draw.create', this.update.bind(this));
      map.on('draw.delete', this.update.bind(this));
      map.on('draw.update', this.update.bind(this));
    }
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.off('draw.create', this.update.bind(this));
    map.off('draw.delete', this.update.bind(this));
    map.off('draw.update', this.update.bind(this));
  }

  // 圆形默认半径
  get initialRadiusInKm() {
    const { initialRadiusInKm = 0 } = this.props;
    return +initialRadiusInKm;
  }

  update(e) {
    const { updateArea } = this.props;
    const all = this.drawIns.getAll();
    this.ids = all.features.map(({ id }) => id);
    this.drawIns && updateArea && updateArea(e, all);
  }

  deleteDraw() {
    const { single } = this.props;
    single && this.drawIns.delete(this.ids);
    this.drawIns.trash();
    this.update(this.drawIns.getAll());
  }

  startDraw(mode, params) {
    const { single } = this.props;
    single && this.deleteDraw();
    this.drawIns.changeMode(mode, params);
  }

  renderControl() {
    const { showControll = true, controllerStyle } = this.props;

    if (!showControll) return null;
    return (
      <div className="controll" style={controllerStyle}>
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          {this.actions.map(({ mode, params, icon }, idx) => {
            if (this.modes.some(i => i === mode)) {
              return (
                <button
                  key={idx}
                  className="mapbox-gl-draw_ctrl-draw-btn controllButton"
                  onClick={() => this.startDraw(mode, params)}
                >
                  <img src={icon} />
                </button>
              );
            }
            return null;
          })}
          <button
            onClick={() => this.deleteDraw()}
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
          ></button>
        </div>
      </div>
    );
  }

  render() {
    return this.renderControl();
  }
}

export default withMap(Draw);
