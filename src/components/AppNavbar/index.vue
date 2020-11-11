<template>
  <div class="navbar">
    <!-- 
        default-active : 默认选中的菜单
        :router="true" true表示开启路由模式，index值即为路由地址          
       -->
    <el-menu
      :default-active="$route.path"
      :router="true"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- 全景监控 -->
      <el-submenu index="/monitor/">
        <template slot="title">
          <i class="el-icon-video-camera"></i>
          <span>全景监控</span>
        </template>

        <el-menu-item-group>
          <el-menu-item index="/monitor/video/">视频监控</el-menu-item>
          <el-menu-item index="/monitor/replay/">监控回放</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!-- 能源系统 -->
      <el-submenu index="/energy/">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>能源系统</span>
        </template>

        <el-menu-item-group>
          <el-menu-item index="/energy/boiler/">锅炉系统</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="/energy/air/">
          <template slot="title">空调</template>
          <el-menu-item index="/energy/air/office/">一楼办公室</el-menu-item>
          <el-menu-item index="/energy/air/oxygen/">氧气房</el-menu-item>
          <el-menu-item index="/energy/air/boiler/">锅炉房</el-menu-item>
        </el-submenu>
        <el-menu-item-group>
          <el-menu-item index="/energy/colder/">制冷系统</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/air/">
        <template slot="title">
          <i class="el-icon-wind-power"></i>
          <span>气体系统</span>
        </template>

        <el-submenu index="/air/device/">
          <template slot="title">供气设备</template>
          <el-menu-item index="/air/device/consume/">能耗情况</el-menu-item>
          <el-menu-item index="/air/device/rank/">能耗排名</el-menu-item>
          <el-menu-item index="/air/device/jiechao/">能耗节超</el-menu-item>
          <el-menu-item index="/air/device/cost/">成本</el-menu-item>
        </el-submenu>
      </el-submenu>

      <el-submenu index="/fire/">
        <template slot="title">
          <i class="el-icon-no-smoking"></i>
          <span>消防系统</span>
        </template>
      </el-submenu>
      <el-submenu index="/power">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>系统权限</span>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<style scoped>
</style>