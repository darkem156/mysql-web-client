<template>
  <div>
    <Query />
    <form class="form">
      <div id="inputs">
        <div class="input-container">
          <p>Field</p>
          <input class="insert-text" v-model="data.Field" type="text" />
        </div>
        <div class="input-container">
          <p>Type</p>
          <input class="insert-text" v-model="data.Type" type="text" />
        </div>
        <div class="input-container">
          <p>Default</p>
          <input class="insert-text" v-model="data.Default" type="text" />
        </div>
        <div class="input-container">
          <p>Extra</p>
          <input class="insert-text" v-model="data.Extra" type="text" />
        </div>
        <div class="input-container" >
          <p>Null</p>
          <select class="insert-text" v-model="data.Null" >
            <option value="NOT NULL">No</option>
            <option value="">Yes</option>
          </select>
        </div>
        <div class="input-container" >
          <p>Key</p>
          <select class="insert-text" v-model="data.Key" >
            <option value="PRIMARY KEY">Primary</option>
            <option value="">None</option>
          </select>
        </div>
      </div>
      <div id="button-container">
        <button class="insert-button" @click="this.create"><p>Create</p></button>
      </div>
    </form>
  </div>
</template>
<script>
import Query from "./Query.vue";

export default {
  components:
  {
    Query,
  },
  data() {
    return {
      data: {
        Null: "",
        Key: "",
      },
    }
  },
  methods: {
    async create(e)
    {
      e.preventDefault();
      const { Field, Type, Key, Null, Extra, Default } = this.data;
      const query = `CREATE TABLE ${ this.$route.params.table }(${ Field } ${ Type } ${ Key } ${ Null } ${ Extra ? Extra : "" } ${ Default ? `DEFAULT ${ Default }` : "" })`
      const res = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
      })
      const resp = await res.json().then(resp =>
      {
        if(resp.error) this.$store.commit('notify', { notificationText: resp.error })
        else this.$router.push(`/edit/${ this.$route.params.table }`)
      })
    },
  },
}
</script>
