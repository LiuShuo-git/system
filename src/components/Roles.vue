<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addRolesDialog=true">添加角色</el-button>
      <!-- 表格 -->
      <el-table width="99.9%" border :data="RolesList">
        <el-table-column type="expand">
          <template slot-scope="scoped">
            <el-row
              v-for="(item,index) in scoped.row.children"
              :key="item.id"
              :style="{
                'border-bottom': '1px solid #eee',
                'border-top': index === 0 ? '1px solid #eee' : ''
              }"
            >
              <!-- 一级权限列表 -->
              <el-col :span="5">
                <el-tag closable @close="removeRights(scoped.row, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级权限列表 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item.children"
                  :key="item2.id"
                  :style="{
                    'border-top': index2 === 0 ? '' : '1px solid #eee'
                  }"
                >
                  <el-col :span="5">
                    <!-- 二级权限 -->
                    <el-tag
                      type="success"
                      @close="removeRights(scoped.row, item2.id)"
                      closable
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="19">
                    <!-- 三级权限 -->
                    <el-tag
                      closable
                      @close="removeRights(scoped.row, item3.id)"
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                      :cc="index3"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scoped" :cc="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditRoles(scoped.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoles(scoped.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRights(scoped.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialog" width="50%" @close="resetAddForm">
      <!-- 添加角色表单 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesrules"
        ref="addRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRolesDialog" width="50%">
      <!-- 修改角色表单 -->
      <el-form
        :model="eidtRolesForm"
        :rules="editRolesrules"
        ref="editRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="eidtRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="eidtRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="putEditRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialog" width="50%">
      <!-- tree 树形控件 -->
      <!-- default-checked-keys	默认勾选的节点的 key 的数组 -->
      <el-tree
        ref="tree"
        :data="rightsList"
        :props="rightsProps"
        :show-checkbox="true"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="rightsCheckedKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="putRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  角色列表
      RolesList: [],
      // 添加角色对话框
      addRolesDialog: false,
      //添加角色表单
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      // 添加角色校验规则
      addRolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 编辑对话框
      editRolesDialog: false,
      // 编辑角色列表
      eidtRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑角色列表校验规则
      editRolesrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 分配权限对话框
      setRightsDialog: false,
      // tree树形控件列表
      rightsList: [],
      // 配置选项
      // 授权的角色id
      rolesId: "",
      rightsProps: {
        children: "children",
        label: "authName"
      },
      //默认选中的列表
      rightsCheckedKeys: []
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      //   console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.RolesList = res.data;
    },
    //  添加角色
    async addRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        //   console.log(res);
        if (res.meta.status != 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        // this.$refs.addRolesRef.resetField();

        this.addRolesDialog = false;
        this.getRolesList();
      });
    },
    //  删除角色
    async removeRoles(id) {
      const rolesResule = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (rolesResule == "cancel") return this.$message.error("删除角色失败");
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("删除角色失败");
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
    //不管是点击关闭 还是取消 反正只要对话框关闭 就重置表单
    resetAddForm() {
      this.$refs.addRolesRef.resetFields();
    },
    // 回显编辑数据
    async getEditRoles(id) {
      this.editRolesDialog = true;
      // 发起ajax请求，获取数据
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.eidtRolesForm = res.data;
    },
    //  修改信息
    async putEditRoles() {
      // console.log(this.eidtRolesForm.roleId);
      const { data: res } = await this.$http.put(
        `roles/${this.eidtRolesForm.roleId}`,
        this.eidtRolesForm
      );
      if (res.meta.status != 200) return this.$message.error("修改失败");
      this.$message.success("修改角色成功！");
      this.editRolesDialog = false;
      this.getRolesList();
    },
    // 删除tag标签
    async removeRights(role, rightId) {
      // console.log("你要删除这个权限吗");
      let chooseResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      // chooseResult返回两个结果 一个confirm 代表确定  一个cancel代表取消
      // console.log(chooseResult);

      // 如果取消了 那么就告诉用户你取消了操作
      if (chooseResult === "cancel") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      // 如果确定了 那么就发起请求
      if (chooseResult === "confirm") {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        // console.log(role);

        // console.log(role.id, rightId)
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("取消权限失败");
        }

        this.$message.success("取消权限成功");
        // this.getRolesList();
        role.children = res.data;
      }
    },
    // 分配权限
    async setRights(role) {
      // console.log(role.id);
      // 保存当前选中角色id ，方便之后提交
      this.rolesId = role.id;
      this.setRightsDialog = true;
      const { data: res } = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.rightsList = res.data;
      console.log(this.rightsList);

      // 定义一个数组
      let keys = [];
      // 调用 getLeafId
      this.getLeafId(role, keys);
      // 把寻找到的id赋值给默认选中的数组

      this.rightsCheckedKeys = keys;
      // console.log(this.rightsCheckedKeys);
    },
    // 递归 寻找节点id
    getLeafId(role, keyArr) {
      // 只有当前节点没有子元素时，把id存到该数组
      if (!role.children) {
        return keyArr.push(role.id);
      }
      // 如果 role.children还有子元素
      role.children.forEach(item => this.getLeafId(item, keyArr));
    },
    // 提交权限列表
    async putRights() {
      // 获取全选id
      let fullCheckedArr = this.$refs.tree.getCheckedKeys();
      // console.log(fullCheckedArr);
      //  获取半选id
      let HalfCheckedArr = this.$refs.tree.getHalfCheckedKeys();
      // console.log(HalfCheckedArr);
      // 连接id
      let newArr = fullCheckedArr.concat(HalfCheckedArr).join(",");
      // console.log(newArr);

      // 发起请求 提交数据
      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: newArr
        }
      );
      if (res.meta.status != 200) return this.$message.error("更新失败");
      this.$message.success("分配权限成功");
      this.setRightsDialog = false;
      this.getRolesList();
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
</style>
