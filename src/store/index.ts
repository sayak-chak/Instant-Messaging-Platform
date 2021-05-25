import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    displayLoginForm: false,
    displaySignUpForm: false,
    displayChattingPortal: false,
    username: "",
    chatList: ["Group"],
    currentChatter: "Group",
    chatMessages: [] as Record<string, string>[],
    loadContactList: false,
  },
  mutations: {
    loginUser(state) {
      state.isLoggedIn = true;
    },
    logoutUser(state) {
      state.isLoggedIn = false;
    },
    showLoginForm(state) {
      state.displayLoginForm = true;
    },
    hideLoginForm(state) {
      state.displayLoginForm = false;
    },
    showSignUpForm(state) {
      state.displaySignUpForm = true;
    },
    hideSignUpForm(state) {
      state.displaySignUpForm = false;
    },
    loadChattingPortal(state) {
      state.displayChattingPortal = true;
    },
    setUsername(state, loggedInUsername) {
      //TODO: refactor to cookie/auth token system
      state.username = loggedInUsername;
    },
    addToChatList(state, newUser: string) {
      for (let index = 0; index < state.chatList.length; index++) {
        if (state.chatList[index] == newUser) {
          return;
        }
      }

      state.chatList.push(newUser);
    },

    updateCurrentChatter(state, newChatter: string) {
      if (state.currentChatter !== newChatter) {
        state.currentChatter = newChatter;
      }
    },

    resetChatMessages(state) {
      state.chatMessages = [];
    },

    appendMessage(state, newSenderAndMessage: Record<string, string>) {
      state.chatMessages.push(newSenderAndMessage);
    },
    appendMessages(state, newSenderAndMessages: Record<string, string>[]) {
      for (let index = 0; index < newSenderAndMessages.length; index++) {
        state.chatMessages.push(newSenderAndMessages[index]);
      }
    },

    showContactList(state) {
      state.loadContactList = true;
    },

    hideContactList(state) {
      state.loadContactList = false;
    },
  },
  getters: {},
  modules: {},
});
