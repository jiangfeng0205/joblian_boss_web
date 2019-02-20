import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import test from '@/components/login/test'

//1 、组件异步加载，只有在组件被访问的时候才会加载，提高了性能
const home = resolve => require(['@/components/common/home'], resolve)
const job = resolve => require(['@/components/common/home2'], resolve)
const registerReg = resolve => require(['@/components/login/registerReg'], resolve)
const register1 = resolve => require(['@/components/login/register1'], resolve)
const register2 = resolve => require(['@/components/login/register2'], resolve)
const register3 = resolve => require(['@/components/login/register3'], resolve)
const registerHy = resolve => require(['@/components/login/registerHy'], resolve)
const registerZn = resolve => require(['@/components/login/registerZn'], resolve)
const registerCity = resolve => require(['@/components/login/registerCity'], resolve)
const joblist = resolve => require(['@/components/job/joblist'], resolve)
const jobdetail = resolve => require(['@/components/job/jobdetail'], resolve)
const jobchat = resolve => require(['@/components/job/jobchat'], resolve)
const joblistMyself = resolve => require(['@/components/job/joblistMyself'], resolve)

const company = resolve => require(['@/components/company/company'], resolve)
const comDetail = resolve => require(['@/components/company/comDetail'], resolve)
const joblistMself = resolve => require(['@/components/job/joblistMyself'], resolve)
const companyjobadd = resolve => require(['@/components/company/companyjobadd'], resolve)
const companyjobDetail = resolve => require(['@/components/company/companyjobDetail'], resolve)
const comJobDetail = resolve => require(['@/components/company/comJobDetail'], resolve)
const companyjobpublishmode = resolve => require(['@/components/company/companyjobpublishmode'], resolve)
const companyjobaddjobname = resolve => require(['@/components/company/companyjobaddjobname'], resolve)
const companyjobaddedu = resolve => require(['@/components/company/companyjobaddedu'], resolve)
const companyJobCity = resolve => require(['@/components/company/companyJobCity'], resolve)
const companyJobHy = resolve => require(['@/components/company/companyJobHy'], resolve)

const message = resolve => require(['@/components/message/message'], resolve)
// 嵌套路由有BUG ，直接切换了
// const mesChat = resolve => require(['@/components/message/mesChat'], resolve)
// const mesInteract = resolve => require(['@/components/message/mesInteract'], resolve)

const meschatDetail = resolve => require(['@/components/message/meschatDetail'], resolve)

const aboutme = resolve => require(['@/components/aboutme/myinfo'], resolve)

Vue.use(Router)
// 3 如何保证在最顶部
// 3.0 路由每次进入详情，默认滚动在最顶部
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    // console.log(position)
    return position
  }
}
// 3.1 mode: 'history',
// 3.2 scrollBehavior,
// 3.3 meta: { scrollToTop: true }

export  function createRouter() {
    return new Router({
        mode: 'history',
        // mode: 'hash',
        scrollBehavior,
        routes: [
            {
                path:'/',
                redirect: {
                    name: 'test',
                },
            },
            {
                path:'/login',
                name:"login",
                component:login
            },
            {
                path:'/test',
                name:"test",
                component:test
            },
        ]
    })
};

