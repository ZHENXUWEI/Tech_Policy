import Cookies from "js-cookie";

const KEY = "UserInfo";

export function getCookie() {
  if (Cookies.get(KEY)) {
    return JSON.parse(Cookies.get(KEY));
  }
}

export function setCookie(value) {
  Cookies.set(KEY, JSON.stringify(value));
}

export function removeCookie() {
  Cookies.remove(KEY);
}

export function setKeyWordCookie(value) {
  Cookies.set("KW", value);
}

export function getKeyWordCookie() {
  if (Cookies.get("KW")) {
    return Cookies.get("KW");
  }
}

export function removeKeyWordCookie() {
  Cookies.remove("KW");
}

export function setCategoryCookie(value) {
  Cookies.set("Category", value);
}

export function getCategoryCookie() {
  if (Cookies.get("Category")) {
    return Cookies.get("Category");
  }
}

export function removeCategoryCookie() {
  Cookies.remove("Category");
}
export function setTabCookie(value) {
  Cookies.set("Tab", value);
}

export function getTabCookie() {
  if (Cookies.get("Tab")) {
    return Cookies.get("Tab");
  }
}
export function removeTabCookie() {
  Cookies.remove("Tab");
}