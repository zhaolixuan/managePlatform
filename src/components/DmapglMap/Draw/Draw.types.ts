export interface DrawProps {
    map?: any;
    updateArea?: any; // 面积更新回调
    load?: any; // 创建完成后的回调，返回Draw实例
    modes?: string[]; // draw_polygon: 自定义图形，draw_rectangle: 矩形，draw_circle: 圆形
    showControll?: boolean; // 是否显示默认controll
    single?: boolean; // 是否只保留一个，只有mode为rectangle时有效
    lineColor?: string; // 线颜色
    lineWidth?: number; // 线宽度
    lineActiveColor?: string; // 选中线颜色
    lineActiveWidth?: number; // 选中线宽度
    fillColor?: string; // 填充颜色
    fillOpacity?: number; // 填充颜色透明度
    fillActiveColor?: string; // 选中填充颜色
    fillActiveOpacity?: number; // 选中填充颜色透明度
    lineVertexRadius?:number; // 选中顶点半径
    lineVertexColor?: string; // 选中顶点颜色
    styles?: []; // 自定义样式，如设置则优先使用
    data?: any[];
    controllerStyle?: object;
    // draw_circle
    initialRadiusInKm?: number // 初始化半径
  }