// export default new Router({
//   mode: 'history',
//   // mode: 'hash',
//   scrollBehavior,
//   routes: [
//       {
//           path:'/',
//           redirect: {
//               name: 'joblist',
//           },
//           meta: {
//               title: '首页',
//               type: 'login'  // 是否需要判断是否登录,这里是需要判断
//           }
//       },
//       {
//           path:'/login',
//           name:"login",
//           component:login
//       },
//       {
//           path:'/home',
//           component:home,
//           mate: { keepAlive: true },
//           children:[
//             {
//               path:'/',
//               name:"joblist",
//               component:joblist,
//               meta: {
//                   title: '首页',
//                   type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               }
//             },
//             {
//               path:"/joblistMself",
//               name:"joblistMself",
//               component:joblistMself,
//               meta: {
//                 scrollToTop: true,
//                 title: '首页',
//                 type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               }
//             },
//             {
//               path:"/company",
//               name:"company",
//               component:company,
//               meta: {
//                   title: '首页',
//                   type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               }
//             },
//             {
//               path:"/company/companyjobadd",
//               name:"companyjobadd",
//               component:companyjobadd,
//               // meta: {
//               //     title: '首页',
//               //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               // },
//             },
//             {
//               path:"/company/companyjobDetail/:jobId",
//               name:"companyjobadd",
//               component:companyjobDetail,
//               meta: {
//                   title: '首页',
//                   type: 'login'
//               },
//             },
//             {
//               path:"/comJobDetail/:jobId",
//               name:"comJobDetail",
//               component:comJobDetail,
//             },
//             {
//               path:"/company/companyjobpublishmode/:jobId",
//               name:"companyjobpublishmode",
//               component:companyjobpublishmode,
//               // meta: {
//               //     title: '首页',
//               //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               // },
//             },
//             {
//               path:"/company/companyjobaddjobname/:type/:jobId",
//               name:"companyjobaddjobname",
//               component:companyjobaddjobname,
//               // meta: {
//               //     title: '首页',
//               //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               // },
//             },
//             {
//               path:"/company/companyjobaddedu",
//               name:"companyjobaddedu",
//               component:companyjobaddedu,
//               // meta: {
//               //     title: '首页',
//               //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               // },
//             },

//             {
//               path:"/message",
//               component:message,
//               meta: {
//                   title: '首页',
//                   type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               }
//             },
//             {
//               path:"/aboutme",
//               name:"me",
//               component:aboutme,
//               meta: {
//                   title: '首页',
//                   type: 'login'  // 是否需要判断是否登录,这里是需要判断
//               }
//             }
//           ]
//       },
//       {
//         path:"/detail/:jobId",
//         name:"detail",
//         component:jobdetail,
//         meta: {
//           scrollToTop: true,
//           title: '首页',
//           type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         }
//       },
//       {
//         path:"/chat",
//         name:"chat",
//         component:jobchat,
//         meta: {
//           scrollToTop: true,
//           title: '首页',
//           type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         }
//       },

//       {
//           path:'/job',
//           component:job,
//           mate: { keepAlive: true },
//           children:[
//               {
//                   path:"/joblistMyself",
//                   name:"joblistMyself",
//                   component:joblistMyself,
//                   meta: {
//                     scrollToTop: true,
//                     title: '首页',
//                     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//                   }
//               },
//           ],
//       },

//       // {
//       //   path:"/joblistMyself",
//       //   name:"joblistMyself",
//       //   component:joblistMyself,
//       //   meta: {
//       //     scrollToTop: true,
//       //     title: '首页',
//       //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//       //   }
//       // },

//       {
//         path:"/comdetail/:id",
//         name:"comDetail",
//         component:comDetail,
//         meta: {
//             title: '首页',
//             type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         }
//       },
//       {
//         path:"/company/companyJobCity",
//         name:"companyJobCity",
//         component:companyJobCity,
//         // meta: {
//         //     title: '首页',
//         //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         // },
//       },
//       {
//         path:"/company/companyJobHy",
//         name:"companyJobHy",
//         component:companyJobHy,
//         // meta: {
//         //     title: '首页',
//         //     type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         // },
//       },
//       {
//         path:"/meschatDetail",
//         name:"meschatDetail",
//         component:meschatDetail,
//         meta: {
//             title: '首页',
//             type: 'login'  // 是否需要判断是否登录,这里是需要判断
//         }
//       },

//       {
//         path:"/registerReg",
//         name:"registerReg",
//         component:registerReg,
//       },

//       {
//         path:"/register1",
//         name:"register1",
//         component:register1,
//       },
//       {
//         path:"/register2",
//         name:"register2",
//         component:register2,
//       },
//       {
//         path:"/register3",
//         name:"register3",
//         component:register3,
//       },
//       {
//         path:"/registerHy",
//         name:"registerHy",
//         component:registerHy,
//       },
//       {
//         path:"/registerZn",
//         name:"registerZn",
//         component:registerZn,
//       },
//       {
//         path:"/registerCity",
//         name:"registerCity",
//         component:registerCity,
//       },
//   ]
// });
