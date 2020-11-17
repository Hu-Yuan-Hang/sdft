<template>
  <div id="app">
    <div class="header">
      <h1>欢迎使用山东富通工厂管理系统</h1>
    </div>
    <div id="three3D"></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  text-align: center;
  background-color: #4682b4;
  border: none;
}
#three3D {
  position: absolute;
  margin: 0;
  top: 100px;
  left: 0px;
  right: 0;
  bottom: 0;
  border: none;
  overflow: hidden;
}
</style>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { log } from 'three';
const ThreeBSP = require('three-js-csg')(THREE)

export default {
  name: "app",
  data() {
    return {
      scene: null,
      container: null,
      camera: null,
      renderer: null,
      SCREEN_WIDTH: null,
      SCREEN_HEIGHT: null,
      matArrayA: [],
      matArrayB: [],
      door_state: true,
    };
  },
  methods: {
    //1.场景
    initScene() {
      this.scene = new THREE.Scene();
    },
    //2.相机
    initCamera() {
      this.container = document.getElementById("three3D");
      this.SCREEN_WIDTH = this.container.clientWidth;
      this.SCREEN_HEIGHT = this.container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(75,this.SCREEN_WIDTH / this.SCREEN_HEIGHT,0.1,10000);
      this.camera.position.set(0, 800, 800);
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
      var directionalLight = new THREE.DirectionalLight(0xffffff, 1);//模拟远处类似太阳的光源
      directionalLight.position.set(0, 100, 0).normalize();
      this.scene.add(directionalLight);
      //A end
      var ambient = new THREE.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0);
      this.scene.add(ambient);
      //var pointlight = new THREE.PointLight(0x000000,1.5,2000);
      //scene.add(pointlight); 
    },
    ////////////////////////////////////////////////////////
    //创建地板
    createFloor() {
      let loader = new THREE.TextureLoader();
      loader.load('./images/floor.jpg', function(texture) {
        console.log('找到我了!');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        let floorGeometry = new THREE.BoxGeometry(1600, 1100, 1);
        let floorMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        console.log('找到我了!');
        this.scene.add(floor);
      });
      //茶色：0x58ACFA   透明玻璃色：0XECF1F3
      let glass_material = new THREE.MeshBasicMaterial({
        color: 0xecf1f3,
      });
      glass_material.opacity = 0.4;
      glass_material.transparent = true;

      let left_wall = this.returnWallObject(20,200,1100,0,this.matArrayB,-801,100,0);
      let left_cube = this.returnWallObject(20,110,1100,0,this.matArrayB,-801,100,0);
      this.createResultBsp(left_wall, left_cube, 1);
      this.createCubeWall(1, 110, 1100, 0, glass_material, -801, 100, 0);

      let right_wall = this.returnWallObject(20,200,1100,1,this.matArrayB,801,100,0);
      let right_cube = this.returnWallObject(20,110,1100,0,this.matArrayB,801,100,0);
      this.createResultBsp(right_wall, right_cube, 1);
      this.createCubeWall(1, 110, 1100, 0, glass_material, 801, 100, 0);
    },
    createWallMaterail() {
      
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //前  0xafc0ca :灰色
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //后
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec })); //上  0xd6e4ec： 偏白色
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec })); //下
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //左    0xafc0ca :灰色
      this.matArrayA.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca }));

      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //前  0xafc0ca :灰色
      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0x9cb2d1 })); //后  0x9cb2d1：淡紫
      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec })); //上  0xd6e4ec： 偏白色
      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xd6e4ec })); //下
      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //左   0xafc0ca :灰色
      this.matArrayB.push(new THREE.MeshPhongMaterial({ color: 0xafc0ca })); //右
    },
    createScreenMaterail(texture) {
      let matArrayC = []; //屏幕
      matArrayC.push(new THREE.MeshPhongMaterial({ map: texture })); //前  0xafc0ca :灰色
      matArrayC.push(new THREE.MeshPhongMaterial({ color: 0x333333 })); //后  0x9cb2d1：淡紫
      matArrayC.push(new THREE.MeshPhongMaterial({ color: 0x333333 })); //上  0xd6e4ec： 偏白色
      matArrayC.push(new THREE.MeshPhongMaterial({ color: 0x333333 })); //下
      matArrayC.push(new THREE.MeshPhongMaterial({ color: 0x333333 })); //左   0xafc0ca :灰色
      matArrayC.push(new THREE.MeshPhongMaterial({ color: 0x333333 })); //右
      return matArrayC;
    },

    //创建墙
    createCubeWall(width, height, depth, angle, material, x, y, z) {
      var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      var cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
      this.scene.add(cube);
    },
    //返回墙对象
    returnWallObject(width, height, depth, angle, material, x, y, z) {
      let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      let cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI;
      return cube;
    },
    //墙上挖门，通过两个几何体生成BSP对象
    createResultBsp(bsp, less_bsp, mat) {
      let mater = new THREE.MeshPhongMaterial({
        color: 0x9cb2d1,
        specular: 0x9cb2d1,
        shininess: 30,
        transparent: true,
        opacity: 1,
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

    createLayout() {
      // 墙面1 立方体比较长的面  左一
      this.createCubeWall(10, 200, 900, 0, this.matArrayB, -651, 100, 0);
      // 墙面2  立方体比较长的面   右一
      this.createCubeWall(10, 200, 900, 1, this.matArrayB, 651, 100, 0);
      // 墙面3 门对面的墙 立方体比较短的面
      this.createCubeWall(10, 400, 1310, 1.5, this.matArrayB, 0, 200, -451);
      // 墙面4   带门的面
      let wall = this.returnWallObject(1310, 200, 10, 0, this.matArrayB, 0, 100, 455);
      // 门框
      let door_cube = this.returnWallObject(100, 180, 10, 0, this.matArrayB, 0, 90, 455);
      this.createResultBsp(wall, door_cube, 1);
      //为墙面安装门,右门
      // let loader = new THREE.TextureLoader();
      // loader.load("./images/door_right.png", function (texture) {
      //   let doorgeometry = new THREE.BoxGeometry(100, 180, 1);
      //   let doormaterial = new THREE.MeshBasicMaterial({
      //     map: texture,
      //     // color : 0xdcfeee
      //   });
      //   doormaterial.opacity = 1;
      //   doormaterial.transparent = true;
      //   door = new THREE.Mesh(doorgeometry, doormaterial);
      //   door.position.set(-50, 0, 0);
      //   // var door1 = door.clone();
      //   // door1.position.set(50, 0, 0);
      //   // door1.visible = false;
      //   let dummy = new THREE.Object3D();//仿制品
      //   dummy.add(door);
      //   // dummy.add(door1);
      //   dummy.position.set(50, 90, 451);
      //   this.scene.add(dummy);
      // });
      // 房间A:隔墙1
      this.createCubeWall(10, 200, 300, 0, this.matArrayA, -201, 100, 300);
      //房间A:隔墙2  无门
      this.createCubeWall(10, 200, 300, 0.5, this.matArrayA, -351, 100, 145);
      // 厨房：隔墙4 无门
      this.createCubeWall(10, 200, 300, 0, this.matArrayA, 201, 100, 300);
      // 厨房：隔墙3
      this.createCubeWall(300, 200, 10, 0, this.matArrayA, 351, 100, 145);
      /////////////////////中间的墙/////////////////
      this.createCubeWall(350, 200, 10, 0, this.matArrayA, -471, 100, -10);
      this.createCubeWall(350, 200, 10, 0, this.matArrayA, 470, 100, -10);
    },
    //生成纹理图片
    getTexture(time) {
      let canvas = document.createElement("canvas");
      canvas.width = 4000;
      canvas.height = 2000;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(20, 20, 3960, 1960);
      ctx.beginPath();
      // ctx.translate(256, 64);
      ctx.fillStyle = "#FF3300";
      ctx.font = "300px 宋体"; //字体样式设置
      ctx.textBaseline = "middle"; //文本与fillText定义的纵坐标
      ctx.textAlign = "center"; //文本居中(以fillText定义的横坐标
      ctx.fillText(time, 2000, 200);
      let texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    },
    //得到时间
    gettime() {
      let checkTime = function (i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      };
      let today = new Date();
      let y = today.getFullYear();
      let m = today.getMonth() + 1;
      let d = today.getDate();
      let h = today.getHours();
      let i = today.getMinutes();
      let s = today.getSeconds(); // 在小于10的数字钱前加一个‘0’
      d = checkTime(d);
      m = checkTime(m);
      i = checkTime(i);
      s = checkTime(s);
      return y + "年" + m + "月" + d + "日" + " " + h + ":" + i + ":" + s;
    },
    updata() {
      let time = this.gettime();
      let texture = this.getTexture(time);
      let matArrayC = this.createScreenMaterail(texture);
      this.createCubeWall(10, 300, 600, 1.5, matArrayC, 0, 220, -440);
    },
    //7.初始化OBJ对象
    initObject() {
      //墙纹理
      this.createWallMaterail();
      this.createFloor();
      this.createLayout();
    },
    onkeyDown(event) {
			switch (event.keyCode) {
			case 13:
				console.log(event.keyCode);
				if (this.door_state) {
					dummy.rotation.y += 0.5 * Math.PI;
					this.door_state = false;
				} else {
					dummy.rotation.y -= 0.5 * Math.PI;
					this.door_state = true;
				}
				break;
			default:
				console.log(event.keyCode);
				break;
			}
		},
    //初始化函数
    init() {
      this.initScene();
      this.initCamera();
      this.initRender();
      // initEvent();
      this.initControls();
      this.initLight();
      this.initObject();
      //监听键盘按键
      document.addEventListener("keydown", this.onkeyDown, false);
      setInterval(this.updata, 1000);
    },
    animate() {
			requestAnimationFrame(this.animate);
			this.renderer.render(this.scene, this.camera);
			//TWEEN.update();
			// update();
		}
  },
  mounted() {
    this.init();
    
    this.animate();
  },
};
</script>
