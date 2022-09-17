<template>
  <div>
    <Nav />
    <p id="table-name">Set DB Options</p>
    <form class="form">
      <div id="inputs">
        <div class="input-container">
          <p>Host</p>
          <input class="insert-text" type="text" v-model=this.data.host placeholder="Database Host" />
        </div>
        <div class="input-container">
          <p>User</p>
          <input class="insert-text" type="text" v-model=this.data.user placeholder="Database User" />
        </div>
        <div class="input-container">
          <p>Password</p>
          <input class="insert-text" type="password" v-model=this.data.password placeholder="Database Password" />
        </div>
        <div class="input-container">
          <p>Name</p>
          <input class="insert-text" type="text" v-model=this.data.name placeholder="Database Name" />
        </div>
      </div>
      <div id="button-container">
        <button class="insert-button" @click="send"><p>Send</p></button>
      </div>
    </form>
  </div>
</template>

<script>
import Nav from "./Nav.vue";

export default {
  components: {
    Nav,
  },
  data()
  {
    return {
      data: 
      {
        host: "",
        user: "",
        password: "",
        name: "",
      }
    }
  },
  mounted() {
    this.getDBData();
  },
  methods: {
    async send(e) 
    {
      e.preventDefault();
      let data = JSON.stringify(this.data);
      const resp = await fetch('/api/setdb', 
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json"
        },
        body: data
      });
      const res = await resp.text();
      if(res === "DB Uploaded") location.replace('/');
    },
    async getDBData()
    {
      const resp = await fetch('/api/getdb');
      const res = await resp.json();
      this.data = res;
    }
  },
}
</script>
