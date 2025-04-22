import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {jwtDecode} from "jwt-decode";


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
