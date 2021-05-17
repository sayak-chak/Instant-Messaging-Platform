<template>
  <v-app>
    <v-app-bar app color="primary" dark />
    <v-main>
      <HelloWorld v-if="this.$store.state.displayLoginForm" />
      <HelloWorld v-else-if="this.$store.state.displaySignUpForm" />
      <HelloWorld v-else-if="this.$store.state.isLoggedIn" />
      <div v-else>
        <v-text-field
          type="text"
          placeholder="username"
          id="username"
        ></v-text-field>
        <v-text-field
          type="password"
          placeholder="password"
          id="password"
        ></v-text-field>
        <v-btn @click="authenticateUser()">Login</v-btn>
        <v-btn @click="registerUser()">Sign Up</v-btn>
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
export default class App extends Vue {
  websocket: WebSocket | undefined;
  beforeCreate(): void {
    document.title = "Chat App";
  }

  registerUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    this.websocket = new WebSocket(
      "ws://" +
        "localhost:3000" + //TODO: move to config files
        "/register?username=" +
        username +
        "&password=" +
        password
    );

    this.websocket.onclose = () => {
      console.log("Handle this"); //TODO???
    };

    this.websocket.addEventListener("message", (registerResponseJSON) => {
      let registerResponse = JSON.parse(registerResponseJSON.data);
      console.log(registerResponse);
    });
    console.log("Reg");
  }

  authenticateUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    this.websocket = new WebSocket(
      "ws://" +
        "localhost:3000" + //TODO: move to config files
        "/login?username=" +
        username +
        "&password=" +
        password
    );

    this.websocket.onclose = () => {
      console.log("Handle this"); //TODO???
    };

    this.websocket.addEventListener("message", (registerResponseJSON) => {
      let registerResponse = JSON.parse(registerResponseJSON.data);
      console.log(registerResponse);
    });
    console.log("Reg");
  }
}
</script>
