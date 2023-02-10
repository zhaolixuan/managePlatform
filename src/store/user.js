import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
// import { PATHS } from '@/router/constant';
import * as api from '@/api/user';

const userInfoStr = window.sessionStorage.getItem('user_info') || '{}';
// 可观察属性
const OBSERVABLE = {
    preView: '/',
    userInfo: userInfoStr && JSON.parse(userInfoStr),
    newCheckAllList: []
};

class User {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    @action.bound async logout () {
        try {
            // await api.logout();
            runInAction(() => {
                this.reset();
                sessionStorage.removeItem('user_info');
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('refresh_token');
                sessionStorage.removeItem('manageMenus');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('gsiMenus');
                sessionStorage.removeItem('area');
                sessionStorage.removeItem('isLogin');
                localStorage.removeItem('access_token');

                // this.preView = PATHS.DASHBOARD;
                // window.location.hash = PATHS.LOGIN;
                window.location.href = `${process.env.REACT_APP_LOGIN_URL}/#/login?tenantName=领导驾驶舱&returnUrl=${window.location.href}`;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 获取图例
    @action.bound async getCheckBoxData (params, CheckedData) {
        try {
            const res = await api.queryDictionaryList(params);
            console.log('getCheckBoxData', res);

            runInAction(() => {
                this.newCheckAllList = []
                let arr = []
                res.forEach(i => {
                    if (i.childrenName) {
                        arr.push({
                            label: i.childrenName,
                            icon: i.details,
                            value: i.childrenCode+'',
                        })
                    }

                });

                this.newCheckAllList = arr.concat(CheckedData)

            })
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound setUserInfo (info) {
        runInAction(() => {
            this.userInfo = info;
        });
    }

    @action.bound reset () {
        Object.assign(this, OBSERVABLE);
    }

    @action.bound update (data) {
        Object.assign(this, data);
    }
}

export default new User();
