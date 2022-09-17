<template>
  <div>
    <div class="notification-back"></div>
    <div id="notification">
      <div id="notification-container">
        <p id="notificationType">{{ this.$store.state.notificationType }}</p>
        <p id="notificationText">{{ this.$store.state.notificationText }} </p>
        <div id="yes-container" v-if="this.$store.state.notificationType == 'Warning'">
          <button id="yes-button" @click="this.$store.state.function">Yes</button>
        </div>
        <button id="close" class="button" @click="this.$store.commit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="4vh" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
