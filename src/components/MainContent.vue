<template>
  <section class="container">
    <div class="form">
      <div class="form_item">
        <input
          class="form_item-input"
          min="0"
          name="price"
          type="number"
          pattern="([0-9]{1,2}).([0-9]{1})"
          v-model.number="price"
          @input="debounce(setPrice, 300)"
        />
        <label class="form_item-label" for="price">Цена: {{ price }}</label>
      </div>
      <div class="form_item">
        <input
          class="form_item-input"
          min="0"
          name="qty"
          type="number"
          pattern="([0-9]{1,2}).([0-9]{1})"
          v-model.number="qty"
          @input="debounce(setQty, 300)"
        />
        <label class="form_item-label" for="qty">Кол-во: {{ qty }}</label>
      </div>
      <div class="form_item">
        <input
          class="form_item-input"
          name="amount"
          min="0"
          type="number"
          pattern="([0-9]{1,2}).([0-9]{1})"
          v-model.number="amount"
          @input="debounce(setAmount, 300)"
        />
        <label class="form_item-label" for="amount">Сумма: {{ amount }}</label>
      </div>
      <div class="form_item">
        <button
          class="form_item-input btn"
          type="button"
          name="name"
          :disabled="isDisabled"
          @click="toSendData"
        >
          Отправить данные
        </button>
        <label for="name">localStorage: {{ result }}</label>
      </div>
      <div class="form_item">
        <button
          class="form_item-input btn"
          type="button"
          name="name"
          @click="toCleanList"
        >
          Очистить список
        </button>
      </div>
    </div>
    <div class="info">
      <ul class="info_reverse">
        <li class="info_item" v-for="(item, idx) in eventStack" :key="idx">
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
//* Реализация на localStorage, есть вариант на vuex, чтобы поменять нужно раскомментировать код в MainContent с пометкой 'vuex' */
import { sendData } from "../API/sendData";

