import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
      children: [
        // 用户列表
        {
          path: "/users",
          // 懒加载 组件 好处是 用的时候才去引入组件

          component: () => import("@/components/Users.vue")

        },
        // 角色列表
        {
          path: "/roles",
          component: () => import("@/components/Roles.vue")
        },
        // 权限列表
        {
          path: "/rights",
          component: () => import("@/components/RightsList.vue")
        },
        // 商品列表
        {
          path: "/goods",
          component: () => import("@/components/GoodsList.vue")

        },
        // 添加商品
        {
          path: "/goodsAdd",
          component: () => import("@/components/GoodsAdd.vue")

        },
        // 分类参数
        {
          path: "/params",
          component: () => import("@/components/ParamsList.vue")
        },
        // 商品分类
        {
          path: "/categories",
          component: () => import("@/components/Categories.vue")
        },
        // 订单列表
        {
          path: "/orders",
          component: () => import("@/components/OrdersList.vue")
        },
        // 数据报表
        {
          path: "/reports",
          component: () => import("@/components/ReportsList.vue")
        },


      ]
    }, {
      path: "/Login",
      name: "Login",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/Login.vue")
    }
  ]
})
// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next()

})
// 暴露路由
export default router;

