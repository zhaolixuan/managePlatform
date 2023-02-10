import { useEffect } from 'react';
import Card from '@/components/Card';
import { Empty } from '@jd/find-react'
import * as echarts from 'echarts';
import styles from './chart.module.less';

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
 const dpr = Math.round((Number(document.querySelector('html').style.fontSize.slice(0, -2))))
function chart(props) {
  const {
    id = 0,
    data: { title = '', unit = '', x = [], y1 = [], y2 = [], legendData = ['市级派出（辆）', '区级派出（辆）'] },
    style = {},
    theme = 'white'
  } = props;
  const setOption = () => {
    return {
      color:[new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: theme === 'white'? 'rgba(85,223,255,1) ': 'rgba(0, 230, 150, 1)',
        },
        {
          offset: 1,
          color: theme === 'white'? 'rgba(85,223,255,0) ':'rgba(0, 230, 150, 0)',
        },
      ]),new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: theme === 'white'?  'rgba(205,192,253,1) ':'rgba(0, 195, 255, 1)',
        },
        {
          offset: 1,
          color: theme === 'white'?  'rgba(205,192,253,0) ':'rgba(0, 195, 255, 0)',
        },
      ])],
      tooltip: {
        trigger: 'item',
        show:  dpr < 75 ? true : false,
        position: 'bottom',
        z: 60
      },
      legend: {
        top: '2%',
        data: legendData,
        show:  dpr < 75 ? false : true,
        textStyle: {
          color: theme === 'white' ? '#3C3C3C' : '#FFF',
          fontSize: 8,//图例文字字体大小
        },
        
        itemStyle:{
          borderWidth: 6,
            // borderWidth:100
        },
        itemHeight: 6,
        itemWidth: dpr < 75 ? 15 : 30,

      },
      grid: {
        top: '20%',
        left:  '15%',
        bottom:  dpr < 75 ? '20%': '15%',
        right:  dpr < 75 ? '18%' : '15%',
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
      yAxis: [
        {
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
        {
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
      ],
      series: [
        {
          name: legendData[0],
          type: 'line',
          symbol: 'circle',
          yAxisIndex: '0',
          symbolSize: 6,
          itemStyle: {
            color: theme === 'white'?  'rgba(50,110,255,1)':'rgba(0, 230, 150, 1)',
            borderColor: theme === 'white'? 'rgba(50,110,255,0.4)' :'rgba(0, 230, 150, 0.4)',
            borderWidth: 6,
          },
          label: {
            show: dpr < 75 ? false : true,
            position: 'bottom',
            fontSize: 12,
            color: theme === 'white' ? 'rgba(50,110,255,1)' : 'rgba(0, 230, 150, 1)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme === 'white' ? 'rgba(85,223,255,1) ' : 'rgba(0, 230, 150, 1)',
              },
              {
                offset: 1,
                color: theme === 'white' ? 'rgba(85,223,255,0) ' : 'rgba(0, 230, 150, 0)',
              },
            ]),
          },
          data: y1,
        },
        {
          name: legendData[1],
          type: 'line',
          symbol: 'circle',
          yAxisIndex: '1',
          symbolSize: 6,
          itemStyle: {
            color: theme === 'white'?  'rgba(140,70,255,1)':'rgba(0, 195, 255, 1)',
            borderColor: theme === 'white'?  'rgba(140,70,255,0.4)':'rgba(0, 195, 255, 0.4)',
            borderWidth: 6,
          },
          label: {
            show: dpr < 75 ? false : true,
            fontSize: 12,
            color: theme === 'white' ? 'rgba(140,70,255,1)' : 'rgba(0, 195, 255, 1)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme === 'white' ? 'rgba(205,192,253,1) ' : 'rgba(0, 195, 255, 1)',
              },
              {
                offset: 1,
                color: theme === 'white' ? 'rgba(205,192,253,0) ' : 'rgba(0, 195, 255, 0)',
              },
            ]),
          },
          data: y2,
        },
      ],
    };
  };
  useEffect(() => {
    const myChart = echarts.init(document.getElementById(`myChart${id}`));
    myChart.setOption(setOption(x, y1, y2, theme));
    console.log('chart', x, y1, y2);
  }, [x, y1, y2, theme]);
  return (
    // <div className={styles.chart}>
    //   <div className={styles.chartHead}>
    //     <div className={styles.chartTitle}>{title || ''}</div>
    //     <div className={styles.chartUnit}>{unit || ''}</div>
    //   </div>
    //   <div className={styles.chartContent}>
    //     <div
    //       id={`myChart${id}`}
    //       className={`${styles[`${styleType}MyChart`]}`}
    //     ></div>
    //   </div>
    // </div>

    <Card title={title || ''} ext={unit || ''} className={styles.chart}>
    <div className={styles.chartContent}>
        <div
          id={`myChart${id}`}
          className={styles.myChart}
          style={{ display: (x.length && y1.length && y2.length) ? 'block' : 'none' }}
        ></div>
          {(!x.length && !y1.length && !y2.length) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
    </Card>
  );
}

export default chart;
