import axios from 'axios'

let api = api || {};

// api.baseUrl = 'http://192.168.1.2:8080';
api.baseUrl = 'http://47.105.150.4:8081'
// api.baseUrl = '/api';

// let _token = localStorage.getItem('_token');
const http = axios.create({
    headers: {
        'Content-Type': 'application/json',
        // 'token':_token
    },
    timeout: 3000
});

axios.defaults.baseURL = api.baseUrl;

http.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('_token');
        if (config.method === 'post') {
            config.data = JSON.stringify(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    res => {
        if (res.status === 200) {
            return res.data;
        } else {
            return {
                flag: 2,
                message: "请求数据失败"
            }
        }
    },
    error => {
        return Promise.reject(error);
    }
);


api.http = http;

api.validata = function (data, vueobj) {
    if (data.flag === 1) {
        return true;
    } else if (data.flag === 2) {
        vueobj.$Message.error(data.message);
        return false;
    } else if (data.flag === 3 || data.flag === 4) {
        vueobj.$Message.warning('请重新登录！');
        setTimeout(function () {
            vueobj.$router.push('login');
        }, 1500);
        return false;
    } else {
        return false;
    }
};

//接口请求
api.login = '/user/login';
//添加菜单
api.menus_add = '/menu/add';
//不分页查询菜单
api.menus_list = '/menu/list';
//不分页查询所有角色
api.role_list = '/role/list';
//分页查询所有角色
api.role_queryPages = '/role/queryPages'
//添加角色
api.role_add = '/role/add'
//根据id查询单条角色信息
api.menu_getByRoleId = '/menu/getByRoleId'
//删除角色
api.role_delete = '/role/delete'
//分页查询用户信息
api.user_queryPages = '/user/queryPages';
//分页查询轮播图
api.banner_page = '/banner/page';

export {api};
