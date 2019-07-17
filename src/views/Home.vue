<template>
  <div class="home">
    <el-container>
      <el-header>
         
        <img src="../assets/image/heima.png" alt />
             <P>电商后台管理系统</p>
            <el-button type="info"  @click="removeUser">退出</el-button>
  
      </el-header>
      <el-container>
        <el-aside  :width="collapse?'64px': '200px'">
     
          <!-- 侧边栏 -->
            <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="collapse"
      :collapse-transition="false"
      
      :router="true"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff">
           <!-- 收缩 -->
      <div class="toggle-aside" @click="collapse = !collapse">|||</div>
      <el-submenu :index="item.path" v-for="(item,index) in menuList" :key="item.id" :cc="index">
        <template slot="title">
          <i :class="iconList[index]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="subItem.path" v-for="(subItem,subIndex) in item.children" :key="subItem.id" :cc="subIndex">{{subItem.authName}}</el-menu-item>
     
        </el-menu-item-group>

      </el-submenu>
    
    </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
      // 菜单栏数据
      menuList:[],
      // 图标列表
            iconList: [
        "el-icon-user-solid",
        "el-icon-s-promotion",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-marketing"
      ],
      // 是否展开，默认为true
      collapse:false,

      
    };
  },
  methods: {
    async getmenusList() {
      const { data: res } = await this.$http.get("menus");
      // console.log(res);
      this.menuList=res.data;
      // console.log(this.menuList)
    },
    // 退出方法
    removeUser(){
      // 点击退出 ，清除token
      window.sessionStorage.removeItem('token')
      // 刷新页面
      this.$router.go(0)
    }
  },
  created() {
    this.getmenusList();
  }
};
</script>

<style lang="less" scoped>

.el-header {
  background-color: #373d41;
  color: #fff;
  // text-align: center;
  line-height: 60px;
  .el-button{
    margin-top: 10px;
    float: right;
  }
  img{
    float: left;
    padding-top: 2px;
  }
 p{
    color: #fff;
    font-size: 22px;
    float: left;
    margin-left: 20px;
    line-height: 18px;
}
}
.el-aside {
  background-color: #333744;
  width: 200px;
  color: #333;
  text-align: center;
  line-height: 478px;
}

.el-main {
  background-color: #eaedf1;

  color: #333;

}
.el-container {
  height: 100%;
}
.home {
  height: 100%;
}
.toggle-aside{
  width: 100%;
  background-color: #4a5064;
  color: #fff;
  height: 25px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  letter-spacing: .1em;
  font-size: 12px;
}
</style>
