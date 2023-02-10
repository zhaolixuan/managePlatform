import { useEffect } from 'react';
import * as echarts from 'echarts';
import Card from '@/components/Card';
import styles from './chart.module.less';

const dpr = Math.round((Number(document.querySelector('html').style.fontSize.slice(0, -2))))

/**
 *
 * @param {Array} props.x x轴的数据
 * @param {Array} props.y y轴的数据
 * @param {String} props.title tab左侧的标题
 * @param {String} props.unit tab右侧的标题
 * @param {Number} props.width tab宽度
 * @param {Number} props.height tab高度
 * @returns echarts图表tab
 */
function chart(props) {
  const {
    data: { title = '', unit = '', x = [], y = [] },
    styleType,
    theme = 'white'
  } = props;
  const setOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        show:  dpr < 75 ? true : false,
        position: 'bottom',
        z: 60
      },
      grid: {
        top: dpr < 75 ? 5 : 30,
        left: styleType === 'site' ? 48 : 35,
        bottom: dpr < 75 ? 18 : 20,
        right: 16,
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#90949B',
          },
        },
        axisTick: {
          show: false,
        },
        data: x,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#90949B',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dotted',
            color: '#353E4C',
          },
        },
      },
      series: [
        {
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: theme === 'white'?  'rgba(50,110,255,1)': 'rgba(0, 255, 250, 1)',
            borderColor: theme === 'white'? 'rgba(50,110,255,0.4)' :'rgba(0, 255, 250, 0.4)',
            borderWidth: 6,
          },
          label: {
            show: dpr < 75 ? false : true,
            fontSize: 12,
            color: theme === 'white'?  'rgba(50,110,255,1)': 'rgba(0, 255, 250, 1)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme === 'white'? 'rgba(85,223,255,1) ':'rgba(0, 255, 250, 1)',
              },
              {
                offset: 1,
                color: theme === 'white'? 'rgba(85,223,255,0) ':'rgba(0, 255, 250, 0)',
              },
            ]),
          },
          data: y,
        },
      ],
    };
  };
  useEffect(() => {
    const myChart = echarts.init(document.getElementById('myChart'));
    myChart.setOption(setOption(x, y, theme));
  }, [x, y, theme]);
  return (
    <Card title={title || ''} ext={unit || ''} className={`${styles[`${styleType}Chart`]}`}>
      <div className={styles.chartContent}>
          <div
            id='myChart'
            className={`${styles[`${styleType}MyChart`]}`}
          ></div>
        </div>
    </Card>
  );
}

export default chart;
