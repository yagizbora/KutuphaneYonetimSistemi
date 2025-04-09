import axios from "axios";
import "js-loading-overlay";
import router from "../router";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

export const axiosApp = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json;charset=UTF-8",
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
  },
});

axiosApp.interceptors.request.use(
  function (config) {
    config.headers.token = localStorage.getItem("token");
    config.headers.user_id = localStorage.getItem("user_id");

    JsLoadingOverlay.show({
      spinnerIcon: "ball-atom",
      spinnerColor: "#007bff",
      spinnerSize: "2x",
    });
    return config;
  },
  function (error) {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosApp.interceptors.response.use(
  (response) => {
    JsLoadingOverlay.hide();
    return response;
  },
  (error) => {
    JsLoadingOverlay.hide();
    if (error?.response?.data === "Token Hatalı") {
      localStorage.clear();
      router.push("/auth/login");
    }

    if (error?.response.status === 401) {
      Swal.fire({
        title: "Hata!",
        text: `${error?.response?.data?.message || "Yetkisiz erişim!"}.`,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      router.push("/auth/login");
    }
    else if (error?.response.status === 429) {
      Swal.fire({
        title: "Warning!",
        text: error?.response?.data?.message,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
    else {
      if (error?.response?.data?.message) {
        Swal.fire({
          title: `Hata!`,
          text: `${error?.response?.data.message || error?.message}.`,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      } else {
        Swal.fire({
          title: `Hata!`,
          text: `${error?.response?.data || error?.message}.`,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    }

    throw error;
  }
);

export const axiosPublicApp = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json;",
  },
});

axiosPublicApp.interceptors.request.use(
  function (config) {
    JsLoadingOverlay.show({
      spinnerIcon: "ball-atom",
      spinnerColor: "#007bff",
      spinnerSize: "2x",
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosPublicApp.interceptors.response.use(
  (response) => {
    JsLoadingOverlay.hide();
    return response;
  },
  (error) => {
    JsLoadingOverlay.hide();
    Swal.fire({
      title: `Hata!`,
      text: `${error?.response?.data || error?.message}.`,
      icon: "error",
      confirmButtonText: "Tamam",
    });
    throw error;
  }
);

export const axiosFileApp = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
  },
});

axiosFileApp.interceptors.request.use(
  function (config) {
    config.headers.token = localStorage.getItem("token");
    config.headers.user_id = localStorage.getItem("user_id");
    JsLoadingOverlay.show({
      spinnerIcon: "ball-atom",
      spinnerColor: "#007bff",
      spinnerSize: "2x",
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosFileApp.interceptors.response.use(
  (response) => {
    JsLoadingOverlay.hide();
    return response;
  },
  (error) => {
    JsLoadingOverlay.hide();
    if (error.response.data == "Token Hatalı") {
      localStorage.clear();
      router.push("/auth/login");
    }
    if (error?.response.status == 401) {
      Swal.fire({
        title: "Hata!",
        text: `${error?.response?.data?.message || "Yetkisiz erişim!"}.`,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      router.push("/auth/login");
    }
    else if (error?.response.status === 429) {
      Swal.fire({
        title: "Warning!",
        text: error?.response?.data?.message,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
    else {
      if (error?.response?.data?.message) {
        Swal.fire({
          title: `Hata!`,
          text: `${error?.response?.data.message}.`,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      } else {
        Swal.fire({
          title: `Hata!`,
          text: `${error?.response?.data}.`,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    }

    throw error;
  }
);
