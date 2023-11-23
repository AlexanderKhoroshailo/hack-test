import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    nonce: 0,
    price: null,
    qty: null,
    amount: null,
  },
  getters: {
    getNonce(state) {
      return state.nonce;
    },
    getPrice(state) {
      return state.price;
    },
    getQty(state) {
      return state.qty;
    },
    getAmount(state) {
      return state.amount;
    },
  },
  mutations: {
    setNonce(state, payload) {
      state.nonce = payload;
    },
    setPrice(state, payload) {
      state.price = payload;
    },
    setQty(state, payload) {
      state.qty = payload;
    },
    setAmount(state, payload) {
      state.amount = payload;
    },
  },
  actions: {
    sendData({ commit }, data) {
      return new Promise((res) => {
        setTimeout(() => {
          if (data.amount % 2 === 0) {
            Object.keys(data).forEach((key) => {
              commit(
                `set${key.charAt(0).toUpperCase() + key.slice(1)}`,
                data[key]
              );
            });
            res({ success: true });
          } else {
            res({ success: false });
          }
        }, 1000);
      });
    },
  },
});

export default store
