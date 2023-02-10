import { useEffect } from 'react';
import * as echarts from 'echarts';
import styles from './index.module.less';

/**
 *
 * @param {Array} props.x x轴的数据
 * @param {Array} props.y y轴的数据
 * @returns echarts图表tab
 */
function chart(props) {
  const {
    data: { x = [], y = [] },
  } = props;
  const setOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        position: 'bottom',
        z: 60,
        formatter: '{b}<br />{c}',
        extraCssText:'text-align:center;padding: 7px 18px;font-weight: 600;background-color:rgba(255,255,255,1);color:rgba(27,27,27,1);border: 1px solid rgba(112, 125, 134, 0.24)'
      },
      grid: {
        top: 30,
        left: 30,
        bottom: 19,
        right: 0,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#3C3C3C',
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
            color: '#3C3C3C',
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
          symbol: 'circle',//拐点设置为实心
          smooth: true,
          symbolSize: 14,//拐点大小
          animation:false,//false: hover圆点不缩放 .true:hover圆点默认缩放
          itemStyle: {
            normal:{
              color:  'rgba(75,102,254,1)',
              borderColor: 'rgba(255,255,255,1)',
              borderWidth: 6,
              shadowColor: 'rgba(112, 125, 134, 0.24)',
              shadowBlur: 5
            }
          },
          label: {
            show: true,
            fontSize: 12,
            color: 'rgba(75,102,254,1)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:  'rgba(48,79,254,0.12) ',
              },
              {
                offset: 1,
                color: 'rgba(48,79,254,0.04) ',
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
    myChart.setOption(setOption(x, y));
  }, [x, y]);
  return (
      <div
        id='myChart'
        className={`${styles['myChart']}`}
      ></div>
  );
}

export default chart;
