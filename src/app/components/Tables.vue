<template>
  <div>
    <Query />
    <div id="tables-container">
    <div id="tables">
      <div class="table" :key="table" v-for="table in tables">
        <p class="table-name" @click="this.$router.push(`/table/${ table }`)">{{ table }}</p>
        <p class="delete-button button" @click="this.$store.commit('advertise', { notificationText: `Are you sure that you want to delete the table ${ table }?`, function: this.deleteTable, data: { table: table } })">
          <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="2vh" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
          </svg>
        </p>
        <p class="edit-button button" @click="this.$router.push(`/edit/${ table }`)">
          <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="2vh" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
          </svg>
        </p>
      </div>
      <form id="add-table-form" v-if="this.creating">
        <input type="text" v-model="this.tableToCreate" />
        <button class="check-button button" @click="this.$router.push(`/create/${ this.tableToCreate }`)"><p>
          <svg xmlns="http://www.w3.org/2000/svg" width="5vw" height="100%" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </p></button>
      </form>
      <p id="add-table" @click="this.creating ? this.creating = flase : this.creating = true">+</p>
    </div>
    </div>
  </div>
</template>

<script>
import Query from './Query.vue'

export default {
  components: {
    Query,
  },
  data()
  {
    return {
      tables: [],
      creating: false,
    }
  },
  methods: {
    async DBQuery(query)
    {
      const resp = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query })
      });
      const res = await resp.json();
      return res;
    },
    async showTables()
    {
      this.tables = []
      const tables = await this.DBQuery("SHOW TABLES;")
      tables.forEach(table => 
      {
        this.tables.push(Object.values(table)[0]);
      });
    },
    async deleteTable()
    {
      const res = await fetch(`/api/${ this.$store.state.data.table }`,
      {
        method: 'DELETE',
        header:
        {
          "Content-Type": "applicationjson",
        },
      });
      const resp = await res.json().then(resp =>
      {
        this.showTables();
        this.$store.commit('close');
        if (resp.error) this.$store.commit('notify', { notificationText: resp.error })
      })
    },
  },
  mounted()
  {
    this.showTables();
  }
}
</script>
