import React from 'react';
import {DeleteOutlined} from '@ant-design/icons';
import { Popup } from '@/components/DmapglMap';

const DrawPopup = ({coord,setPopupStatus,curDrawId,areaGeojsonData,setAreaGeojsonData}) => {
  const deleteDraw = () => {
    window.eventBus.publish('delete-draw',{id:curDrawId,areaGeojsonData,setAreaGeojsonData});
    setPopupStatus(false)
  }

  const html = <div>
    <DeleteOutlined onClick={deleteDraw} />
  </div>
  return (
    <Popup
      key={Math.random()}
      html={html}
      LngLat={coord}
      closeButton={false}
      // close={onPopupClose}
    />
  );
};

export default DrawPopup;
