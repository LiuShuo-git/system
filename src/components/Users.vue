<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框    -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="infoList.query">
            <el-button slot="append" icon="el-icon-search" @click="getusersList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="10">
          <el-button type="primary" @click="addDialog = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- tab 表格 -->
      <el-table :data="usresList" stripe style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="changeState(scoped.row.id,scoped.row.mg_state,scoped.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped" :cc="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getEditUser(scoped.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scoped.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getroleList(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="infoList.pagnum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="infoList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotal"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%">
      <!-- 添加用户表单 -->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialog" width="50%">
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUserRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="putEditUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="rolesDialog" width="50%">
      <p>当前的用户:{{rowList.username}}</p>
      <p>当前的角色:{{rowList.role_name}}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoles" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求列表
      infoList: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表
      usresList: [],
      // 分页数据总条数
      usersTotal: 0,
      // 添加用户对话框
      addDialog: false,
      // 添加用户列表
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户列表校验规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      // 修改用户对话框
      editDialog: false,
      // 修改用户列表
      editUserForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 修改用户校验规则
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      },
      // 分配角色对话框
      rolesDialog: false,
      // 当前用户信息
      rowList: [],
      // 分配角色级联选择器
      // 角色列表
      roleList: [],
      // 选中的option
      selectedRoles: ""
    };
  },
  methods: {
    // 获取用户表单数据
    async getusersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.infoList
      });
      // console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败");
      this.usresList = res.data.users;
      // console.log(this.usresList);
      this.usersTotal = res.data.total;
    },
    // 每页显示条目个数变化时触发
    handleSizeChange(size) {
      this.infoList.pagesize = size;
      this.getusersList();
      // console.log(1);
    },
    //当前页数改变时会触发
    handleCurrentChange(num) {
      // console.log(2);\
      this.infoList.pagenum = num;
      this.getusersList();
    },
    // 修改用户状态
    async changeState(id, state, row) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`);
      if (res.meta.status != 200) return this.$message.error("修改状态失败");
    },
    // 添加用户
    async addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status != 201) return this.$message.error("创建用户失败");
        this.$message.success("创建用户成功");
        this.addDialog = false;
        this.getusersList();
      });
    },
    // 删除用户
    async removeUser(id) {
      // console.log(id)
      const removeResult = await this.$confirm(
        "此操作将永久删除该用户件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (removeResult == "cancel") {
        return this.$message.error("取消删除");
      } else {
        // 发起请求 删除用户
        const { data: res } = await this.$http.delete(`users/${id}`);
        // console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("删除用户失败");
        }
        this.$message.success("删除用户成功");
        if (this.usresList.length == 1 && this.infoList.pagenum > 1) {
          this.infoList.pagenum--;
        }
        this.getusersList();
      }
    },
    // 修改用户列表回显
    async getEditUser(id) {
      this.editDialog = true;
      // console.log(id);
      // 发起ajax请求
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200) return this.$message.error("获取失败");
      // 把获取数据赋值给editUserForm

      this.editUserForm = res.data;
    },
    // 提交修改用户信息
    async putEditUser() {
      // await console.log(this.editUserForm.id);
      const { data: res } = await this.$http.put(
        `users/${this.editUserForm.id}`,
        this.editUserForm
      );
      // console.log(res)
      if (res.meta.status != 200) return this.$message.error("更新失败");
      this.$message.success("更新用户成功");
      this.editDialog = false;
      this.getusersList();
    },
    // 获取角色列表
    async getroleList(row) {
      this.rolesDialog = true;
      this.rowList = row;
      // console.log(this.rowList);
      const { data: res } = await this.$http.get("roles");
      this.roleList = res.data;
    },
    async saveSignRoles() {
      // await console.log(this.selectedRoles);
      if (!this.selectedRoles) return this.$message.error("角色不能为空");
      const { data: res } = await this.$http.put(
        `users/${this.rowList.id}/role`,
        {
          rid: this.selectedRoles
        }
      );
      console.log(res);

      if (res.meta.status != 200) return this.$message.error("设置角色失败");
      this.$message.success("设置角色成功");
      this.rolesDialog = false;
      this.getusersList();
    }
  },
  created() {
    this.getusersList();
  }
};
</script>

<style lang="less" scoped>
.el-card,
.el-table {
  margin-top: 15px;
}
</style>

