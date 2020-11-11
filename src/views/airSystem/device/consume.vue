<template>
<div>
  <!--为echarts准备一个具备大小的容器dom-->
  <div id="main" style="width: 1000px;height: 600px;"></div>
  <div><button @click="changeVision" style="width: 200px; height: 100px; font-size: 30px">点击切换视图</button></div>
  
</div>
  
  
</template>
<script>
import echarts from "echarts";
import consumeApi from '@/api/air.js'


export default {
  name: "",
  data() {
    return {
      consumeList: [],
      costList: [],
      type: 'line'
    };
  },
  methods: {
    changeVision() {
      switch(this.type) {
        case 'line':
          this.type = 'bar'
          this.drawLine("main")
          break;
        case 'bar':
          this.type = 'line'
          this.drawLine("main")
          break;
      }

    },
    fetchData() {
      consumeApi.getConsume().then(response => {
        const resp = response.data.data
        this.consumeList = resp.consumeList
        this.costList = resp.costList
        this.drawLine("main")
      })
    },
    drawLine(id) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption({
        // 为图表配置标题
        title: {
          text: "能耗情况折线图"
        },
        // 配置提示信息
        tooltip: {
          trigger: "axis"
        },
        // 图例组件
        // 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
        legend: {
          data: ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // 配置要在 X 轴显示的项
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h"]
        },
        // 配置要在 y 轴显示的项
        yAxis: {
        },
        // 每个系列通过 type 决定自己的图表类型
        series: [
          {
            name: "能耗情况",
            type: this.type,
            data: this.consumeList,
            // color: ['#00f']
          },
          {
            name: "成本",
            type: this.type,
            data: this.costList,
            // color: ['#0f0']
          }
        ]
      });
    }
  },
  created() {
    // this.fetchData()
    // console.log(this.searchList)
  },
  //调用
  mounted() {
    this.fetchData()
    
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
