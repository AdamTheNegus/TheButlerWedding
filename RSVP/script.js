document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // Constants & elements
  // =====================
  const errorMsg = document.getElementById("errorMsg");
  const addOneBtn = document.getElementById("addOne");
  const submitBtn = document.getElementById("letsGo");
  const plusOneContainer = document.getElementById("plusOne");

  const MAX_PLUS_ONES = 2;

  // =====================
  // Event listeners
  // =====================
  addOneBtn.addEventListener("click", addPlusOne);

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendIn();
  });

  // =====================
  // Error handling
  // =====================
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

  // =====================
  // Plus-one logic
  // =====================
  function addPlusOne() {
    clearErrors();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    if (!nameInput.value.trim() || !emailInput.value.trim()) {
      showError(
        "Please enter both name and email before adding a plus one.",
        [nameInput, emailInput]
      );
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

  // =====================
  // Submit RSVP
  // =====================
  function sendIn() {
    clearErrors();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      showError(
        "Please enter both name and email.",
        [nameInput, emailInput]
      );
      return;
    }

    const plusOnes = Array.from(
      document.querySelectorAll(".plus-one input")
    )
      .map(input => input.value.trim())
      .filter(Boolean);

    fetch("https://script.google.com/macros/s/AKfycbz2ME72entG3pt-tPxgsl_nTX-_VRQ87ohMRogR933sUJSpUko-zTKQp3SoY7i_EHgysw/exec", { // <-- Replace with your Apps Script deployment URL
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        name,
        email,
        plusOnes
      })
    })
    .then(() => {
      // Reset the form
      nameInput.value = "";
      emailInput.value = "";
      plusOneContainer.innerHTML = "";
      updateAddButton();

      // Show polished success message
      showSuccess(name, email, plusOnes);
    })
    .catch(() => {
      showError("Something went wrong. Please try again.");
    });
  }

  // =====================
  // Polished Success Screen
  // =====================
  function showSuccess(name, email, plusOnes) {
    const formDiv = document.getElementById("form");
    const successDiv = document.getElementById("successMessage");

    formDiv.classList.add("hidden");
    successDiv.classList.remove("hidden");

    // Prepare plus-ones HTML
  let plusOnesHTML = "";
  if (plusOnes && plusOnes.length > 0) {
    plusOnesHTML = `
      <div style="text-align: center; margin: 10px 0;">
        <p><strong>Plus ones:</strong></p>
        <ul style="
          list-style: none;
          padding: 0;
          margin: 0 auto;
        ">
          ${plusOnes.map(p => `<li>${p}</li>`).join("")}
        </ul>
      </div>
    `;
}

    // Build polished HTML
    successDiv.innerHTML = `
      <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: 0 auto; text-align: center;">
        <h1 style="color: #75A5EB;">Thank You${name ? ", " + name : ""}!</h1>
        <p>Your RSVP has been received.</p>
        <p>A confirmation email has been sent to <strong>${email}</strong>.</p>
        ${plusOnesHTML}
        <a href="../index.html" style="display:inline-block; margin-top: 20px; text-decoration:none; color:#fff; background-color:#75A5EB; padding:10px 20px; border-radius:5px;">Return to home page</a>
      </div>
    `;
  }

});






