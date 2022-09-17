<template>
  <Nav />
  <Notification v-if="this.$store.state.notificationView" />
  <router-view :key="this.$store.state.render" />
</template>
<script>
import Nav from "./Nav.vue";
import Notification from "./Notification.vue"

export default {
  components: {
    Nav,
    Notification,
  }
}
</script>
