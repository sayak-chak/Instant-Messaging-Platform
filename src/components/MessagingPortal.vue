<template>
  <div>
    <v-container>
      <v-row>
        <v-app-bar v-if="this.$vuetify.breakpoint.xsOnly">
          <v-icon
            elevation="0"
            large
            @click="showContactList()"
            color="green darken-2"
          >
            mdi-menu
          </v-icon>
        </v-app-bar>
        <!-- TODO: hacky spacing workaround, maybe fix -->
        <v-col
          v-if="
            this.$vuetify.breakpoint.xsOnly &&
            !this.$store.state.loadContactList
          "
          cols="0"
          xs="0"
          sm="1"
          class="line"
        ></v-col>
        <v-col
          v-if="
            (this.$vuetify.breakpoint.xsOnly &&
              !this.$store.state.loadContactList) |
              !this.$vuetify.breakpoint.xsOnly
          "
          cols="12"
          xs="12"
          sm="6"
          class="occupy-full-page full-page-border"
        >
          <v-row>
            <v-col
              cols="12"
              style="height: 90vh; background-color: transparent !important"
            >
              <v-list
                color="transparent"
                class="overflow-y-auto"
                style="max-height: 90vh"
              >
                <v-card-title>{{
                  this.$store.state.currentChatter
                }}</v-card-title>
                <v-divider color="black" />
                <v-list-item
                  color="transparent"
                  v-for="conversation in this.$store.state.chatMessages"
                  :key="conversation"
                >
                  <v-card class="chat-message" outlined width="100vh">
                    <v-card-subtitle>{{ conversation.sender }}</v-card-subtitle>
                    <v-divider height="85px" />
                    <v-card-text>{{ conversation.message }}</v-card-text>
                  </v-card>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    @keyup.enter="send()"
                    type="text"
                    placeholder="Send Message.."
                    id="msg"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="4" justify="center" align="center">
                  <v-icon
                    elevation="0"
                    large
                    @click="send()"
                    color="green darken-2"
                    id="button"
                  >
                    mdi-send
                  </v-icon>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="0" xs="0" sm="1" class="line"></v-col>
        <v-col
          cols="12"
          xs="12"
          sm="5"
          class="occupy-full-page full-page-border"
          v-if="
            (this.$vuetify.breakpoint.xsOnly &&
              this.$store.state.loadContactList) |
              !this.$vuetify.breakpoint.xsOnly
          "
        >
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    @keyup.enter="searchUser()"
                    type="text"
                    placeholder="Search User.."
                    id="usernameToMessage"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="4" justify="center" align="center">
                  <v-icon
                    elevation="0"
                    large
                    @click="searchUser()"
                    color="green darken-2"
                    id="button"
                  >
                    mdi-send
                  </v-icon>
                </v-col>
              </v-row>
              <v-divider />
            </v-col>

            <v-col cols="12" id="chat-list">
              <v-list
                color="transparent"
                class="overflow-y-auto"
                style="max-height: 80vh"
              >
                <v-list-item
                  v-for="chatter in this.$store.state.chatList"
                  :key="chatter"
                >
                  <v-card
                    outlined
                    class="
                      transition-fast-in-fast-out
                      v-card--reveal
                      item-in-chatlist
                    "
                    style="height: 100%; width: 100vh"
                    @click="hideContactList()"
                  >
                    <v-card-text
                      class="pb-0"
                      @click="updateActiveChat(chatter)"
                    >
                      <p class="display-1 text--primary">{{ chatter }}</p>
                    </v-card-text>
                  </v-card>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
// import MessagingInterface from "./../components/MessagingInterface.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import config from "./../../config.json";

@Component({
  components: {
    // MessagingInterface,
  },
})
export default class MessagingPortal extends Vue {
  @Prop({ required: true }) websocket!: WebSocket;
  // websocket!: WebSocket;
  outgoingChatMsg!: string;
  currentChatter!: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      currentChatter: this.currentChatter,
      menu: ["a", "f"],
    };
  }

  send(): void {
    this.sendChatRequest();
  }

  sendChatRequest(): void {
    this.outgoingChatMsg = (
      document.getElementById("msg") as HTMLInputElement
    ).value;
    if (this.outgoingChatMsg != "") {
      this.websocket.send(
        JSON.stringify({
          target: this.$store.state.currentChatter,
          sender: this.$store.state.username,
          message: this.outgoingChatMsg,
        })
      );
      this.outgoingChatMsg = "";
    }
    (document.getElementById("msg") as HTMLInputElement).value = ""; //Resetting
  }

  searchUser(): void {
    let usernameToSearch = (
      document.getElementById("usernameToMessage") as HTMLInputElement
    ).value;
    this.$http
      .get(config.API_HTTPS + "/search" + "?username=" + usernameToSearch, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: true,
      })
      .then(
        (response) => {
          this.$store.commit("addToChatList", usernameToSearch);
          this.$store.commit("updateCurrentChatter", usernameToSearch);
          this.$store.commit("resetChatMessages", usernameToSearch);
          this.$http
            .get(
              config.API_HTTPS +
                "/history?username=" +
                this.$store.state.username +
                "&sender=" +
                this.$store.state.currentChatter
            )
            .then(
              (response) => {
                this.$store.commit(
                  "appendMessages",
                  response.data.senderAndMessages
                );
              },
              (error) => console.log(error) //TODO: handle sad paths
            );
        },
        (error) => console.log(error)
      );
  }

  updateActiveChat(newChatter: string): void {
    this.$store.commit("updateCurrentChatter", newChatter);
    this.$store.commit("resetChatMessages", newChatter);
    this.$http
      .get(
        config.API_HTTPS +
          "/history?username=" +
          this.$store.state.username +
          "&sender=" +
          this.$store.state.currentChatter
      )
      .then(
        (response) => {
          this.$store.commit("appendMessages", response.data.senderAndMessages);
        },
        (error) => console.log(error) //TODO: handle sad paths
      );
  }

  showContactList(): void {
    this.$store.commit("showContactList");
  }

  hideContactList(): void {
    this.$store.commit("hideContactList");
  }
}
</script>

<style scoped>
#chat-list {
  padding-left: 10%;
  padding-right: 10%;
}
#button {
  font-size: 55px !important;
  box-shadow: none !important;
  float: right !important;
}
.v-card__title {
  color: black;
}
.v-icon.v-icon::after {
  background-color: transparent !important;
}
.scrollabletextbox {
  height: 100px;
  width: 200px;
  font-family: Verdana, Tahoma, Arial, Helvetica, sans-serif;
  font-size: 82%;
  overflow: scroll;
}
.occupy-full-page {
  height: 100vh;
}
.full-page-border {
  border: 2px solid red;
}
.line {
  height: 100%;
  color: black;
}
.item-in-chatlist {
  background-color: rgb(233, 219, 219);
  margin-top: 5px;
  margin-bottom: 5px;
}
.theme--dark.v-subheader {
  font-size: 56;
  /* color: black; */
}
.chat-message {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