export default {
  name: "MainContent",

  data() {
    return {
      inputType: null,
      amount: null,
      price: null,
      qty: null,

      /** vuex 
       nonce:0,
      */

      /** localStorage */
      nonce: localStorage.getItem("nonce") ? localStorage.getItem("nonce") : 0,
      /** */

      result: this.getLocalData(),
      eventStack: [],
      debouncer: null,
    };
  },
  computed: {
    /** vuex
    getNonce(){
      return this.$store.getters.getNonce
    },
    getPrice(){
      return this.$store.getters.getPrice
    },
    getQty(){
      return this.$store.getters.getQty
    },
    getAmount(){
      return this.$store.getters.getAmount
    },
    */

    isDisabled() {
      return !this.amount || !this.qty || !this.price;
    },
  },
  methods: {
    /**vuex
    getLocalData() {
      return JSON.stringify({
        nonce: this.getNonce,
        price: this.getPrice,
        qty: this.getQty,
        amount: this.getAmount,
      });
    }, 
  */

    /** localStorage */
    getLocalData() {
      return JSON.stringify({
        nonce: localStorage.getItem("nonce"),
        price: localStorage.getItem("price"),
        qty: localStorage.getItem("qty"),
        amount: localStorage.getItem("amount"),
      });
    },
    /** */

    setPrice() {
      if (!this.price) {
        this.price = null;
        this.amount = null;
        this.qty = null;
        this.eventStack.push(`обнуление цены, кол-ва и суммы`);
      } else if (this.amount && this.qty && this.price) {
        switch (this.inputType) {
          case "amount":
            this.amount = this.price * this.qty;
            this.qty = this.amount / this.price;
            this.eventStack.push(
              `изменение цены => ${this.price},изменение суммы => ${this.amount},изменение кол-ва => ${this.qty}`
            );
            break;
          case "qty":
            this.qty = this.amount / this.price;
            this.amount = this.price * this.qty;
            this.eventStack.push(
              `изменение цены => ${this.price},изменение кол-ва => ${this.qty},изменение суммы => ${this.amount}`
            );
            break;
          default:
            this.amount = this.price * this.qty;
            this.qty = this.amount / this.price;
            this.eventStack.push(
              `изменение цены => ${this.price},изменение суммы => ${this.amount},изменение кол-ва => ${this.qty}`
            );
            break;
        }
      } else if (this.qty && !this.amount && this.price) {
        this.amount = this.price * this.qty;
        this.eventStack.push(
          `изменение цены => ${this.price},изменение суммы => ${this.amount}`
        );
      } else if (!this.qty && this.amount && this.price) {
        this.qty = this.amount / this.price;
        this.eventStack.push(
          `изменение цены => ${this.price},изменение кол-ва => ${this.qty}`
        );
      }

      if (this.price && !this.qty && !this.amount) this.eventStack.push(`изменение цены => ${this.price}`);

      this.inputType = "price";
    },
    setQty() {
      if (!this.qty) {
        this.price = null;
        this.amount = null;
        this.qty = null;
        this.eventStack.push(`обнуление цены, кол-ва и суммы`);
      } else if (this.price && this.amount) {
        switch (this.inputType) {
          case "amount":
            this.amount = this.qty * this.price;
            this.price = this.amount / this.qty;
            this.eventStack.push(
              `изменение кол-ва => ${this.qty},изменение суммы => ${this.amount},изменение цены => ${this.price}`
            );
            break;
          case "price":
            this.price = this.amount / this.qty;
            this.amount = this.qty * this.price;
            this.eventStack.push(
              `изменение кол-ва => ${this.qty},изменение цены => ${this.price},изменение суммы => ${this.amount}`
            );
            break;
          default:
            this.amount = this.qty * this.price;
            this.price = this.amount / this.qty;
            this.eventStack.push(
              `изменение кол-ва => ${this.qty},изменение суммы => ${this.amount},изменение цены => ${this.price}`
            );
            break;
        }
      } else if (this.price && !this.amount && this.qty) {
        this.amount = this.price * this.qty;
        this.eventStack.push(
          `изменение кол-ва => ${this.qty},изменение суммы => ${this.amount}`
        );
      } else if (!this.price && this.amount && this.qty) {
        this.price = this.amount / this.qty;
        this.eventStack.push(
          `изменение кол-ва => ${this.qty},изменение цены => ${this.price}`
        );
      }

      if (!this.price && this.qty && !this.amount) this.eventStack.push(`изменение кол-ва => ${this.qty}`);

      this.inputType = "qty";
    },
    setAmount() {
      if (!this.amount) {
        this.price = null;
        this.amount = null;
        this.qty = null;
        this.eventStack.push(`обнуление цены, кол-ва и суммы`);
      } else if (this.price && this.qty) {
        switch (this.inputType) {
          case "price":
            this.price = this.amount / this.qty;
            this.qty = this.amount / this.price;
            this.eventStack.push(
              `изменение суммы => ${this.amount},изменение цены => ${this.price},изменение кол-ва => ${this.qty}`
            );
            break;
          case "qty":
            this.qty = this.amount / this.price;
            this.price = this.amount / this.qty;
            this.eventStack.push(
              `изменение суммы => ${this.amount},изменение кол-ва => ${this.qty},изменение цены => ${this.price}`
            );
            break;
          default:
            this.price = this.amount / this.qty;
            this.qty = this.amount / this.price;
            this.eventStack.push(
              `изменение суммы => ${this.amount},изменение цены => ${this.price},изменение кол-ва => ${this.qty}`
            );
            break;
        }
      } else if (this.price && !this.qty && this.amount) {
        this.qty = this.amount / this.price;
        this.eventStack.push(
          `изменение суммы => ${this.amount},изменение кол-ва => ${this.qty}`
        );
      } else if (!this.price && this.qty && this.amount) {
        this.price = this.amount / this.qty;
        this.eventStack.push(
          `изменение суммы => ${this.amount},изменение цены => ${this.price}`
        );
      }

      if (!this.price && !this.qty && this.amount)
        this.eventStack.push(`изменение суммы => ${this.amount}`);

      this.inputType = "amount";
    },

    toCleanList() {
      this.eventStack = [];
    },

    async toSendData() {
      const data = {
        /** vuex 
        nonce: this.$store.commit("setNonce", ++this.nonce),
        */

        /** localStorage */
        nonce: ++this.nonce,
        /** */
        price: this.price,
        qty: this.qty,
        amount: this.amount,
      };

      /** vuex 
      this.eventStack.push(
        `отправлены данные => nonce: ${this.nonce}, цена: ${this.price}, кол-во: ${this.qty}, сумма: ${this.amount} \n | данные в vuex => nonce: ${this.getNonce}, цена: ${this.getPrice}, кол-во: ${this.getQty}, сумма: ${this.getAmount}`
      );
      */

      /** localStorage */
      this.eventStack.push(
        `отправлены данные => nonce: ${this.nonce}, цена: ${
          this.price
        }, кол-во: ${this.qty}, сумма: ${
          this.amount
        } \n | данные в localStorage => nonce: ${localStorage.getItem(
          "nonce"
        )}, цена: ${localStorage.getItem(
          "price"
        )}, кол-во: ${localStorage.getItem(
          "qty"
        )}, сумма: ${localStorage.getItem("amount")}`
      );
      /** */

      /** vuex 
      await this.$store.dispatch("sendData", data).then((res) => {
        this.eventStack.push(
          `получен ответ от сервера ${JSON.stringify(
            res
          )}\n | данные в vuex => nonce: ${this.nonce}, цена: ${
            this.price
          }, кол-во: ${this.qty}, сумма: ${this.amount}`
        );
        if (res.success) {
          this.result = this.getLocalData();
        }
      });
      */

      /** localStorage */
      await sendData(data).then((res) => {
        this.eventStack.push(
          `получен ответ от сервера ${JSON.stringify(
            res
          )}\n | данные в localStorage => nonce: ${localStorage.getItem(
            "nonce"
          )}, цена: ${localStorage.getItem(
            "price"
          )}, кол-во: ${localStorage.getItem(
            "qty"
          )}, сумма: ${localStorage.getItem("amount")}`
        );
        if (res.success) {
          this.result = this.getLocalData();
        }
      });
      /** */
    },
    debounce(callback, delay = 300) {
      if (this.debouncer) {
        clearTimeout(this.debouncer);
      }
      this.debouncer = setTimeout(callback, delay);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  width: 70vw;
  margin: 0 auto;
}
.form {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}
.form_item {
  display: flex;
  flex-direction: column;
  width: 150px;
}
.form_item-input {
  margin-bottom: 10px;
}
.form_item-label {
  display: flex;
  justify-content: start;
}
.info {
  display: flex;
}
.info_reverse {
  display: flex;
  flex-direction: column-reverse;
}
.info_item {
  padding: 10px;
  margin-bottom: 10px;
  list-style: none;
  display: flex;
  justify-content: start;
  border-bottom: 1px solid black;
  width: 70vw;
}
.btn {
  cursor: pointer;
}
</style>
