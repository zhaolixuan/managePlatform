import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/configconst';

// 可观察属性
const OBSERVABLE = {
    tableData: [],
    pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
    },
    loading: false,
    requestParama: {},
    typeOptions: [],
    typeObj: {}
};


class Store {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    //index列表数据
    @action.bound async listPage (params = {
        ...this.pagination,
        page: this.pagination.current,
        ...this.requestParama
    }) {
        try {
            runInAction(() => {
                this.loading = true;
            })
            const res = await api.listPage(params);
            runInAction(() => {
                this.tableData = res.records || [];
                this.pagination = {
                    pageSize: res.pageSize,
                    current: res.current,
                    total: res.total
                }
                this.loading = false;
            })
        } catch (error) {
            message.error(error.message);
        }
    }

    // 新增
    @action.bound async saveOrUpdate (params) {
        try {
            const res = await api.saveOrUpdate(params);
            runInAction(() => {
                if (params.id) {
                    message.success('修改成功')
                } else {
                    message.success('新增成功')
                }
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.add(params);
    }

    // 获取字典表数据
    @action.bound async queryDictionaryList (params) {
        try {
            const res = await api.queryDictionaryList(params);
            runInAction(() => {
                this.typeOptions = []
                this.typeObj = {}
                res.forEach(i => {
                    this.typeOptions.push({
                        label: i.childrenName, value: i.details
                    })
                    this.typeObj[i.details] = i.childrenName
                })
            })
        } catch (error) {
            message.error(error.msg);
        }
        // return await api.add(params);
    }





    // 删除
    @action.bound async deleteItem (params) {
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
