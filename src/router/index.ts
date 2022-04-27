import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/jonas',
      name: 'jonas',
      component: () => import('../views/JonasView.vue')
    },
    {
      path: "/DisplayPatients",
      name: "DisplayPatients",
      component: () => import('../views/DisplayPatients.vue')
    },
    {
      path: "/DisplayPatientsList",
      name: "DisplayPatientsList",
      component: () => import('../views/DisplayPatientsInList.vue'),
      children: [
        {
          path: "patientInfo/:id",
          component: () => import('../views/PatientInfo.vue')
        }
      ]
    }
  ]
})

export default router
