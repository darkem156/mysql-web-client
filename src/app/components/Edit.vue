<template>
  <div>
    <Query />
    <p id="table-name">Editing {{ this.$route.params.table }}</p>
    <form class="form">
      <div id="inputs">
        <div class="input-container" v-for="name in columnNames" :key="name">
          <p>{{ name }}</p>
          <input class="insert-text" type="text" v-model="this.data[name]" />
        </div>
        <div class="input-container" >
          <p>Null</p>
          <select class="insert-text" v-model="this.data.Null" >
            <option value="NOT NULL">No</option>
            <option value="">Yes</option>
          </select>
        </div>
        <div class="input-container" >
          <p>Key</p>
          <select class="insert-text" v-model="this.data.Key" >
            <option value="PRIMARY KEY">Primary</option>
            <option value="">None</option>
          </select>
        </div>
      </div>
      <div id="button-container">
        <button class="insert-button" @click="this.update" v-if="editing"><p>Update</p></button>
        <button class="insert-button" @click="this.insert" v-else><p>Insert</p></button>
      </div>
    </form>
    <table id="table">
      <tr>
        <th>
          <div class="column-name-container"><p class="column-name">Field</p></div>
        </th>
        <th>
          <div class="column-name-container"><p class="column-name">Type</p></div>
        </th>
        <th>
          <div class="column-name-container"><p class="column-name">Null</p></div>
        </th>
        <th>
          <div class="column-name-container"><p class="column-name">Key</p></div>
        </th>
        <th>
          <div class="column-name-container"><p class="column-name">Default</p></div>
        </th>
        <th>
          <div class="column-name-container"><p class="column-name">Extra</p></div>
        </th>
        <th><p>Options</p></th>
      </tr>
      <tr v-for="column in columns" :key="column">
        <td><p>{{ column['Field'] }}</p></td>
        <td><p>{{ column['Type'] }}</p></td>
        <td><p>{{ column['Null'] }}</p></td>
        <td><p>{{ column['Key'] }}</p></td>
        <td><p>{{ column['Default'] }}</p></td>
        <td><p>{{ column['Extra'] }}</p></td>
        <td class="options">
          <div class="row-options">
            <p class="delete-button button" @click="this.delete(column['Field'])">
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="1vh" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </p>
            <p class="edit-button button" @click="this.edit(column)">
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="1vh" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
              </svg>
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import Query from "./Query.vue";

export default {
  components:
  {
    Query,
  },
  data()
  {
    return {
      columns: [],
      columnNames: [],
      data: {
        Null: "",
        Key: ""
      },
      editing: false,
    }
  },
  methods:
  {
    async getColumns()
    {
      const { table } = this.$route.params
      const res = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `DESCRIBE ${ table }` })
      })
      const resp = await res.json().then(resp =>
      {
        this.columns = resp;
        this.columnNames = Object.keys(resp[0]).filter(key => key !== 'Null' && key !== 'Key')
      })
    },
    async insert(e)
    {
      e.preventDefault();
      const { table } = this.$route.params
      const defaultText = this.data['Default'] ? `DEFAULT ${ this.data['Default'] }` : '';
      const query = `ALTER TABLE ${ table } ADD COLUMN ${ this.data['Field'] } ${ this.data['Type'] } ${ this.data.Null } ${ defaultText } ${ this.data.Key } ${ this.data['Extra'] }`
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
        else
        {
          this.data = {}
          this.getColumns()
        }
      })
    },
    async delete(name)
    {
      const { table } = this.$route.params
      const query = `ALTER TABLE ${ table } DROP COLUMN ${ name }`
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
        else this.getColumns()
      })
    },
    async edit(column)
    {
      this.data = { ...column }
      this.data.Key = this.data.Key === "PRI" ? this.data.Key = "PRIMARY KEY" : "";
      this.data.Null = this.data.Null === "NO" ? this.data.Null = "NOT NULL": ""
      this.editing = true;
    },
    async update(e)
    {
      e.preventDefault();
      const { table } = this.$route.params
      const savedColumn = this.data;
      savedColumn.Key = savedColumn.Key === "PRI" ? "PRIMARY KEY" : ""
      const defaultText = this.data['Default'] ? `DEFAULT ${ this.data['Default'] }` : '';
      const query = `ALTER TABLE ${ table } MODIFY COLUMN ${ this.data['Field'] } ${ this.data['Type'] } ${ this.data.Null } ${ defaultText } ${ this.data.Key != savedColumn.Key ? this.data.Key : savedColumn.Key } ${ this.data['Extra'] != this.data.Extra ? this.data.Extra : savedColumn.Extra }`
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
        else
        {
          this.data = {}
          this.editing = false;
          this.getColumns()
        }
      })
    }
  },
  mounted()
  {
    this.getColumns();
  }
}
</script>
