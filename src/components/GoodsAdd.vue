<template>
  <div class="goodsAdd">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!--标题栏  -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs标签页 -->
      <el-form
        :model="addGoodsList"
        :rules="addGoodsRules"
        ref="addGoodsRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="handleBeforeLeave"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- from表单 -->

            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addGoodsList.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsList.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsList.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsList.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsList.goods_cat"
                :options="categoriesList"
                :props="categoryProps"
                @change="handCategory"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in this.manyList" :key="item.arr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(subitem,subindex) in item.attr_vals"
                  :key="subindex"
                  border
                  :label="subitem"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in this.onlyList" :key="item.arr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="uploadToken"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsList.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" style="margin-top: 15px;" @click="handleGoodsAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialog" width="50%">
      <img :src="imgUrl" alt style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tabs的名字
      activeName: "0",
      // 添加商品的表单
      addGoodsList: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        //上传图片的路径
        pics: [],
        //   介绍
        goods_weight: "",
        // 商品的参数
        attrs: []
      },
      // 分类列表
      categoriesList: [],
      // 分类列表配置对象
      categoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 商品参数
      manyList: [],
      // 商品属性
      onlyList: [],
      //设置上传的请求头部
      uploadToken: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 上传图片路径
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片对话框
      imgDialog: false,
      // 图片路径
      imgUrl: "",
      // 添加商品的校验规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      this.categoriesList = res.data;
    },
    //  当选中节点变化时触发
    handCategory() {
      //  console.log(this.addGoodsList.goos_cat);
      if (this.addGoodsList.goods_cat.length !== 3) {
        return (this.addGoodsList.goods_cat = []);
      }
    },
    async handleClick() {
      // console.log("--------");
      //  console.log(this.activeName);
      if (this.activeName == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数数据失败");
        }

        // 用空格把数据分开
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.trim().split(" ");
        });
        this.manyList = res.data;
      } else if (this.activeName == 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性数据失败");
        }

        this.onlyList = res.data;
        console.log(this.onlyList);
      }
    },
    handleBeforeLeave(next, prev) {
      // console.log(next, prev);
      // console.log("*****");

      // console.log(this.activeName);

      // 如果prev是0 且没有分类id 那么就不让跳转 直接return false
      if (this.activeName == 0 && this.categoryId == null) {
        this.$message.error("请选中三级分类");
        return false;
      }
      // 如果是0也有分类id 就啥都不干 放行
    },

    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.addGoodsList.pics.push({
        pic: response.data.tmp_path
      });
      // console.log(this.addGoodsList.pics);
    },
    //  文件列表移除文件时的钩子
    handleRemove(file) {
      console.log(file);
      let path = file.response.data.tmp_path;
      let i = this.addGoodsList.pics.findIndex(item => item.pic == path);
      this.addGoodsList.pics.splice(i, 1);
      console.log(this.addGoodsList.pics);
    },
    //  点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
      this.imgUrl = file.response.data.url;

      this.imgDialog = true;
    },

    //提交添加数据
    async handleGoodsAdd() {
      // await console.log(this.addGoodsList);
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return this.$message.error("请把数据填写完整");
        // 拷贝addGoodsList表单数据
        const form = _.cloneDeep(this.addGoodsList);
        console.log(form);
        // 把 商品分类数组 变为字符串
        form.goods_cat = form.goods_cat.join(",");
      //   把manyList 中数据添加到attr中
        this.manyList.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          });
        });
 //   把onlyList中数据添加到attr中
        this.onlyList.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          });
        });
      //   console.log(form);
      const {data:res} = await this.$http.post('goods',form)
      .catch(error=>error)
          // 
      // console.log(res);
        if (res.meta.status == 400) {
          return this.$message.error(res.meta.msg);
        }

        this.$message.success("商品创建成功");
        this.$router.push("/goods");

      });
    
      
    }
  },
  created() {
    this.getCategoriesList();
  },
  computed: {
    categoryId: function() {
      if (this.addGoodsList.goods_cat.length === 3) {
        return this.addGoodsList.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps,
.el-tabs {
  margin-top: 15px;
}
</style>

