/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from 'react';
import Player from 'xgplayer';
import styles from './index.module.less';
// import 'xgplayer/src/skin/index.js';

const VieoPlayer = ({ url }) => {

  const initPlayer = (node) => {
    if(!node)return;
    const player = new Player({
      id: 'player',
      url,
      fitVideoSize: 'auto',
    });
  } 
  return <div id='player' className={styles.player} ref={(node)=>{node && initPlayer(node)}}></div>;
};

export default VieoPlayer;
