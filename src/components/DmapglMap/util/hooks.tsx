import { useEffect, useRef } from 'react';

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useProperty({
  id,
  map,
  init,
  layout = null,
  paint = null
}, deps: any[]) {
  useEffect(() => {
    if (!init) return;

    if (layout) {
      const value = layout instanceof Function ? layout() : layout;
      Object.keys(value).forEach((key) => {
        map.setLayoutProperty(id, key, value[key]);
      });
    }
    if (paint) {
      const value = paint instanceof Function ? paint() : paint;
      Object.keys(value).forEach((key) => {
        map.setPaintProperty(id, key, value[key]);
      });
    }
  }, [...deps, init]);
}
