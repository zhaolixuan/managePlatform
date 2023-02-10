/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-require-imports */
const Mock = require('mockjs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// devserver proxy, mock api
module.exports = function (app) {
  app.post('/mock-usercenter/api/v1/login', (req, res) => {
    res.json({
      code: 200,
      message: 'success',
      data: {
        id: 5,
        username: 'admin',
        realName: 'admin',
        idNumber: '',
        mobile: '15******11',
        email: 'c************@163.com',
        registerTime: 1537194524054,
        lastestLoginTime: 1605609655487,
        userType: 4,
        userStatus: 1,
        verifyStatus: 1,
        avatarUrl: '',
        databasePassword: 'admin',
        ticket: '7c0042261fbd4d31e05fbdd7e6f6aec2',
        salt: '4192345980438703',
        uuid: '1dada9ff-57b2-4204-886d-7a735fafa5e1',
      },
    });
  });
  app.post('/mock-usercenter/user/logout', (req, res) => {
    res.json({
      code: 200,
    });
  });

  // 请求列表数据的 mock
  app.post('/mock-table-list', (req = {}, res) => {
    console.log(req);
    res.json({
      code: 200,
      message: 'success',
      data: {
        items: [{ id: 1 }, { id: 2 }],
        total: 100,
        pageNum: 1,
        pageSize: 10,
      },
    });
  });

  app.get('/datashare/auth/myapis', (req, res) => {
    const result = Mock.mock({
      pageNum: 1,
      totalCount: 36,
      pageSize: 10,
      'items|10': [
        {
          id: '@id',
          created: '@date("yyyy-MM-dd")',
          apiName: '@name',
          serviceName: '@name',
          apiDesc: '@name',
        },
      ],
    });
    res.json({ code: 200, data: result });
  });

  // 获取页面接口： 从本地文件获取
  // 获取组件配置： 从接口获取
  // 提交 dsl： 写入本地文件

  app.use(
    createProxyMiddleware(['/api/cityos'], {
      target: 'https://bxp.sw.beijing.gov.cn:81/',
      changeOrigin: true,
    }),
    createProxyMiddleware(['/api', '/server'], {
      target: 'http://10.241.242.245/',
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive',
      },
    }),
    createProxyMiddleware(['/icity-support-manager/jinxin'], {
      target: 'https://bxp.sw.beijing.gov.cn:81/report-api-dev', // 政务云
      // target: 'https://bxp.sw.beijing.gov.cn', // 政务云
      // target: 'http://10.241.242.245/', // 京东云
      // target: 'http://192.168.43.21:8044/', // 本地联调
      changeOrigin: true,
      pathRewrite: {
        '^/icity-support-manager/jinxin': '/jinxin'
      }
    }),
    createProxyMiddleware(['/icity-support-screen', '/icity-support-manager'], {
      target: 'https://bxp.sw.beijing.gov.cn:81/report-api-dev', // 政务云
      // target: 'https://bxp.sw.beijing.gov.cn:81/report-api-test', // 政务云
      // target: 'https://bxp.sw.beijing.gov.cn', // 政务云
      // target: 'http://10.241.242.245/', // 京东云
      // target: 'http://192.168.43.21:8044/', // 本地联调
      changeOrigin: true,
    }),
    createProxyMiddleware(['/suppor-file'], {
      target: 'https://s3.cn-north-1.jdcloud-oss.com', // oss文件服务器
      // target: 'https://bxp.sw.beijing.gov.cn', // 政务云
      // target: 'http://10.241.242.245/', // 京东云
      // target: 'http://192.168.43.21:8044/', // 本地联调
      changeOrigin: true,
      // pathRewrite: {
      //   '^/suppor-file': ''
      // }
    }),
    createProxyMiddleware(['/report-sso-test', '/report-manager-test'], {
      // target: 'https://bxp.sw.beijing.gov.cn/', // 政务云
      target: 'https://bxp.sw.beijing.gov.cn:81/report-api-dev',
      // target: 'https://bxp.sw.beijing.gov.cn',
      changeOrigin: true,
    }),
    createProxyMiddleware(['/gov', '/jczl'], {
      // target: 'https://bxp.sw.beijing.gov.cn/', // 政务云
      target: 'https://bxp.sw.beijing.gov.cn',
      changeOrigin: true,
    }),
    createProxyMiddleware(['/bxp'], {
      target: 'https://bxp.sw.beijing.gov.cn:81/dright',
      changeOrigin: true,
      pathRewrite:{'/bxp':''}
    }),
    createProxyMiddleware(['/api', '/dright', '/gw'], {
      target: 'https://bxp.sw.beijing.gov.cn:81',
      changeOrigin: true,
    }),
    createProxyMiddleware(['/down'], {
      target: 'https://bxp.sw.beijing.gov.cn',
      changeOrigin: true,
      pathRewrite:{'/down':''}
    })
  );
};
