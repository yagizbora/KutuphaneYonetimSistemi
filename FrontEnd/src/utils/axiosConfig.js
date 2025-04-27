/* eslint no-undef: "off" */
/* eslint-disable no-console */
import axios from 'axios';
import Swal from "sweetalert2";
import 'js-loading-overlay';




const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:44336/api';
if (!API_URL) {
  console.error('API URL is not configured properly!');
}

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json;charset=UTF-8",
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
  },
});

instance.interceptors.request.use(
  function (config) {

    JsLoadingOverlay.show({
      color: 'rgba(0, 0, 0, 0.6)',
      imageColor: '#ffffff',
      customSpinner: true,
    });

    config.headers.token = localStorage.getItem("token");
    config.headers.user_id = localStorage.getItem("user_id");
    return config;
  },
  function (error) {
    console.error("Request error:", error);
    JsLoadingOverlay.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    JsLoadingOverlay.hide();
    return response;
  },
  (error) => {
    JsLoadingOverlay.hide();
    if (error?.response?.data === "Token Hatalı") {
      localStorage.clear();
      window.location.replace('/login');
    }

    if (error?.response?.status === 401) {
      localStorage.clear();
      Swal.fire({
        title: "Hata!",
        text: `${error?.response?.data?.message || "Yetkisiz erişim!"}.`,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      window.location.replace('/login');
    }
    else if (error?.response?.status === 429) {
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

    return Promise.reject(error);
  }
);

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json;",
  },
});

axiosPublic.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosPublic.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    Swal.fire({
      title: `Hata!`,
      text: `${error?.response?.data || error?.message}.`,
      icon: "error",
      confirmButtonText: "Tamam",
    });
    return Promise.reject(error);
  }
);

export const axiosFile = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
  },
});

axiosFile.interceptors.request.use(
  function (config) {
    config.headers.token = localStorage.getItem("token");
    config.headers.user_id = localStorage.getItem("user_id");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosFile.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.data === "Token Hatalı") {
      localStorage.clear();
      window.location.replace('/login');
    }
    if (error?.response?.status === 401) {
      localStorage.clear();
      Swal.fire({
        title: "Hata!",
        text: `${error?.response?.data?.message || "Yetkisiz erişim!"}.`,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      window.location.replace('/login');
    }
    else if (error?.response?.status === 429) {
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
    return Promise.reject(error);
  }
);

export default instance;
