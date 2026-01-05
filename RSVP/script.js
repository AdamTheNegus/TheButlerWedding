document.getElementById("letsGo").addEventListener("click", (e) => {
  e.preventDefault();
  sendIn();
});

const errorMsg = document.getElementById("errorMsg");
const MAX_PLUS_ONES = 2;
const addOneBtn = document.getElementById("addOne");
const plusOneContainer = document.getElementById("plusOne");

addOneBtn.addEventListener("click", addPlusOne);

function showError(message, inputs = []) {
  errorMsg.textContent = message;
  inputs.forEach(input => {
    input.classList.add("input-error", "shake");
    setTimeout(() => input.classList.remove("shake"), 300);
  });
  errorMsg.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearErrors() {
  errorMsg.textContent = "";
  document.querySelectorAll(".input-error").forEach(el => {
    el.classList.remove("input-error");
  });
}

function addPlusOne() {
  clearErrors();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  if (!nameInput.value.trim() || !emailInput.value.trim()) {
    showError("Please enter both name and email before adding a plus one.", [nameInput, emailInput]);
    return;
  }

  if (plusOneContainer.children.length >= MAX_PLUS_ONES) return;

  const wrapper = document.createElement("div");
  wrapper.className = "plus-one";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Plus one name";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => {
    wrapper.remove();
    updateAddButton();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  plusOneContainer.appendChild(wrapper);

  updateAddButton();
}

function updateAddButton() {
  if (plusOneContainer.children.length >= MAX_PLUS_ONES) {
    addOneBtn.disabled = true;
    addOneBtn.style.opacity = "0.5";
  } else {
    addOneBtn.disabled = false;
    addOneBtn.style.opacity = "1";
  }
}

function sendIn() {
  clearErrors();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showError("Please enter both name and email.", [nameInput, emailInput]);
    return;
  }

  const plusOnes = Array.from(document.querySelectorAll(".plus-one input"))
    .map(input => input.value.trim())
    .filter(Boolean);

  fetch("https://script.google.com/macros/s/AKfycbxdndPgDx3vd6LgII3Ec6n2IeieOUymOrrtEF7NRcIVfEbzKSEb6Zv-uCKUZXerRE_ftg/exec", { // replace with your script URL
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, plusOnes })
  })
  .then(res => res.json()) // expect JSON from Apps Script
  .then(result => {
    if (result.status === "success") {
      showSuccess();
      nameInput.value = "";
      emailInput.value = "";
      plusOneContainer.innerHTML = "";
      updateAddButton();
    } else {
      showError(result.message || "Something went wrong. Please try again.");
    }
  })
  .catch(() => {
    showError("Something went wrong. Please try again.");
  });
}

function showSuccess() {
  document.getElementById("form").classList.add("hidden");
  document.getElementById("successMessage").classList.remove("hidden");
}





