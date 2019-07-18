<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card class="box-card">
      <!-- 提示标签 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <!-- 级联选择器 -->
      <span>选择商品分类:&nbsp;&nbsp;</span>
      <el-cascader
        v-model="categorySelected"
        :options="categoriesList"
        :props="categoryProps"
        @change="handleChange"
      ></el-cascader>

      <!-- tabs切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialog = true"
          >添加参数</el-button>
          <!-- tab表格 -->
          <el-table :data="manyList" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <!-- Start 实现动态编辑标签-->
                <el-tag
                  :key="index"
                  v-for="(tag,index) in scoped.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scoped.row,index)"
                >{{tag}}</el-tag>
                <!-- input 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm"
                ></el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- End 实现动态编辑标签-->
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped" :cc="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editCateg(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeCateg(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialog = true"
          >添加属性</el-button>
          <!-- tab表格 -->
          <el-table stripe :data="onlyList" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <!-- Start 实现动态编辑标签-->
                <el-tag
                  :key="index"
                  v-for="(tag,index) in scoped.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scoped.row,index)"
                >{{tag}}</el-tag>
                <!-- input 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm"
                ></el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- End 实现动态编辑标签-->
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped" :cc="scoped">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editCateg(scoped.row)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeCateg(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数or 添加属性对话框 -->
    <el-dialog
      :title="this.activeName=='many'?'添加动态参数':'添加静态属性'"
      :visible.sync="addDialog"
      width="50%"
    >
      <!-- form 表单 -->
      <el-form
        :model="addCategForm"
        :rules="addCategRules"
        ref="addCategRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="this.activeName=='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="addCategForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="putaddCateg">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="this.activeName=='many'?'修改动态参数':'修改静态属性'"
      :visible.sync="editDialog"
      width="50%"
    >
      <!-- form 表单 -->
      <el-form
        :model="editCategForm"
        :rules="editCategRules"
        ref="editCategRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="this.activeName=='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="editCategForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="puteditCateg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  商品分类列表
      categoriesList: [],
      // 分类列表配置对象
      categoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 级联列表选中项
      categorySelected: [],
      // tabs选中的值
      activeName: "many",

      // 动态参数数组
      manyList: [],
      // 静态属性数组
      onlyList: [],
      // 添加对话框
      addDialog: false,

      // 添加参数数组

      addCategForm: {
        attr_name: ""
      },
      // 添加参数校验规则
      addCategRules: {
        attr_name: [
          { required: true, message: "添加内容不能为空", trigger: "blur" }
        ]
      },
      // 修改对话框
      editDialog: false,
      // 修改参数数组
      editCategForm: {
        attr_name: ""
      },
      // 修改参数校验规则
      editCategRules: {
        attr_name: [
          { required: true, message: "添加内容不能为空", trigger: "blur" }
        ]
      },
      // input 输入框 默认隐藏
      inputVisible: false,
      // input 输入的值
      inputValue: ""
    };
  },
  methods: {
    // tag标签
    showInput() {
      this.inputVisible = true;
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // input失去焦点触发
    async handleInputConfirm(row) {
      this.inputVisible = false;
      // trim() 删除空白
      console.log(this.inputValue.trim().length);

      if (this.inputValue.trim().length == 0) {
        // console.log(this.inputValue);
        // console.log(row);
        this.inputVisible = false;
        this.inputValue = "";
        return false;
      }
      if (this.inputValue.trim().length > 0) {
        row.attr_vals.push(this.inputValue.trim());
      }
      this.inputValue = "";
      this.inputVisible = false;
      console.log(row.attr_vals.join(" "));

      //发起提交请求
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status != 200) return this.$message.error("添加标签失败");
    },
    // 删除tag标签
    async handleClose(row, index) {
      console.log(index);
      row.attr_vals.splice(index, 1);

      //发起提交请求
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status != 200) return this.$message.error("添加标签失败");
    },
    // 获取级联列表数据
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      this.categoriesList = res.data;
    },
    //当选中节点变化时触发
    handleChange() {
      // console.log(this.categorySelected);
      if (this.categorySelected.length != 3) {
        // 清空选中项数组
        this.categorySelected = [];
        // 动态参数数组
        this.manyList = [];
        // 静态属性数组
        this.onlyList = [];
      } else {
        // 获取表格数据
        this.getParamsList();
        this.getParamsList();
      }
    },
    // 获取列表参数
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      // console.log(res);
      // this.categoriesList = res.data;
      // console.log(this.activeName);
      // 遍历res.data的数据
      res.data.forEach(item => {
        // 把attr_vals 的值 使用空格 分割为数组
        let arr = item.attr_vals.split(" ");
        item.attr_vals = arr;
      });
      if (res.meta.status != 200) {
        this.$message.error("获取失败");
      }
      if (this.activeName == "many") {
        this.manyList = res.data;
        // console.log(this.manyList);
      } else {
        this.onlyList = res.data;
        // console.log(this.onlyList);
      }
    },
    // 提交添加参数
    async putaddCateg() {
      this.$refs.addCategRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.addCategForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error("创建参数失败");
        }
        this.addDialog = false;
        this.$message.success("创建参数成功");
        this.removeAddRef();
        this.getParamsList();
      });
    },

    removeAddRef() {
      this.$refs.addCategRef.resetFields();
    },
    // 回显参数列表
    async editCateg(row) {
      const { data: res } = await this.$http.get(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.editCategForm = res.data;

      this.editDialog = true;
    },
    // 提交编辑参数
    puteditCateg() {
      this.$refs.editCategRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.editCategForm.cat_id}/attributes/${this.editCategForm.attr_id}`,
          this.editCategForm
        );
        if (res.meta.status != 200) return this.$message.error("修改参数失败");
        this.$message.success("修改参数成功");
        this.editDialog = false;
        this.getParamsList();
      });
    },
    // 删除参数
    async removeCateg(id) {
      const remresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);

      if (remresult != "confirm") return this.$message.error("取消删除");
      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${id}`
      );
      if (res.meta.status != 200) return this.$message.error("删除参数失败");
      this.$message.success("删除参数成功");
      this.getParamsList();
    },

    // tabs切换 时触发
    handleClick() {
      // console.log(!this.categoryId);
      if (!this.categoryId) return;
      this.getParamsList();
    }
    // 点击but 让 input 显示
  },
  created() {
    this.getCategoriesList();
  },
  computed: {
    // 是否禁用
    isDisabled: function() {
      // 如果级联列表数组 长度为三 那么返回false
      if (this.categorySelected.length == 3) return false;
      // 否则返回true
      return true;
    },
    // 分类Id
    categoryId: function() {
      // 如果该数组的长度为三 那么获取该数组的最后一个元素 并且返回 否则 返回空
      if (this.categorySelected.length == 3) {
        // 一般能不写准确的数字就别写准确的数字 因为这算是硬编码
        // 我们应该把能抽取出公式 总结 规律的地方都抽取出来
        //
        return this.categorySelected[2];
      }

      return null;
    }
    // input 的显示与隐藏
  }
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 130px;
}
</style>

