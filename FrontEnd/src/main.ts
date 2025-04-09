import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Menu from 'primevue/menu'
import PanelMenu from 'primevue/panelmenu'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'

const app = createApp(App)

app.use(PrimeVue)
app.use(router)
app.use(ToastService)

// Register PrimeVue Components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Menu', Menu)
app.component('PanelMenu', PanelMenu)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Card', Card)

app.mount('#app')