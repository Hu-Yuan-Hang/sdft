import Vue from "vue"
import Router from "vue-router"
import Login from "./views/login/index.vue"
import Layout from "@/components/Layout" //.vue后缀可以省去
import Home from "./views/home"
import Monitor from "./views/monitor"
import Video from "./views/monitor/video.vue"
import Replay from "./views/monitor/replay.vue"
import Energy from "./views/energySystem"
import BoilerSystem from "./views/energySystem/boilerSystem.vue"
import Colder from "./views/energySystem/colderSystem.vue"
import Office from "./views/energySystem/airCondition/office.vue"
import Oxygen from "./views/energySystem/airCondition/oxygenRoom.vue"
import BoilerRoom from "./views/energySystem/airCondition/boilerRoom.vue"
import Air from "./views/airSystem"
import Rank from "./views/airSystem/device/rank.vue"
import Jiechao from "./views/airSystem/device/jiechao.vue"
import Cost from "./views/airSystem/device/cost.vue"
import Consume from "./views/airSystem/device/consume.vue"
import Fire from "./views/fireProtection"
import Power from "./views/power"

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login', //路由名
            component: Login //组件对象
        },
        {
            path: '/',
            name: 'layout', //路由名
            component: Layout, //组件对象
            redirect: '/home',
            children: [
                {
                    path: '/home',
                    component: Home,
                    meta: {title: '首页'}
                },
            ]
        },
        {
            path: '/monitor',
            component: Layout,
            children: [
                {
                    path: '/',
                    component: Monitor,
                    meta: {title: '全景监控'}
                },
                {
                    path: '/monitor/video/',
                    component: Video,
                    meta: {title: '全景监控/视频监控'}
                },
                {
                    path: '/monitor/replay/',
                    component: Replay,
                    meta: {title: '全景监控/监控回放'}
                }
            ]
        },
        {
            path: '/energy',
            component: Layout,
            children: [
                {
                    path: '/',
                    component: Energy,
                    meta: {title: '能源系统'}
                },
                {
                    path: '/energy/boiler/',
                    component: BoilerSystem,
                    meta: {title: '能源系统/锅炉系统'}
                },
                {
                    path: '/energy/air/office/',
                    component: Office,
                    meta: {title: '能源系统/空调/一楼办公室'}
                },
                {
                    path: '/energy/air/oxygen/',
                    component: Oxygen,
                    meta: {title: '能源系统/空调/氧气房'}
                },
                {
                    path: '/energy/air/boiler/',
                    component: BoilerRoom,
                    meta: {title: '能源系统/空调/锅炉房'}
                },
                {
                    path: '/energy/colder/',
                    component: Colder,
                    meta: {title: '能源系统/制冷系统'}
                }
            ]
        },
        {
            path: '/air',
            component: Layout,
            children: [
                {
                    path: '/air/device/consume',
                    component: Consume,
                    meta: {title: '能耗情况'}
                },
                {
                    path: '/air/device/rank',
                    component: Rank,
                    meta: {title: '能耗排名'}
                },
                {
                    path: '/air/device/jiechao',
                    component: Jiechao,
                    meta: {title: '能耗节超'}
                },
                {
                    path: '/air/device/cost',
                    component: Cost,
                    meta: {title: '成本'}
                }
            ]
        },
        {
            path: '/fire',
            component: Layout,
            children: [
                {
                    path: '/',
                    component: Fire,
                    meta: {title: '消防系统'}
                }
            ]
        },
        {
            path: '/power',
            component: Layout,
            children: [
                {
                    path: '/',
                    component: Power,
                    meta: {title: '操作权限'}
                }
            ]
        }
    ]
})