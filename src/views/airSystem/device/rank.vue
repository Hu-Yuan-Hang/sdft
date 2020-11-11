<template>
  <div>
    <div id="main" style="width: 600px;height: 700px;display: inline-block;"></div>
    <div id="table" style="width: 600px;height: 700px;;display: inline-block">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="rank"
        label="排名">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份">
      </el-table-column>
      <el-table-column
        prop="consume"
        label="能耗总量 ( 单位: m^3 )">
      </el-table-column>
    </el-table>
    </div>
  </div>
  
  
</template>

<script>
import echarts from "echarts";
import rankApi from "@/api/air.js"

export default {
  name: "cakeChart",
  data() {
    return {
      rankDataList : [],
      tableData: []
    };
  },
  mounted() {
    this.fetchData()
    this.fetchTableData()
    // this.drawLine();
  },
  methods: {
    fetchData() {
      rankApi.getRank().then(response => {
        const resp = response.data.data
        this.rankDataList = resp.consumeList
        this.drawLine()
      })
    },
    drawLine() {
      let myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        title: {
          text: "月耗情况扇形统计图",
          subtext: "虚构数据",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: "right",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            // roseType: 'angle',
            data: [
              { value: this.rankDataList[0],name: "1月",  },
              { value: this.rankDataList[1],name: "2月",  },
              { value: this.rankDataList[2],name: "3月",  },
              { value: this.rankDataList[3],name: "4月",  },
              { value: this.rankDataList[4],name: "5月",  },
              { value: this.rankDataList[5],name: "6月",  },
              { value: this.rankDataList[6],name: "7月",  },
              { value: this.rankDataList[7],name: "8月",  },
              { value: this.rankDataList[8],name: "9月",  },
              { value: this.rankDataList[9],name: "10月",  },
              { value: this.rankDataList[10],name: "11月",  },
              { value: this.rankDataList[11],name: "12月",  }
            ],
            // 高亮的样式：emphasis
            // 在鼠标悬浮到图形元素上时，一般会出现高亮的样式。默认情况下，高亮的样式是根据普通样式自动生成的
            // 如果要自定义高亮样式可以通过 emphasis 属性来定制
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    fetchTableData() {
      rankApi.getRankTable().then(response => {
        const resp = response.data.data
        this.tableData = resp.table
      })
    }
  }
};
</script>

