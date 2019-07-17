<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search " @click="getgoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加 -->
        <el-col :span="12">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <!-- 订单表格 -->
      <el-table :data="goodsList" stripe  border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="120"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90"></el-table-column>

        <el-table-column label="创建时间" width="180">
          <template slot-scope="scoped">{{scoped.row.add_time |dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scoped" :cc="scoped">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scoped.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagnum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagsize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },

      // 商品列表
      goodsList: [],
      // 商品总条数
      pageTotal: 0
    };
  },
  methods: {
    async getgoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      // 页面数据传递给数组
      this.goodsList = res.data.goods;
      // 页面数据总条数传递给数组
      this.pageTotal = res.data.total;
      // console.log(this.pageTotal);
    },
    //  页面显示多少条数据之后触发
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getgoodsList();
    },
    //  页码发生变化时触发
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num;
      this.getgoodsList();
    },
    //  删除
    async removeGoods(id) {
      const removeResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      // console.log(removeResult);
      if (removeResult == "cancel") {
        return this.$message.error("已取消删除");
      }

      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除成功");
      this.getgoodsList();
      //   console.log(res);
    },
    // 添加商品 跳转页面
    goAddPage() {
      this.$router.push("/goodsAdd");
    }
  },
  created() {
    this.getgoodsList();
  }
};
</script>

<style lang="less" scoped>
.el-card,
.el-table {
  margin-top: 20px;
}
</style>

