import { Progress } from '@jd/find-react';
import styles from './progress.module.less';

const JdProgress = ({
  percent = 0,
  steps = 20,
  showInfo = false,
  theme = 'white',
}) => {
  const strokeBgColor = theme === 'white'?'#B1E2FFFF':'#52c41a'
  const strokeColor = theme === 'white'?{
     '0%':'rgba(50,110,255,1)', 
     '100%':'rgba(70,220,255,1)' 
  }:{
    '0%': '#00C3FF',
    '100%': '#00E696',
  }

  const dpr = Math.round((Number(document.querySelector('html').style.fontSize.slice(0, -2))))
  const itemHight = (8/dpr) + 'rem' 
  // // console.log(dpr ,'11111');
  let step = 20
  if (dpr > 70) {
    step = steps
  }else{
    step = steps/1.5
  }

  return (
    <div className={styles['progress-wrap']} style={{ height:  itemHight}}>
      <Progress
        percent={percent}
        size='small'
        showInfo={showInfo}
        strokeColor={strokeColor}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height:  itemHight
        }}
      />
      <Progress percent={0} steps={step} size='small' showInfo={showInfo} strokeColor={strokeBgColor} style={{ height:  itemHight}}/>
    </div>
  );
};

export default JdProgress;
