import axios from "axios";
import { initialize } from "./react-query";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});
export const reactQuery = initialize(http);