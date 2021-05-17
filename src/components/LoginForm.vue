<template>
  <v-app>
    <v-app-bar app color="primary" dark />
    <v-main>
      <HelloWorld v-if="this.$store.state.displayLoginForm" />
      <HelloWorld v-else-if="this.$store.state.displaySignUpForm" />
      <HelloWorld v-else-if="this.$store.state.isLoggedIn" />
      <div v-else>
        <v-btn
          @click="
            () => {
              this.$store.commit('showLoginForm');
            }
          "
          >Login</v-btn
        >
        <v-btn
          @click="
            () => {
              this.$store.commit('showSignUpForm');
            }
          "
          >Sign Up</v-btn
        >
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
@Component({
  components: {
    HelloWorld,
  },
})
export default class LoginForm extends Vue { 
  authenticateUser(): void {
    this.$store.commit("loginUser");
  }
}
</script>
