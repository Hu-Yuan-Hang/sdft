/*
权限校验：
通过Vue Router中的 前置钩子函数 beforeEach(to, from, next)
在进行路由跳转之前，进行判断，是否已经登录过，登陆过则允许访问非登录页面，否则 回到登录页

to: 即将要进入的目标路由
from: 即将要离开的路由对象
next: 是一个方法，可以指定路由地址，进行路由跳转
*/

import router from './router'
import {getUserInfo} from './api/login'

router.beforeEach((to, from, next) => {
    // 1.获取token
    const token = localStorage.getItem('mxg-mms-token')
    // 1.1若没获取到，要访问非登录页面，则不让访问，加载到登陆页面 /login
    if(!token) {
        if(to.path !== '/login') {
            next({path: '/login'})
        }else {
            next()
        }
    }else {// 1.2获取到token
        if(to.path === '/login') {// 1.2.1 请求路由/login，那就去目标路由
            next()
        }else {
            // 1.2.2 请求路由为非登录页面，先在本地查看是否有用户信息
            const userInfo = localStorage.getItem('mxg-mms-user')
            if(userInfo) {
                //本地获取到了，则直接让它去目标路由
                next()
            }else {
                // 如果本地没有用户信息，则通过token获取用户信息
                getUserInfo(token).then(response => {
                    const resp = response.data
                    if(resp.flag) {//如果获取到用户信息，则将信息保存至本地，且进行非登陆页面，否则回到登陆页面
                        localStorage.setItem('mxg-mms-user', Json.stringify(resp.data))
                        next()
                    }else {
                        //未获取到用户信息，重新登陆
                        next({path: '/login'})
                    } 
                })
            }
        }
    }
    
})