/* eslint-disable */
import React,{useState,useEffect} from 'react';
import { requestFullScreen, exitFullScreen, isFullscreenElement } from "@/utils/util";
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

const FullScreen = ({fullScreen,setFullScreen,extraFunction}) => {
  const [originResizeFunc, setOriginResizeFunc] = useState(null);

  function onEscCancelFull() {
  	// 用于反显状态
    setFullScreen(isFullscreenElement());
  }

  useEffect(() => {
    // 监听 键盘ESC 退出全屏(可以使用屏幕大小监听，触发对应的事件)
    if (window.addEventListener) {
      window.addEventListener("resize", onEscCancelFull, false);
    } else {
      setOriginResizeFunc(window.onresize);
      window.onresize = onEscCancelFull;
    }
    // 销毁清除事件
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener("resize", onEscCancelFull, false);
      } else {
        window.onresize = originResizeFunc;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    {fullScreen ? (<FullscreenExitOutlined onClick={
      () => {
        exitFullScreen();
        setFullScreen(false);
      }} style={{ fontSize: "20px", marginRight: "10px" }} />) 
      : (<FullscreenOutlined onClick={
      () => {
        // requestFullScreen(document.body);
        setFullScreen(true);
        requestFullScreen('map-draw'); // map-draw为modal的id
        // 由于dom加载速度的问题，使用延时来优化下
        if(!fullScreen){
          setTimeout(()=>{
            extraFunction()
          },500);
        }
     }} style={{ fontSize: "20px", marginRight: "10px" }} />)
    }
    </>
   )
}

export default FullScreen;