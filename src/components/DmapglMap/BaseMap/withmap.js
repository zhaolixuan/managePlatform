/* eslint-disable react/jsx-no-comment-textnodes */
import * as React from 'react';
import mapContext from './context';
import MapLayer from './MapLayer';

// eslint-disable-next-line max-len
export default function withMap(Component) {
  return React.forwardRef((props , ref ) => (
    <mapContext.Consumer>
      {map => <MapLayer map={map} {...props} >
        <Component map={map} {...props} ref={ref} />
      </MapLayer>}
    </mapContext.Consumer>
    ));
}