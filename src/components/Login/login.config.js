import { PATHS } from '@/router/constant';
import { domains } from '@/config';

export default {
  baseUrl: domains.login,
  loginPath: '/user/login', // 登录页的路由路径
  loginApi: '/area/user/login', // 登录接口
  loginValidate: '/area/user/validate',
  hasVerifyCode: false, // 是否有验证码
  sendCodeApi: '/mock-usercenter/user/verify', // 验证码接口
  redirectAfterLogin: PATHS.SITE, // 登录后的跳转链接
  pwdEncrypt: true, // 密码是否加密
};
