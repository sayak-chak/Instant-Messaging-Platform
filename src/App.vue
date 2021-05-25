<template>
  <v-app id="app">
    <v-app-bar app color="rgb(234, 239, 245)" dark>
      <v-img
        class="mx-2"
        src="../public/logo.png"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
    </v-app-bar>
    <v-main id="main-app">
      <MessagingPortal
        :websocket="this.websocket"
        v-if="this.$store.state.isLoggedIn"
      />
      <div v-else>
        <v-row justify="center" align="center">
          <v-col cols="10" xs="12" sm="8" md="6">
            <v-row justify="center" align="center" id="login-register-form">
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      type="text"
                      placeholder="username"
                      id="username"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="password"
                      placeholder="password"
                      id="password"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" xs="12" sm="5">
                    <v-btn
                      rounded
                      color="black"
                      dark
                      @click="authenticateUser()"
                      id="login-button"
                      >Login
                    </v-btn>
                  </v-col>
                  <v-col cols="0" xs="0" sm="2"></v-col>
                  <v-col cols="12" xs="12" sm="5">
                    <v-btn
                      rounded
                      color="black"
                      dark
                      @click="registerUser()"
                      id="register-button"
                      >Signup</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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

  mounted(): void {
    this.$http.get(config.API_HTTPS + "/logincheck").then(
      (response) => {
        this.websocket = new WebSocket(
          config.API_WS +
            "/chat" +
            "?sender=" +
            response.data.username +
            "&auth=" +
            response.data.auth
        );
        if (typeof response.data.username === "string") {
          this.websocket.addEventListener("message", (incomingChatJSON) => {
            let incomingChat = JSON.parse(incomingChatJSON.data);
            if (
              incomingChat.type == "Group" ||
              (incomingChat.type == "Personal" &&
                (incomingChat.sender == this.$store.state.currentChatter ||
                  incomingChat.sender == this.$store.state.username))
            ) {
              this.$store.commit("appendMessage", {
                sender: incomingChat.sender,
                message: incomingChat.message,
              });
            }
          });
          this.loadMessagingPortal(response.data.username);
        } else {
          //TODO: handle sad paths
        }
      },
      (error) => console.log(error)
    );
  }

  registerUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;

    this.$http
      .post(config.API_HTTPS + "/register", {
        username: username,
        password: password,
      })
      .then(
        (registerResponseJSON) => {
          if (registerResponseJSON.data.isRequestSuccessful) {
            this.loadMessagingPortal(username);
            window.location.reload(); //TODO: refactor
          } else {
            //TODO: handle sad paths
          }
        },
        (error) => console.log(error) //TODO: handle sad paths
      );
  }

  authenticateUser(): void {
    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;
    this.$http
      .post(
        config.API_HTTPS + "/login",
        {
          username: username,
          password: password,
        }
        // options
      )
      .then(
        (registerResponseJSON) => {
          if (registerResponseJSON.data.isRequestSuccessful) {
            this.loadMessagingPortal(username);
            window.location.reload(); //TODO: refactor
          } else {
            //TODO: handle sad paths
          }
        },
        (error) => console.log(error) //TODO: handle sad paths
      );
  }

  loadMessagingPortal(username: string): void {
    this.$store.commit("setUsername", username);
    this.$store.commit("loginUser");
  }
}
</script>

<style scoped>
#app {
  background-color: rgb(169, 204, 250);
}
#login-register-form {
  margin-top: 30%;
  border: 2px solid black;
  border-radius: 10px;
  background-color: rgb(212, 215, 219);
}
#main-app {
  margin: 10px;
  margin-top: 30px;
}
#login-button {
  width: 100%;
}
#register-button {
  width: 100%;
}
</style>
