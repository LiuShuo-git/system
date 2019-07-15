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
        {
          path: "/users",
          // 懒加载 组件 好处是 用的时候才去引入组件
          component: () => import("@/components/Users.vue")
        }, {
          path: "/roles",
          component: () => import("@/components/Roles.vue")
        }]
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

