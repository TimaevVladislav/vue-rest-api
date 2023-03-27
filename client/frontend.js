import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.js'

Vue.component("loader", {
    template: `
     <div class="spinner-border text-danger" role="status">
     <span class="sr-only">Loading...</span>
     </div>
    `
})

new Vue({
    el: "#app",
    loading: false,
    data: () => ({
        form: {
            name: "",
            value: ""
        },
        contacts: []
    }),
    computed: {
      create() {
          return this.form.value.trim() && this.form.name.trim()
      }
    },
    async mounted() {
      this.loading = true
      this.contacts = await request("/api/contacts")
      this.loading = false
    },
    methods: {
        async createContact() {
            const {...contact} = this.form

            const response = await request("/api/contacts", contact)

            this.contacts.push(response)
            this.form.name = this.form.value = ""
        },
        markContact(id) {
           const contact = this.contacts.find(c => c.id === id)
           contact.marked = true
        },
        deleteContact(id) {
           this.contacts = this.contacts.filter(c => c.id !== id)
        }
    }
})

async function request(url, method , data = null) {
  try {
    const headers = {}
    let body

    if (data) {
        headers["Content-Type"] = "application/json",
        body = JSON.stringify(data)
    }
    const response = await fetch(url, {method, headers, body})
    return await response.json()
  } catch (e) {
    console.warn("Error:", e.message)
  }
}