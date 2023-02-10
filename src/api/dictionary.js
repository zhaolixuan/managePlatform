import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 获取1层字典管理列表
export const queryDictionaryGroupByParentCodeList = async (param) => await managerCenterAdapter.post('dictionary/queryDictionaryGroupByParentCodeList', param);




// 获取2层字典管理列表
export const queryDictionaryByParentCode = async (param) => await managerCenterAdapter.post('/dictionary/queryDictionaryByParentCode', param);



// 第一层新增
export const Indexadd = async (param) => await managerCenterAdapter.post('/dictionary/add', param);
// 新增
export const add = async (param) => await managerCenterAdapter.post('/dictionary', param);
// 第一层修改
export const Indexupdate = async (param) => await managerCenterAdapter.put('/dictionary/updateFirstFloor', param);
// 修改
export const update = async (param) => await managerCenterAdapter.put('/dictionary', param);

// 删除
export const deleteItem = async (param) => await managerCenterAdapter.post(`/dictionary/delBatch`, param);

// 解除关联
export const removeBinding = async (param) => await managerCenterAdapter.post(`/dictionary/removeBinding`, param);

// 查询字典树
export const getTree = async (param) => await managerCenterAdapter.get(`/dictionary/tree?id=${param.id}`);

// 新增 --- 查询父类name
export const getParentNameAndCodeList = async (param) => await managerCenterAdapter.get(`/dictionary/queryParentNameAndCodeList?parentName=${param?.name}&parentCode=${param?.code}`, param);

// 新增 --- 查询父类ID
export const queryParentIdByChildName = async (param) => await managerCenterAdapter.get(`/dictionary/queryParentIdByChildName?childrenName=${param}`, param);

// 新增 --- 查询父类code
// export const getParentCodeList = async (param) => await managerCenterAdapter.get(`/dictionary/parentCodeList?parentCode=${param.code}`, param);


