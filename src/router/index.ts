import {createRouter, createWebHistory} from 'vue-router'
import {isAuthenticated} from "@/services/authentication";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import("@/views/HomeView.vue")
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
            path: '/GraphView',
            name: 'GraphView',
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
            path: "/DisplayPatients",
            name: "DisplayPatients",
            component: () => import('@/views/DisplayPatients.vue')
        },
        {
            path: "/DisplayPatientsList",
            name: "DisplayPatientsList",
            component: () => import('@/views/DisplayPatientsInList.vue'),
            children: [
                {
                    //TODO håndter id der ikke eksistere
                    path: "patientInfo/:id",
                    component: () => import('@/views/PatientInfo.vue')
                },
                {
                    path: "",
                    component: () => import('@/views/Summary.vue')
                },
                {
                    path: "patientInfo/",
                    component: () => import('@/views/Summary.vue')
                }
            ]
        },
        {
            path: "/patientInfo/:id",
            name: "patientInfo",
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
