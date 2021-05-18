<template>
  <v-app>
    <v-app-bar app color="primary" dark />
    <v-main>
      <MessagingPortal v-if="this.$store.state.isLoggedIn" />
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
import MessagingPortal from "./components/MessagingPortal.vue";
import config from "./../config.json";

@Component({
  components: {
    MessagingPortal,
  },
})
export default class App extends Vue {
  websocket: WebSocket | undefined;
  beforeCreate(): void {
    document.title = "Chat App";
  }

  created(): void {
    if (this.$cookies.isKey("AUTH-TOKEN")) {
      this.$http
        .post(config.API_HTTPS + "/logincheck", {
          "AUTH-TOKEN": this.$cookies.get("AUTH-TOKEN"),
        })
        .then(
          (response) => console.log(response.data),
          (error) => console.log(error)
        );
    }
  }

  registerUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    this.websocket = new WebSocket(
      config.API_WS + "/register?username=" + username + "&password=" + password
    );

    this.websocket.addEventListener("message", (registerResponseJSON) => {
      let registerResponse = JSON.parse(registerResponseJSON.data);
      if (registerResponse.isRequestSuccessful) {
        this.loadChattingInterface(username);
      } else {
        console.log("FAIL ", registerResponse); //TODO: handle sad paths
      }
    });
  }

  authenticateUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    this.websocket = new WebSocket(
      config.API_WS + //TODO: move to config files
        "/login?username=" +
        username +
        "&password=" +
        password
    );

    this.websocket.addEventListener("message", (registerResponseJSON) => {
      let registerResponse = JSON.parse(registerResponseJSON.data);
      if (registerResponse.isRequestSuccessful) {
        this.loadChattingInterface(username);
      } else {
        console.log("FAIL ", registerResponse); //TODO: handle sad paths
      }
    });
    console.log("Reg");
  }

  loadChattingInterface(username: string): void {
    this.$store.commit("setUsername", username); //TODO: refactor to cookie/auth token system
    this.$store.commit("loginUser");
    this.$store.commit("loadChattingPortal");
  }
}
</script>
