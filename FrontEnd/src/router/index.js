import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            name: 'Auth',
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: () => import('../views/auth/Login.vue')
                },
                {
                    path: 'access-denied',
                    name: 'AccessDenied',
                    component: () => import('../views/auth/AccessDenied.vue')
                }
            ]
        },
        {
            path: '/',
            component: AppLayout,
            redirect: '/home',
            children: [
                {
                    path: 'home',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: 'books',
                    name: 'books-management',
                    component: () => import('../views/Books.vue')
                },
                {
                    path: 'members',
                    name: 'members-management',
                    component: () => import('../views/Members.vue')
                }
            ]
        }
    ]
})

export default router
