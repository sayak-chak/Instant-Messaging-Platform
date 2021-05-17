<template>
  <div>
    <v-card outlined>
      <textarea
        class="scrollabletextbox"
        type="text"
        id="chat-messages"
        disabled
      />
      <br />
    </v-card>
    <span>
      <textarea type="text" id="msg" />
    </span>
    <button @click="send()">Send</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  components: {},
})
export default class MessagingPortal extends Vue {
  websocket!: WebSocket;
  outgoingChatMsg!: string;

  callChattingApi(): void {
    console.log("Opening connection");
    this.websocket = new WebSocket("ws://" + "localhost:3000" + "/chat");
    this.websocket.addEventListener("message", function (incomingChat) {
      let incomingChatMsgAndUsername = JSON.parse(incomingChat.data);
      console.log(incomingChatMsgAndUsername);
      (document.getElementById("chat-messages") as HTMLInputElement).value +=
        incomingChatMsgAndUsername.username +
        " : " +
        incomingChatMsgAndUsername.message +
        "\n";
    });
  }

  send(): void {
    if (this.websocket == undefined || this.websocket.readyState != 1) {
      //is not open
      this.callChattingApi();
      this.websocket.onopen = this.sendMessageAndUsernameViaWebSocket;
      return;
    }
    this.sendMessageAndUsernameViaWebSocket();
  }

  sendMessageAndUsernameViaWebSocket(): void {
    this.outgoingChatMsg = (
      document.getElementById("msg") as HTMLInputElement
    ).value;
    if (this.outgoingChatMsg != "") {
      this.websocket.send(
        JSON.stringify({
          username: this.$store.state.username,
          message: this.outgoingChatMsg,
        })
      );
      this.outgoingChatMsg = "";
    }
    (document.getElementById("msg") as HTMLInputElement).value = ""; //Resetting
  }
}
</script>

<style scoped>
.scrollabletextbox {
  height: 100px;
  width: 200px;
  font-family: Verdana, Tahoma, Arial, Helvetica, sans-serif;
  font-size: 82%;
  overflow: scroll;
}
</style>
