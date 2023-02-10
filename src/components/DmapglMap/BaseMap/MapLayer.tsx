/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

class MapLayer extends Component<any> {
  Layer: any;

  map: any;

  componentDidMount() {
    const { map } = this.props;
    const { id, onClick, onMousemove } = this.props;
    if (!map) return;
    if (onClick instanceof Function) {
      map.on('click', id, (e) => {
        onClick(e, map);
      });
    }
    if (onMousemove instanceof Function) {
      map.on('mousemove', id, (e) => {
        onMousemove(e, map);
      });
    }
  }

  componentWillUnmount() {
    const { map, id, onClick, onMousemove } = this.props;

    if (onClick instanceof Function) {
      map && map.off('click', id, onClick);
    }
    if (onMousemove instanceof Function) {
      map && map.off('click', id, onMousemove);
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default MapLayer;
