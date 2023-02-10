/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef,useState } from 'react';
import { Button } from '@jd/find-react';
import Draw from '@/components/DmapglMap/Draw';
import styles from './index.module.less';

const DrawTool = ({ map }) => {
  const drawIns = useRef();
  const curMode = useRef();
  const [drawToolStatus,setDrawToolStatus] = useState(false)
  const onLoad = (e) => {
    drawIns.current = e;
    e.changeMode(curMode.current);
  };
  const updateArea = (e, all) => {
    console.log('updateArea', e, all);
  };
  const changeMode = (mode) => {
    setDrawToolStatus(true);
    curMode.current = mode;
  };
  const deleteDraw = () => {
    drawIns.current.deleteAll();
  }
  return (
    <div className={styles['draw-container']}>
      <div className='customButtons'>
        <button onClick={()=>{changeMode('draw_line_string')}} className='mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon'></button>
        <button onClick={deleteDraw} className='mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash'></button>
      </div>
      {map && drawToolStatus && (
        <Draw
          map={map}
          updateArea={updateArea}
          single={false}
          showControll={false}
          modes={['draw_circle']}
          initialRadiusInKm={10}
          load={onLoad}
        />
      )}
    </div>
  );
};

export default DrawTool;
