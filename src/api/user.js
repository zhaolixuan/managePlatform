import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

// const userCenterAdapter = getRequestInstance(domains.usercenter);
const userCenterAdapter = getRequestInstance(domains.tq_login);
const siteCenterAdapter = getRequestInstance(domains.site);
export const login = async (param) => await userCenterAdapter.post('/api/v1/login', param);

export const logout = async () => await userCenterAdapter.raw.post('/user/logout');

// 获取用户详情
export const verify = async () => await userCenterAdapter.raw.post('/oauth/web/v2/oauth/sso/verify');

// 菜单列表
export const menus = async (params) => await userCenterAdapter.raw.get('/user/web/v2/open/permission/user/menus', { params });

// 菜单列表
export const refreshToken = async (params) => await userCenterAdapter.raw.post(`/oauth/web/v2/oauth/sso/refreshToken?refresh_token=${params.refresh_token}`);


// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);

