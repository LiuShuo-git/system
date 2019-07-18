<template>
  <div class="ordes">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <!-- 2.1 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search " @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- <el-input
        placeholder="请输入内容"
        class="input-with-select"
        v-model="queryInfo.query"
     @click="getOrdersList"
      >
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
      </el-input>-->

      <!-- 订单表格 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100"></el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scoped">
            <el-tag v-if="scoped.row.order_pay=='0'" type="danger" plain>未付款</el-tag>
            <el-tag v-else type="success" plain>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scoped">{{scoped.row.update_time |dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scoped" :cc="scoped">
            <!-- 修改地址 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 查看物流进度 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="getwlInfo"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>
    </el-card>
    <!-- 物流信息对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="wlDialog" width="50%">
      <el-steps direction="vertical" :active="0" :data="wlinfoList">
        <el-step  v-for="(item,index) in wlinfoList" :key="index" :title="item.time" :description='item.context'></el-step>

      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //   查询参数
        query: "",
        //  当前页码
        pagenum: 1,
        //  每页显示条数
        pagesize: 5
      },
      // 订单数据列表
      orderList: [],
      pageTotal: 0,
      // 物流订单信息列表
      wlinfoList: [],
      // 物流信息列表对话框
      wlDialog: false
    };
  },
  methods: {
    //   获取订单数据
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取订单数据列表失败");
      }
      this.orderList = res.data.goods;
      // console.log(this.orderList);
      this.pageTotal = res.data.total;
      // console.log(this.queryInfo.query);
    },
    //  页面显示多少条数据之后触发
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getOrdersList();
    },
    //  页码发生变化触发
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getOrdersList();
    },
    //  获取物流信息
    async getwlInfo() {
      this.wlDialog = true;
      const { data: res } = await this.$http.get("/kuaidi/619915933338");
      if(res.meta.status!=200) return this.$message.error('获取快递信息失败');
      this.wlinfoList = res.data;
      console.log('*****');
      
      console.log(  this.wlinfoList);
      
    },
    //  搜索
    handleSearch: function() {
      let result = this.orderList.filter(item =>
        item.order_number.includes(this.queryInfo.query)
      );

      return result;
    }
  },
  created() {
    this.getOrdersList();
  }
};
</script>
<style lang="less" scoped>
.input-with-select {
  width: 480px;
  height: 40px;
}
.el-card,
.el-table {
  margin-top: 20px;
}
</style>

