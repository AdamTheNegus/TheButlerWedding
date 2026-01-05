document.getElementById("letsGo").addEventListener("click", (e) => {
	e.preventDefault();
  sendIn();
});
// document.getElementById("addOne").addEventListener("click", addNew);

const errorMsg = document.getElementById("errorMsg");



function showError(message, inputs = []) {
	errorMsg.textContent = message;

	inputs.forEach(input => {
		input.classList.add("input-error", "shake");

		// Remove shake so it can trigger again later
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



const MAX_PLUS_ONES = 2;

const addOneBtn = document.getElementById("addOne");
const plusOneContainer = document.getElementById("plusOne");

addOneBtn.addEventListener("click", addPlusOne);




function addPlusOne() {
	clearErrors();

	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");

	const name = nameInput.value.trim();
	const email = emailInput.value.trim();

	if (name === "" || email === "") {
		showError(
			"Please enter both name and email before adding a plus one.",
			[nameInput, emailInput]
		);
		return;
	}

	const currentCount = plusOneContainer.children.length;

	if (currentCount >= MAX_PLUS_ONES) return;

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

function sendIn(){
	clearErrors();

	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();

		if (name === "" || email === "") {
		showError(
			"Please enter both name and email.",
			[nameInput, emailInput]
		);
		return;
	}

// collect plus ones
	const plusOnes = Array.from(
		document.querySelectorAll(".plus-one input")
	).map(input => input.value.trim()).filter(Boolean);

	fetch("https://script.google.com/macros/s/AKfycbxOOg_X3YWbSUdCNwDuaEsQsnZaqvmiZLf2o4jA-GQERwcEMB6kiSRtvVYoxLQPliEotA/exec", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
			plusOnes
		})
	})
	.then(res => res.text())
	.then(() => {
		showSuccess();

		// reset form
		nameInput.value = "";
		emailInput.value = "";
		document.getElementById("plusOne").innerHTML = "";
		updateAddButton();
	})
	.catch(() => {
		showError("Something went wrong. Please try again.");
	});
}

function showSuccess() {
  document.getElementById("form").classList.add("hidden");
  document.getElementById("successMessage").classList.remove("hidden");
}



