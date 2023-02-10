/* eslint-disable @typescript-eslint/no-unused-vars */
// 完整配置参考 https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#styling-draw

export default ({
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
  styles
}) =>
  // 自定义图形
   styles || [
    {
      'id': 'gl-draw-polygon-fill-inactive',
      'type': 'fill',
      'filter': ['all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Polygon'],
        ['!=', 'mode', 'static']
      ],
      'paint': {
        'fill-color': fillColor,
        'fill-outline-color': fillColor,
        'fill-opacity': fillOpacity
      }
    },
    {
      'id': 'gl-draw-polygon-fill-active',
      'type': 'fill',
      'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      'paint': {
        'fill-color': fillActiveColor,
        'fill-outline-color': fillActiveColor,
        'fill-opacity': fillActiveOpacity
      }
    },
    {
      'id': 'gl-draw-polygon-midpoint',
      'type': 'circle',
      'filter': ['all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'midpoint']],
      'paint': {
        'circle-radius': lineWidth,
        'circle-color': fillActiveColor
      }
    },
    {
      'id': 'gl-draw-polygon-stroke-inactive',
      'type': 'line',
      'filter': ['all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Polygon'],
        ['!=', 'mode', 'static']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineColor,
        'line-width': lineWidth
      }
    },
    {
      'id': 'gl-draw-polygon-stroke-active',
      'type': 'line',
      'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineActiveColor,
        'line-dasharray': [0.2, 2],
        'line-width': lineActiveWidth
      }
    },
    // vertex point halos
    {
      'id': 'gl-draw-polygon-and-line-vertex-halo-active',
      'type': 'circle',
      'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
      'paint': {
        'circle-radius': lineVertexRadius,
        'circle-color': lineVertexColor
      }
    },
    {
      'id': 'gl-draw-line-inactive',
      'type': 'line',
      'filter': ['all',
        ['==', 'active', 'false'],
        ['==', '$type', 'LineString'],
        ['!=', 'mode', 'static']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineColor,
        'line-width': lineWidth
      }
    },
    {
      'id': 'gl-draw-line-active',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'active', 'true']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineActiveColor,
        'line-dasharray': [0.2, 2],
        'line-width': lineActiveWidth
      }
    },
    {
      'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
      'type': 'circle',
      'filter': ['all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static']
      ],
      'paint': {
        'circle-radius': lineWidth + 2,
        'circle-color': '#fff'
      }
    },
    {
      'id': 'gl-draw-polygon-and-line-vertex-inactive',
      'type': 'circle',
      'filter': ['all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static']
      ],
      'paint': {
        'circle-radius': lineActiveWidth,
        'circle-color': lineActiveColor
      }
    },
    {
      'id': 'gl-draw-point-point-stroke-inactive',
      'type': 'circle',
      'filter': ['all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
        ['!=', 'mode', 'static']
      ],
      'paint': {
        'circle-radius': lineWidth + 2,
        'circle-opacity': 1,
        'circle-color': '#fff'
      }
    },
    {
      'id': 'gl-draw-point-inactive',
      'type': 'circle',
      'filter': ['all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
        ['!=', 'mode', 'static']
      ],
      'paint': {
        'circle-radius': lineWidth,
        'circle-color': lineColor
      }
    },
    {
      'id': 'gl-draw-point-stroke-active',
      'type': 'circle',
      'filter': ['all',
        ['==', '$type', 'Point'],
        ['==', 'active', 'true'],
        ['!=', 'meta', 'midpoint']
      ],
      'paint': {
        'circle-radius': lineActiveWidth + 2,
        'circle-color': '#fff'
      }
    },
    {
      'id': 'gl-draw-point-active',
      'type': 'circle',
      'filter': ['all',
        ['==', '$type', 'Point'],
        ['!=', 'meta', 'midpoint'],
        ['==', 'active', 'true']],
      'paint': {
        'circle-radius': lineActiveWidth,
        'circle-color': lineActiveColor
      }
    },
    {
      'id': 'gl-draw-polygon-fill-static',
      'type': 'fill',
      'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      'paint': {
        'fill-color': fillColor,
        'fill-outline-color': fillColor,
        'fill-opacity': fillOpacity
      }
    },
    {
      'id': 'gl-draw-polygon-stroke-static',
      'type': 'line',
      'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineColor,
        'line-width': lineWidth
      }
    },
    {
      'id': 'gl-draw-line-static',
      'type': 'line',
      'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': lineColor,
        'line-width': lineWidth
      }
    },
    {
      'id': 'gl-draw-point-static',
      'type': 'circle',
      'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
      'paint': {
        'circle-radius': lineWidth,
        'circle-color': lineColor
      }
    }
  ];
