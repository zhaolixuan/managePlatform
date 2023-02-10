/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks'; // 业务中，和路由相关的使用此hooks
import { lightMapConfig, darkMapConfig } from '@/components/GisMap/utils/mapConfig'
import styles from './index.module.less';

const ThemeTool = ({  themeToolConfig }) => {
  const { bottom = 0, right = 0 } = themeToolConfig;
  // const [theme, setTheme] = useState('dark');
  const gis = useStore('gis');

  const changeTheme = () => {
    if (gis.theme === 'dark') {
      gis.setTheme('white');
      map.setStyle(lightMapConfig.style, { diff: false });
    } else {
      gis.setTheme('dark');
      map.setStyle(darkMapConfig.style, { diff: false });
    }
  };

  // eslint-disable-next-line import/no-dynamic-require
  const img = require(`@/assets/images/${gis.theme}/theme.png`);

  return (
    <div className={`${styles.wrapper}`} onClick={changeTheme} style={{ right, bottom }}>
      <img src={img} alt='主题icon' />
    </div>
  );
};

export default observer(ThemeTool);
