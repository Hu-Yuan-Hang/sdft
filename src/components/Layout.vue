<template>
  <div>
    <app-header>
        
    </app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>


<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
export default {
  components: {
    AppHeader,
    AppNavbar,
    AppMain
  }
};
</script>

<style scoped>
/* 头部区域 */
.header {
  position: absolute;
  line-height: 50px;
  background-color: #2d3a4b;
  top: 0px;
  left: 0px;
  right: 0px;
}
.navbar {
  position: absolute;
  width: 180px;
  background-color: #545c64;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
}
.main {
  position: absolute;
  top: 50px;
  left: 180px;
  padding: 10px;
  overflow-y: auto;
  /* background-color: rgb(190, 180, 150); */
  right: 0;
  bottom: 0;
}
</style>