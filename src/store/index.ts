import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    displayLoginForm: false,
    displaySignUpForm: false,
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
  },
  getters: {},
  modules: {},
});
