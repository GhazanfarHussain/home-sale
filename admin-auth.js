/* Home Sale Admin - client-side login gate for admin.html
   NOTE: this is a static site with no backend. This check runs entirely in the
   visitor's browser, so it only deters casual access - it is not real
   server-side security. Anyone with the page source can bypass it. */

const ADMIN_AUTH_SESSION_KEY = "homeSaleAdminAuthed";
const ADMIN_CREDENTIAL_HASH =
  "de77e808f2dc85551d3c359d8cf3a225bea0dcfde968031314b3b06334ea085a";

(function initAdminAuth() {
  const body = document.body;
  const loginScreen = document.getElementById("adminLoginScreen");
  const loginForm = document.getElementById("adminLoginForm");
  const loginError = document.getElementById("adminLoginError");
  const userInput = document.getElementById("admin_user");
  const passInput = document.getElementById("admin_pass");

  if (isAuthed()) {
    unlock();
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = userInput.value.trim();
    const pass = passInput.value;
    const hash = await sha256Hex(user + ":" + pass);
    if (hash === ADMIN_CREDENTIAL_HASH) {
      try {
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, "1");
      } catch (err) {
        /* sessionStorage may be unavailable; auth still applies for this load */
      }
      loginError.classList.add("hidden");
      unlock();
    } else {
      loginError.classList.remove("hidden");
      passInput.value = "";
      passInput.focus();
    }
  });

  function isAuthed() {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function unlock() {
    body.classList.remove("admin-locked");
    if (loginScreen) loginScreen.remove();
    document.dispatchEvent(new CustomEvent("admin-auth-ready"));
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
})();
