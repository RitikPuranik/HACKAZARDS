const container = document.getElementById("container");
const switchToSignUp = document.getElementById("switchToSignUp");
const switchToSignIn = document.getElementById("switchToSignIn");

switchToSignUp.addEventListener("click", () => {
  container.classList.add("show-signup");
});

switchToSignIn.addEventListener("click", () => {
  container.classList.remove("show-signup");
});

