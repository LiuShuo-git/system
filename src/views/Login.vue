<template>
  <div class="Login">
    <!-- 登陆框卡片 -->
    <el-card class="box-card">
      <!-- 图片 -->
      <div class="avatar">
        <img src="../assets/image/logo.png" />
      </div>
      <!-- FORM 表单 -->
      <el-form class="loginFrom" :model="loginFrom" :rules="loginRules" ref="loginFromRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginFrom.password"></el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="getUserList">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 登录表单
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      // 登录表单校验规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getUserList() {
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return false;
        // 发起请求
        const { data: res } = await this.$http.post("login", this.loginFrom);
        console.log(res);
        // 判断是否登陆成功
        if (res.meta.status != 200) {
          return this.$message.error("登录失败");
        }
        this.$message.success("登录成功");
        // 给绑定token
        window.sessionStorage.setItem("token", res.data.token);
        // 跳转页面
        this.$router.push("/home");
      });

      // const {data:res} =  await this.$http.post('login',this.loginFrom)
      // console.log(res)
    },
    // 重置表单
    // resetFields
    resetFrom() {
      this.$refs.loginFromRef.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.Login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  // 卡片样式
  .box-card {
    width: 450px;
    height: 304px;
    overflow: visible;

    // margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -152px;
    margin-left: -225px;
    // 图片样式
    .avatar {
      position: absolute;
      top: -68px;
      left: 32%;
      width: 148px;
      height: 148px;
      border-radius: 50%;
      border: 1px solid #f3f3f3;
      box-shadow: 0 0 10px #eee;
      overflow: hidden;
      background-color: #fff;

      //  img
      img {
        width: 130px;
        height: 130px;
        background-color: #eee;
        border-radius: 50%;
        margin-left: 9px;

        margin-top: 8px;
      }
    }
    // 表单
    // from 表单
    .loginFrom {
      margin-top: 100px;
    }
    // 按钮
    .btn {
      float: right;
    }
  }
}
</style>

