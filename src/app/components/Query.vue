<template>
  <div>
    <form id="query-form">
      <input id="query-text" type="text" placeholder="Make a Query" v-model="this.query" />
      <button id="query-send" v-on:click="send" >SEND</button>
    </form>
  </div>
</template>

<script>
export default {
  data()
  {
    return {
      query: "",
    }
  },
  methods: {
    async send(e)
    {
      e.preventDefault();
      const resp = await fetch('/api/query', 
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: this.query })
      });
      const res = await resp.json();
      if(res.error) this.$store.commit('notify', { notificationText: res.error })
      else this.$store.commit('render')
    },
  },
  mounted()
  {
  }
}
</script>
