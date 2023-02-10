import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/dictionary';

// 可观察属性
const OBSERVABLE = {
    areaList: [],
    sealingTypeList: [],
    IndextableData: [],
    tableData: [],
    pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
    },
    loading: false,
    requestParama: {},
    gisData: [],
    streetList: [],
    treeData: []
};

const recursive = (data) => {
    // console.log(data, 'adata')
    data.forEach(item => {
        item['title'] = item.childrenName
        item['key'] = item.id
        // console.log(item)
        if (item.supportDictionaryChildVO && item.supportDictionaryChildVO.length) {
            item['children'] = item.supportDictionaryChildVO
            recursive(item.supportDictionaryChildVO)
        }
    })
}

const getUrlParams2 = (name) => {
    let urlStr = window.location.href.split('?')[1]
    const urlSearchParams = new URLSearchParams(urlStr)
    const result = Object.fromEntries(urlSearchParams.entries())
    return result[name]
}

class Store {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    //index列表数据
    @action.bound async queryDictionaryGroupByParentCodeList (params = {
        ...this.pagination,
        page: this.pagination.current,
        ...this.requestParama
    }) {
        try {
            runInAction(() => {
                this.loading = true;
            })
            const res = await api.queryDictionaryGroupByParentCodeList(params);
            console.log(res, 'res')
            runInAction(() => {
                this.IndextableData = res.list || [];
                this.pagination = {
                    pageSize: res.pageSize,
                    current: res.page,
                    total: res.total
                }
                this.loading = false;
            })
        } catch (error) {
            message.error(error.message);
        }
    }

    // detail列表数据
    @action.bound async regionsPageList (params) {
        try {
            runInAction(() => {
                this.loading = true;
            })
            const res = await api.queryDictionaryByParentCode({ ...params, ...this.pagination, ...this.requestParama, page: this.pagination.current, parentCode: getUrlParams2('parentCode') });
            console.log(res, 'res')
            runInAction(() => {
                this.tableData = res.list.map(i => {
                    i.parentName = getUrlParams2('parentName')
                    i.parentCode = getUrlParams2('parentCode')
                    return i
                }) || [];
                this.pagination = {
                    pageSize: res.pageSize,
                    current: res.page,
                    total: res.total
                }
                this.loading = false;
            })
        } catch (error) {
            message.error(error.message);
        }
    }

    // 第一层新增
    @action.bound async IndexaddRegions (params) {
        try {
            const res = await api.Indexadd(params);
            runInAction(() => {
                message.success('新增成功')
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.add(params);
    }

    // 新增
    @action.bound async addRegions (params) {
        try {
            const res = await api.add(params);
            runInAction(() => {
                message.success('新增成功')
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.add(params);
    }


    // 第一层修改
    @action.bound async IndexupdateRegions (params) {
        try {
            const res = await api.Indexupdate(params);
            runInAction(() => {
                message.success('修改成功')
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.update(params);
    }
    // 修改
    @action.bound async updateRegions (params) {
        try {
            const res = await api.update(params);
            runInAction(() => {
                message.success('修改成功')
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.update(params);
    }

    // 获取子集树
    @action.bound async getTree (params) {
        return 1
    }
    // 解除关联
    @action.bound async removeBinding (params) {
        console.log(params)
        return await api.removeBinding(params);
    }

    // 删除
    @action.bound async deleteItem (params) {
        console.log(params)
        return await api.deleteItem(params);
    }

    // @action.bound reset() {
    //   Object.assign(this, OBSERVABLE);
    // }

    @action.bound update (data) {
        console.log(data)
        Object.assign(this, data);
    }
}

export default new Store();
