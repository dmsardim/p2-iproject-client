import { defineStore } from "pinia";
import axios from "axios";
import Toast from "awesome-toast-component";

export const useCustomerStore = defineStore("customers", {
  state: () => ({
    baseUrl: "http://localhost:3000",
    isLogin: false,
  }),
  getters: {},
  actions: {
    success(msg) {
      new Toast(`${msg}`, {
        position: "top",
        style: {
          container: [["background-color", "green"]],
          message: [["color", "#eee"]],
          bold: [["font-weight", "bold"]],
        },
      });
    },
    error(err) {
      new Toast(`${err}`, {
        position: "top",
        style: {
          container: [["background-color", "red"]],
          message: [["color", "#eee"]],
          bold: [["font-weight", "bold"]],
        },
      });
    },

    async register(value) {
      try {
        const { data } = await axios({
          url: this.baseUrl + "/customers/register",
          method: "POST",
          data: {
            name: value.name,
            email: value.email,
            password: value.password,
          },
        });
        this.success("Success Register");
        this.router.push("/login");
      } catch (err) {
        console.log(err);
        this.error(err.response.data.message);
      }
    },
    async login(value) {
      try {
        const { data } = await axios({
          url: this.baseUrl + "/customers/login",
          method: "POST",
          data: {
            email: value.email,
            password: value.password,
          },
        });
        console.log(data);
        localStorage.access_token = data.access_token;
        localStorage.idCustomer = data.id;
        localStorage.name = data.name;
        this.isLogin = true;
        this.success(`Welcome, ${data.email}!`);
        this.router.push("/");
      } catch (err) {
        console.log(err);
        this.error(err.response.data.message);
      }
    },

    // //* login with google
    async handleCredentialResponse(response) {
      try {
        const { data } = await axios({
          url: this.baseUrl + "/customers/google-sign-in",
          method: "POST",
          headers: {
            "google-auth-token": response.credential,
          },
        });
        localStorage.access_token = data.access_token;
        localStorage.idCustomer = data.id;
        localStorage.name = data.name;
        this.isLogin = true;
        this.success(`Welcome, ${data.email}!`);
        this.router.push("/");
      } catch (err) {
        console.log(err);
        this.error(err.response.data.message);
      }
    },

    async logout() {
      localStorage.clear();
      this.success("Success Logout");
      this.router.push("/");
    },
  },
});