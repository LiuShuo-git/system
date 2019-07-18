<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片 -->
    <el-card>
      <el-button type="primary" @click="addCategory()">添加分类</el-button>
      <!-- tree 属性表格 -->
      <table-tree
        :data="categoryList"
        :columns="columns"
        show-index
        border
        index-text="#"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:#20b2aa" v-if="scope.row.cat_deleted==false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level==2">三级</el-tag>
          <!-- {{scope.row.cat_level}} -->
        </template>
        <!-- 操作 -->
        <template slot="action" slot-scope="scope" :cc="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="eidtCategories(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCategories(scope.row.cat_id)"
          >删除</el-button>
          <!-- {{scope.row.cat_level}} -->
        </template>
      </table-tree>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addCategoryDialog" width="50%">
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryRules"
        ref="addCategoryRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="分类分级">
          <el-cascader
            v-model=" addCategorySelected"
            :options=" addCategoryList"
            :props=" addCategoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="putAddCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCategoryDialog" width="50%">
      <el-form
        :model="editCategoryForm"
        :rules="editCategoryRules"
        ref="editCategoryRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="putEditCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tree
      // 数据总条数
      total: 0,
      // 分类列表
      categoryList: [],
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 树形表格对应的参数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isOk",
          width: "400px"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order",
          width: "400px"
        },
        {
          label: "操作",
          type: "template",
          template: "action",
          width: "400px"
        }
      ],
      // 添加分类对话框
      addCategoryDialog: false,
      // 添加分类数据
      addCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 添加对话框校验规则
      addCategoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 添加分类列表 回显数据
      addCategoryList: [],
      // 添加分类列表 级联列表选中的 值是数组
      addCategorySelected: [],
      // 添加分类列表级联列表配置项
      addCategoryProps: {
        label: "cat_name",
        // 可以选择到
        checkStrictly: true,
        // 唯一确定身份的标识
        value: "cat_id",
        // 指定选项的子选项为选项对象的某个属性值
        children: "children"
      },
      // 编辑弹框
      editCategoryDialog: false,
      // 编辑数据绑定
      editCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 编辑校验规则
      editCategoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取商品列表
    async getCategoryList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      // console.log(res);
      this.categoryList = res.data.result;

      // console.log(this.queryInfo);
      this.total = res.data.total;
    },
    //  pageSize 改变时会触发  每页多少条
    //  handleSizeChange(size) {
    //    // console.log(size);
    //    this.queryInfo.pagesize = size;
    //    this.getCategoryList();
    //  },
    //  currentPage 改变时会触发  当前页数
    handleCurrentChange(num) {
      // console.log(num);
      this.queryInfo.pagenum = num;
      // console.log(this.queryInfo.pagenum);
      this.getCategoryList();
    },
    //  获取级联列表数据
    async addCategory() {
      this.addCategoryDialog = true;
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.addCategoryList = res.data;
    },
    //  提交添加列表
    async putAddCategory() {
      this.$refs.addCategoryRef.validate(async valid => {
        if (!valid) return false;
        //  console.log(this.addCategoryForm);
        const { data: res } = await this.$http.post(
          "categories",
          this.addCategoryForm
        );
        if (res.meta.status != 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this.addCategoryDialog = false;
        this.remAddCategory();
        this.addCategorySelected = "";
        this.getCategoryList();
      });
    },
    //  清空from表单
    remAddCategory() {
      this.$refs.addCategoryRef.resetFields();
    },

    handleChange() {
      //  如果级联列表没选， 则代表添加的是一级标签
      if (this.addCategorySelected.length == 0) {
        this.addCategoryForm.cat_pid == 0;
        this.addCategoryForm.cat_level == 0;
      } else {
        // 如选择一个 数组父ID 就是数组的最后一个  添加的就是二级分类 1代表二级分类
        // 如选择两个  数组父id 仍是数组最后一个   那么 添加的就是 2 代表三级分类
        this.addCategoryForm.cat_pid = this.addCategorySelected[
          this.addCategorySelected.length - 1
        ];
        this.addCategoryForm.cat_level = this.addCategorySelected.length;
      }
      // console.log(this.addCategoryForm);
    },
    //  回显编辑数据
    async eidtCategories(id) {
      this.editCategoryDialog = true;
      // 发起请求获取 回显数据
      const { data: res } = await this.$http.get(`categories/${id}`);
      if (res.meta.status != 200) return this.$message.error("获取数据失败");
      this.editCategoryForm = res.data;
    },
    //  提交编辑信息
    async putEditCategory() {
      const { data: res } = await this.$http.put(
        `categories/${this.editCategoryForm.cat_id}`,
        this.editCategoryForm
      );
      if (res.meta.status != 200) return this.$message.error("编辑分类失败");
      this.$message.success("编辑分类成功");
      this.editCategoryDialog = false;
      this.getCategoryList();
    },
    //  删除分类
    async removeCategories(id) {
      const remResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      // console.log(remResult);
      if (remResult == "cancel") return this.$message.error("取消删除");
      await this.$http.delete(`categories/${id}`);
      this.$message.success("删除分类成功");
      this.getCategoryList();
    }
  },
  created() {
    this.getCategoryList();
  }
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>

