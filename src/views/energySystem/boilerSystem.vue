<template>
  <div>
    <div class="model"></div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.model {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<script>
import EnergyApi from '@/api/energy'


import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ClampToEdgeWrapping, log } from 'three';
const ThreeBSP = require("three-js-csg")(THREE);
export default {
  name: "",
  data() {
    return {
    ////从easymock获取数据
      boilerList: [0, 0, 0],

      scene: null,
      container: null,
      camera: null,
      renderer: null,
      SCREEN_WIDTH: null,
      SCREEN_HEIGHT: null,
      canvas: null,
      materialSprite: null,
      imgFloor: require('./images/3.jpg'),
    };
  },
  methods: {
    fetchTempData(num) {
      EnergyApi.getBoilderData(num).then((response) => {
        let resp = response.data;
        this.boilerList = resp.data;
        let SpriteTexture = this.getTexture(this.boilerList);
        this.materialSprite.map.needsUpdate = true;
      })  
    },
    //1.场景
    initScene() {
      this.scene = new THREE.Scene();
    },
    //2.相机
    initCamera() {
      this.container = document.querySelector(".model");
      this.SCREEN_WIDTH = this.container.offsetWidth;
      this.SCREEN_HEIGHT = this.container.offsetHeight;
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
        0.1,
        10000
      );
      this.camera.position.set(-300, 500, 1000);
      this.camera.lookAt(0, 0, 0);
      this.scene.add(this.camera);
      //坐标轴
      let axis = new THREE.AxesHelper(500);
      this.scene.add(axis);
    },
    initRender() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      //设置渲染器的大小为窗口的内宽度，也就是内容区的宽度。
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.container.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0x4682b4, 1.0);
    },
    //5.鼠标控制
    initControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    //6.光源
    initLight() {
      // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不同
      // A start, 第二个参数是光源强度
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1); //模拟远处类似太阳的光源
      directionalLight.position.set(0, 100, 0).normalize();
      this.scene.add(directionalLight);
      //A end
      let ambient = new THREE.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0);
      this.scene.add(ambient);
      //var pointlight = new THREE.PointLight(0x000000,1.5,2000);
      //scene.add(pointlight);
    },
    //创造圆柱体
    createColumn(radiusUp, radiusDown, height, angle, material, x, y, z) {
      //                  上半径,下半径,高度,
      const cylinder = new THREE.CylinderGeometry(
        radiusUp,
        radiusDown,
        height,
        40,
        10
      );
      const column = new THREE.Mesh(cylinder, material);

      column.position.x = x;
      column.position.y = y;
      column.position.z = z;
      column.rotation.z += angle * Math.PI; //-逆时针旋转,+顺时针
      this.scene.add(column);
    },
    //返回圆柱体
    returnColumn(radiusUp, radiusDown, height, angle, material, x, y, z) {
      //                  上半径,下半径,高度,
      const cylinder = new THREE.CylinderGeometry(
        radiusUp,
        radiusDown,
        height,
        40,
        10
      );
      const column = new THREE.Mesh(cylinder, material);

      column.position.x = x;
      column.position.y = y;
      column.position.z = z;
      column.rotation.z += angle * Math.PI; //-逆时针旋转,+顺时针
      return column;
    },
    //创造立方体
    createCube(width, height, depth, angle, material, x, y, z) {
      const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
      this.scene.add(cube);
    },
    //返回立方体
    returnCube(width, height, depth, angle, material, x, y, z) {
      const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI;
      return cube;
    },
    //立方体上挖圆孔
    createResultBsp(bsp, less_bsp) {
      let mater = new THREE.MeshPhongMaterial({
        color: 0x333333,
        // specular : 0x9cb2d1,
        // shininess : 30,
        // transparent : true,
        // opacity : 1
      });

      let sphere1BSP = new ThreeBSP(bsp);
      let cube2BSP = new ThreeBSP(less_bsp); //0x9cb2d1 淡紫,0xC3C3C3 白灰 , 0xafc0ca灰
      let resultBSP = sphere1BSP.subtract(cube2BSP);
      let result = resultBSP.toMesh(mater);
      result.material.flatshading = THREE.FlatShading;
      result.geometry.computeFaceNormals(); //重新计算几何体侧面法向量
      result.geometry.computeVertexNormals();
      result.material.needsUpdate = true; //更新纹理
      result.geometry.buffersNeedUpdate = true;
      result.geometry.uvsNeedUpdate = true;
      this.scene.add(result);
    },
    //创建地板
    createFloor() {
      var that = this;
      let loader = new THREE.TextureLoader();
      loader.load(this.imgFloor, function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
        let floorGeometry = new THREE.BoxGeometry(1600, 1100, 1);
        let floorMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        that.scene.add(floor);
      });
    },
    boilerModel() {
      this.createFloor();
      //大圆桶
      const bucketMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      this.createColumn(200, 200, 600, 0.5, bucketMaterial, 0, 272, 0);
      //桶盖
      const coverMaterial = new THREE.MeshPhongMaterial({ color: 0xff6666 });
      this.createColumn(40, 40, 40, 0.5, coverMaterial, -320, 200, 0);
      //支架
      const materialHolder = new THREE.MeshPhongMaterial({ color: 0x333333 });
      this.createCube(40, 30, 700, 0.5, materialHolder, 0, 10, 200);
      this.createCube(40, 30, 700, 0.5, materialHolder, 0, 10, -200);
      //地板
      // const materialFloor = new THREE.MeshPhongMaterial({ color: 0x666666 });
      // createCube(1000, height, depth, angle, material, x, y, z);
      let wall1 = this.returnCube(
        400,
        150,
        60,
        0.5,
        materialHolder,
        -250,
        70,
        0
      );
      let circle1 = this.returnColumn(
        200,
        200,
        60,
        0.5,
        materialHolder,
        -250,
        270,
        0
      );
      this.createResultBsp(wall1, circle1);
      let wall2 = this.returnCube(400, 150, 60, 0.5, materialHolder, 0, 70, 0);
      let circle2 = this.returnColumn(
        200,
        200,
        60,
        0.5,
        materialHolder,
        0,
        270,
        0
      );
      this.createResultBsp(wall2, circle2);
      let wall3 = this.returnCube(
        400,
        150,
        60,
        0.5,
        materialHolder,
        250,
        70,
        0
      );
      let circle3 = this.returnColumn(
        200,
        200,
        60,
        0.5,
        materialHolder,
        250,
        270,
        0
      );
      this.createResultBsp(wall3, circle3);
    },
    createCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 1000;
      this.canvas.height = 1000;
    },
    getTexture(boilerList) {
      //先用画布将文字画出
      let ctx = this.canvas.getContext("2d");
      ctx.clearRect(20, 20, 1000, 1000)
      ctx.fillStyle = "#999999";
      ctx.fillRect(20, 20, 1000, 1000); //绘制矩形,填充的默认颜色为黑色
      ctx.font = " bold 150px 宋体";
      ctx.fillStyle = "#CC0033";
      ctx.fillText("锅炉参数", 200, 180);
      ctx.font = " 130px 宋体";
      ctx.fillText("温度: " + boilerList[0] + " ℃", 100, 350);
      ctx.fillText("压强: " + boilerList[1] + " MPa", 100, 550);
      ctx.fillText("水量: " + boilerList[2] + " 吨", 100, 750);
      let texture = new THREE.CanvasTexture(this.canvas);
      //texture.needsUpdate = true;
      return texture;
    },
    createMaterialSprite(texture) {
      //使用Sprite显示文字
      // this.scene.remove(textObj);
      this.materialSprite = new THREE.SpriteMaterial({ map: texture });
      let textObj = new THREE.Sprite(this.materialSprite);
      textObj.scale.set(200, 200, 200);
      textObj.position.set(0, 600, 100);
      this.scene.add(textObj);
    },
      
    // updata() {
    //   let boilerList = this.fetchTempData();
    //   let SpriteTexture = this.getTexture(boilerList);
    //   this.materialSprite.map.needsUpdate = true;
    // },
    init() {
      this.initScene();
      this.initCamera();
      this.initRender();
      this.initControls();
      this.initLight();
      this.boilerModel();
      this.createCanvas();
      let texture = this.getTexture(this.boilerList);
      this.createMaterialSprite(texture);
    },
    //渲染函数
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
    setTimeout(this.fetchTempData, 100);
    setInterval(this.fetchTempData, 2000);
    // console.log(this.boilerList);
    // setInterval(this.updata, 1000);
  },
};
</script>