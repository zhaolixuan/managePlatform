import React from 'react';
import {DeleteOutlined} from '@ant-design/icons';
import { Popup } from '@/components/DmapglMap';

const MarkerPopup = ({coord,setMarkerPopupStatus}) => {
  const deleteMarker = () => {
    window.eventBus.publish('delete-marker');
    setMarkerPopupStatus(false)
  }

  const onPopupClose = () => {
    setMarkerPopupStatus(false)
  }

  const html = <div>
    <DeleteOutlined onClick={deleteMarker} />
  </div>
  return (
    <Popup
      key={Math.random()}
      html={html}
      LngLat={coord}
      closeButton={false}
      close={onPopupClose}
    />
  );
};

export default MarkerPopup;
