import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: "https://clubero-api-server.vercel.app/api/v1",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
