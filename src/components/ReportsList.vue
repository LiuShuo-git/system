<template>
  <div class="ReportsList">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width:750px;height:400px;" ref="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
//导入折线图
 import "echarts/lib/chart/line"
 // 引入提示框和标题组件
import "echarts/lib/component/legendScroll"
import "echarts/lib/component/title"

export default {
  data() {
    return {};
  },

  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    // 初始化echarts
    let myChart = echarts.init(this.$refs.main);

    const { data: res } = await this.$http.get("reports/type/1");
    console.log(res);
    if (res.meta.status != 200) return this.$message.error("获取报表失败");
    // 需要合并的选项
    const options = {
      title: {
        text: "用户来源"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#E9EEF3"
          }
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ]
    };
   //  合并项
   const result = _.merge(res.data,options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption( result);
  },
  methods: {},

  created() {
    //  this.mounted();
  }
};
</script>

<style>
</style>
