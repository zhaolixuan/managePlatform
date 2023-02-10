/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-multi-assign */
import React from 'react';
import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
import './index.css';

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        // console.log('player is ready');
        onReady && onReady(player);
      }));
    } else {
      // you can update player here [update player through props]
      const player = playerRef.current;
      // console.log('playerplayerplayer===', player);
      player.src(options.sources[0].src);
      player.autoplay(true);
    }
  }, [options, videoRef]);

  return (
    <div data-vjs-player>
      <video
        style={{
          width: 500,
          height: 200,
        }}
        ref={videoRef}
        className='video-js vjs-big-play-centered'
      />
    </div>
  );
};

export default VideoJS;
