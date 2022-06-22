/* Author: Niels Torp Grønskov, s204510
		   Christian Nykjær Mundbjerg, s204424 */
/* Description: Defines all the routes of the application  */

import {createRouter, createWebHistory} from 'vue-router'
import {isAuthenticated} from "@/services/authentication";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: {name: "display-patients-list"}
        },
        {
            path: '/sign-in',
            name: 'sign-in',
            component: () => import('@/views/authentication/SignInView.vue')
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: () => import('@/views/authentication/SignUpView.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/configuration/SettingsView.vue')
        },
        {
            path: '/graph-demo',
            name: 'graph-demo',
            component: () => import('@/views/GraphDemoView.vue'),
            redirect: {name: "graphview.cgmgraphstest"},
            children:
                [
                    {
                        path: "IconTest",
                        name: "graphview.icontest",
                        component: () => import("@/views/graph-demo/IconDemo.vue"),
                    },
                    {
                        path: "LineTest",
                        name: "graphview.linetest",
                        component: () => import("@/views/graph-demo/LineDemo.vue"),
                    },
                    {
                        path: "QuantileTest",
                        name: "graphview.quantiletest",
                        component: () => import("@/views/graph-demo/QuantileDemo.vue"),
                    },
                    {
                        path: "CGMGraphsTest",
                        name: "graphview.cgmgraphstest",
                        component: () => import("@/views/graph-demo/CGMGraphsDemo.vue"),
                    },
                    {
                        path: "TIRTest",
                        name: "graphview.tirtest",
                        component: () => import("@/views/graph-demo/TIRDemo.vue"),
                    },
                ]
        },
        {
            path: "/display-patients",
            name: "display-patients",
            component: () => import('@/views/DisplayPatients.vue')
        },
        {
            path: "/display-patients-list",
            name: "display-patients-list",
            component: () => import('@/views/DisplayPatientsInList.vue'),
            children: [
                {
                    //TODO håndter id der ikke eksistere
                    path: "patient-info/:id",
                    component: () => import('@/views/PatientInfo.vue')
                },
                {
                    path: "",
                    component: () => import('@/views/Summary.vue')
                },
                {
                    path: "patient-info/",
                    component: () => import('@/views/Summary.vue')
                }
            ]
        },
        {
            path: "/patient-info/:id",
            name: "patient-info",
            component: () => import('@/views/PatientInfo.vue')
        }
    ],
    linkActiveClass: "fullstack-active-link"
});

router.beforeEach((to, from, next) => {
    if (to.path === "/sign-in" || to.path === "/sign-up") {
        next()
    } else if (isAuthenticated()) {
        next()
    } else {
        next("/sign-in")
    }
});


export default router
