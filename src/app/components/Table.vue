<template>
  <div>
    <Query />
    <p id="table-name">{{ this.$route.params.table }}</p>
    <form class="form">
      <div id="inputs">
        <div class="input-container" :key="column" v-for="column in columns">
          <p>{{ `${ column['Field'] } (${ column['Type'] })` }}</p>
          <input class="insert-text" v-model="this.data[column['Field']]" type="text" />
        </div>
      </div>
      <div id="button-container">
        <button class="insert-button" @click="this.update" v-if="editing"><p>Update</p></button>
        <button class="insert-button" @click="this.insert" v-else><p>Insert</p></button>
      </div>
    </form>
    <table id="table">
      <tr>
        <th :key="column" v-for="column in columns">
          <div class="column-name-container"><p class="column-name">{{ column['Field'] }}</p></div>
        </th>
        <th><p>Options</p></th>
      </tr>
      <tr v-for="row in rows" :key="row">
        <td v-for="value in row" :key="value"><p>{{ value || 'NULL' }}</p></td>
        <td class="options">
          <div class="row-options">
            <p class="delete-button button" @click="this.delete(row)">
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="1vh" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </p>
            <p class="edit-button button" @click="this.edit(row)">
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
import Query from './Query.vue';

export default {
  components:
  {
    Query,
  },
  data()
  {
    return {
      columns: [],
      rows: [],
      priKey: '',
      data: {
      },
      editing: false,
    }
  },
  methods: {
    async getPriKey()
    {
      const table = this.$route.params.table;
      const resp = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `DESCRIBE ${ table };` })
      });
      const res = await resp.json()
      res.map(column =>
      {
        if(column["Key"] === "PRI") this.priKey = column["Field"];
        this.columns.push(column);
      })
    },
    async select()
    {
      const { table } = this.$route.params;
      const resp = await fetch(`/api/table/${ table }`, 
      {
        method: 'GET',
      });
      const res = await resp.json();
      this.rows = res;
    },
    async delete(row)
    {
      const { table } = this.$route.params;
      const priKey = this.priKey;
      const resp = await fetch(`/api/${ table }/${ priKey }/${ isNaN(parseInt(row[priKey])) ? "'" + row[priKey] + "'" : row[priKey] }`, 
      {
        method: 'DELETE',
      });
      const res = await resp.json().then((res) => 
      {
        this.select();
        if(!res.error) 
        {
          this.data = {}
          this.editing = false;
        }
        else this.$store.commit('notify', { notificationText: res.error })
      })
    },
    async edit(row)
    {
      this.savedRow = { ...row };
      this.editing = true;
      for (const value in row) {
        this.data[value] = isNaN(parseInt(row[value])) ? "'" + row[value] + "'" : row[value];
        this.data[value] = row[value] === null ? null : this.data[value];
      }
    },
    async update(e)
    {
      e.preventDefault()
      const { table } = this.$route.params;
      const priKey = this.priKey;

      const values = {};
      for (const data in this.data) 
      {
        const value = this.data[data] === null ? null : isNaN(parseInt(this.data[data])) ? this.data[data].split("'")[1] : this.data[data]
        if (value === this.savedRow[data]) continue;
        values[data] = isNaN(parseInt(this.data[data])) ? this.data[data] : parseInt(this.data[data])
      }

      const resp = await fetch(`/api/${ table }/${ priKey }/${ this.savedRow[priKey] }`,
      {
        method: 'PATCH',
        headers:
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      const res = await resp.json().then((res) => 
      {
        this.select();
        if(!res.error) 
        {
          this.data = {}
          this.editing = false;
        }
        else this.$store.commit('notify', { notificationText: res.error })
      })
    },
    async insert(e)
    {
      e.preventDefault()
      const columns = Object.keys(this.data).join()
      const texts = [];
      Object.keys(this.data).map(key =>
      {
        const value = isNaN(parseInt(this.data[key])) ? this.data[key] : parseInt(this.data[key])
        if(this.data[key] !== "") texts.push(value)
      })
      const values = texts.join()
      const resp = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `INSERT INTO ${this.$route.params.table}(${columns}) VALUES(${values});` })
      });
      const res = await resp.json().then((res) => 
      {
        this.select()
        if(!res.error) this.data = {}
        else this.$store.commit('notify', { notificationText: res.error })
      });
    },
  },
  mounted() {
    this.select();
    this.getPriKey();
  },
}
</script>
