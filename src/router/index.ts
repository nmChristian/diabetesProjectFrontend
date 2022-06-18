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
            component: () => import('@/views/GraphView.vue'),
            redirect: {name: "graphview.cgmgraphstest"},
            children:
                [
                    {
                        path: "IconTest",
                        name: "graphview.icontest",
                        component: () => import("@/components/graphview/test/IconTest.vue"),
                    },
                    {
                        path: "LineTest",
                        name: "graphview.linetest",
                        component: () => import("@/components/graphview/test/LineTest.vue"),
                    },
                    {
                        path: "QuantileTest",
                        name: "graphview.quantiletest",
                        component: () => import("@/components/graphview/test/QuantileTest.vue"),
                    },
                    {
                        path: "CGMGraphsTest",
                        name: "graphview.cgmgraphstest",
                        component: () => import("@/components/graphview/test/CGMGraphsTest.vue"),
                    },
                    {
                        path: "TIRTest",
                        name: "graphview.tirtest",
                        component: () => import("@/components/graphview/test/TIRTest.vue"),
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
