import { SettingOutlined } from '@ant-design/icons';

export default [
    {
        path: '/manage/control',
        code: '/manage/control',
        name: '数据管理',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/PacketControl'),
        code: '/manage/control',
        routes: [
            {
                path: '/manage/control/data',
                code: '/manage/control/data',
                name: '封控数据管理',
                exact: true,
                component: () => import('@/views/Manage/DataControl/PacketControl'),
                // component: () => import('@/views/Manage/DataControl/CloseStore'),
                code: 'manage/control/data'
            },
            {
                path: '/manage/control/site',
                code: '/manage/control/site',
                name: '保供场所管理',
                // url:'https://docs.qq.com/sheet/DTXV1cUxjR1pHVG1x',  // 外链
                exact: true,
                component: () => import('@/views/Manage/DataControl/Site'),
                hideChildrenInMenu: true,
                routes: [
                    {
                        path: '/manage/control/site/stock-sell-storage',
                        code: 'Stocksellstorage',
                        name: '进销存维护',
                        exact: true,
                        component: () => import('@/views/Manage/DataControl/Site/components/StockSellStorage'),
                    }
                ]
            },
            {
                path: '/manage/control/replenishment-management',
                code: '/manage/control/replenishment-management',
                name: '缺补货管理',
                exact: true,
                component: () => import('@/views/Manage/DataControl/ReplenishmentManagement'),
                hideChildrenInMenu: true,
                routes: [
                    {
                        path: '/manage/control/replenishment-management/shortage-of-fill',
                        code: '/manage/control/replenishment-management/shortage-of-fill',
                        name: '缺补填报',
                        exact: true,
                        component: () => import('@/views/Manage/DataControl/ReplenishmentManagement/components/ShortageOfFill'),
                    }
                ]
            },
            {
                path: '/manage/control/close-store',
                code: '/manage/control/close-store',
                name: '关停门店数据管理',
                exact: true,
                component: () => import('@/views/Manage/DataControl/CloseStore'),
                hideChildrenInMenu: true,
            },
            {
                path: '/manage/control/iframe1',
                code: '/manage/control/iframe1',
                name: '链家数据管理',
                url: 'https://docs.qq.com/sheet/DZUZwaUFyRnhBdVlz',  // 外链
                exact: true,
            },
            {
                path: '/manage/control/iframe2',
                code: '/manage/control/iframe2',
                name: '便利店数据管理',
                url: 'https://docs.qq.com/sheet/DZUFVTnJ2YUFnVHRa',  // 外链
                exact: true,
            },
            {
                path: '/manage/control/iframe3',
                code: '/manage/control/iframe3',
                name: '前置仓数据管理',
                url: 'https://docs.qq.com/sheet/DZVVpcnZDd0FpWkto',  // 外链
                exact: true,
            },

            {
                path: '/manage/control/grainoil',
                code: '/manage/control/grainoil',
                name: '采集粮油数据',
                exact: true,
                component: () => import('@/views/Manage/DataControl/Grainoil'),
                hideChildrenInMenu: true,
            },

            // {
            //   path: '/manage/control/iframe4',
            //   code: '/manage/control/iframe4',
            //   name: '关停门店数据管理',
            //   url: 'https://docs.qq.com/sheet/DZWxhRHFnVUlhbkJP',  // 外链
            //   exact: true,
            // }
        ],
    },
    {
        path: '/manage/board',
        code: '/manage/board',
        name: '数据看板',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/LogManagement'),
        routes: [
            {
                path: '/manage/board/analysis',
                code: '/manage/board/analysis',
                name: '运营分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/LogManagement'),
            },
        ]
    },
    {
        path: '/manage/car',
        code: '/manage/car',
        name: '车辆司乘人员',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/CarPeopleReport'),
        routes: [
            {
                path: '/manage/car/report',
                code: '/manage/car/report',
                name: '报备管理',
                exact: true,
                component: () => import('@/views/Manage/DataControl/CarPeopleReport'),
            },
        ]
    },
    {
        path: '/manage/dict',
        code: '/manage/dict',
        name: '字典管理',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/Dictionary'),
        routes: [
            {
                path: '/manage/dict/list',
                code: '/manage/dict/list',
                name: '列表',
                exact: true,
                hideChildrenInMenu: true,
                component: () => import('@/views/Manage/DataControl/Dictionary'),
                routes: [
                    {
                        path: '/manage/dict/list/detail',
                        code: 'dictCheck',
                        name: '列表查看',
                        exact: true,
                        component: () => import('@/views/Manage/DataControl/Dictionary/detail'),
                    }
                ]
            },
        ]
    },
    {
        path: '/manage/doc',
        code: '/manage/doc',
        name: '文档管理',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        url: 'https://bxp.sw.beijing.gov.cn/report-api-dev/icity-support-screen/swagger-ui/',  // 外链
        routes: [
            {
                path: '/manage/doc/api',
                code: '/manage/doc/api',
                name: 'api文档',
                exact: true,
                url: 'https://bxp.sw.beijing.gov.cn/report-api-dev/icity-support-screen/swagger-ui/',  // 外链
            },
        ]
    },
    {
        path: '/manage',
        code: '/manage',
        name: 'children1',
        img: { src: 'icon_data_analysis' },
        exact: true,
        routes: [
            {
                path: '/manage/page1',
                code: '/manage/page1',
                name: 'children2',
                exact: true,
                component: () => import('@/views/Manage/module2'),
                routes: [
                    {
                        path: '/manage/page1',
                        code: '/manage/page1',
                        name: 'children3',
                        exact: true,
                        component: () => import('@/views/Manage/module2'),
                    },
                ],
            },
        ],
    },
    {
        path: '/manage/dataupload',
        code: '/manage/dataupload',
        name: '数据统计分析上传',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/DataUpload'),
        routes: [
            {
                path: '/manage/dataupload/sfzggw',
                code: '/manage/dataupload/sfzggw',
                name: '市发展改革委数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/sswj',
                code: '/manage/dataupload/sswj',
                name: '市商务局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/slshwzcbj',
                code: '/manage/dataupload/slshwzcbj',
                name: '市粮食和物资储备局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/sscjdglj',
                code: '/manage/dataupload/sscjdglj',
                name: '市市场监督管理局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/swsjkw',
                code: '/manage/dataupload/swsjkw',
                name: '市卫生健康委数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/sjxj',
                code: '/manage/dataupload/sjxj',
                name: '市经信局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/syjj',
                code: '/manage/dataupload/syjj',
                name: '市药监局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/sjtw',
                code: '/manage/dataupload/sjtw',
                name: '市交通委数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/skwzgcgwh',
                code: '/manage/dataupload/skwzgcgwh',
                name: '市科委、中关村管委会数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/nyncj',
                code: '/manage/dataupload/nyncj',
                name: '农业农村局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            },
            {
                path: '/manage/dataupload/szwfwj',
                code: '/manage/dataupload/szwfwj',
                name: '市政务服务局数据分析上传',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataUpload'),
            }
        ],
    },
    {
        path: '/manage/dataview',
        code: '/manage/dataview',
        name: '数据统计分析查看',
        img: { iconName: <SettingOutlined /> },
        exact: true,
        component: () => import('@/views/Manage/DataControl/DataViews'),
        routes: [
            {
                path: '/manage/dataview/list',
                code: '/manage/dataview/list',
                name: '全部数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/sfzggw',
                code: '/manage/dataview/sfzggw',
                name: '市发展改革委数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/sswj',
                code: '/manage/dataview/sswj',
                name: '市商务局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/slshwzcbj',
                code: '/manage/dataview/slshwzcbj',
                name: '市粮食和物资储备局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/sscjdglj',
                code: '/manage/dataview/sscjdglj',
                name: '市市场监督管理局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/swsjkw',
                code: '/manage/dataview/swsjkw',
                name: '市卫生健康委数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/sjxj',
                code: '/manage/dataview/sjxj',
                name: '市经信局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/syjj',
                code: '/manage/dataview/syjj',
                name: '市药监局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/sjtw',
                code: '/manage/dataview/sjtw',
                name: '市交通委数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/skwzgcgwh',
                code: '/manage/dataview/skwzgcgwh',
                name: '市科委、中关村管委会数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/nyncj',
                code: '/manage/dataview/nyncj',
                name: '农业农村局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            },
            {
                path: '/manage/dataview/szwfwj',
                code: '/manage/dataview/szwfwj',
                name: '市政务服务局数据分析',
                exact: true,
                component: () => import('@/views/Manage/DataControl/DataViews'),
            }
        ],
    },
    {
        path: '/manage/system-management',
        code: '/manage/system-management',
        name: '系统管理',
        exact: true,
        img: { iconName: <SettingOutlined /> },
        component: () => import('@/views/Manage/DataControl/System'),
        routes: [
            {
                path: '/manage/system/config',
                code: '/manage/system/config',
                name: '系统配置',
                exact: true,
                component: () => import('@/views/Manage/DataControl/System'),
            },
            {
                path: '/manage/operation/log',
                code: '/manage/operation/log',
                name: '操作日志',
                exact: true,
                component: () => import('@/views/Manage/DataControl/OperationLog'),
            },
            {
                path: '/manage/ConfigConst/list',
                code: '/manage/ConfigConst/list',
                name: '常量列表',
                exact: true,
                hideChildrenInMenu: true,
                component: () => import('@/views/Manage/DataControl/ConfigConst'),
            },
        ]
    },

    // {
    //   path: '/manage/page2',
    //   name: '测试模块2',
    //   img: { iconName: <DeploymentUnitOutlined /> },
    //   exact: true,
    //   component: () => import('@/views/Manage/module2'),
    // },
]
