import bcrypt from "bcryptjs";
import { getCookie, setCookie } from "./cookies";
import { type NavigateFunction } from "react-router-dom";

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function loginUser(userName: string, navigate: NavigateFunction) {
  setCookie("loggedInUserName", userName);
  navigate("/users");
}

export function logoutUser(navigate: NavigateFunction) {
  setCookie("loggedInUserName", "", -1);
  navigate("/");
}

export function isLoggedIn(): boolean {
  return !!getCookie("loggedInUserName");
}
