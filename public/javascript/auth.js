localStorage.clear();
const loginForm = document.querySelector('#loginForm')

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const login = async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  const data = {
    email,
    password,
  };

  fetch("https://lets-meet-sg.herokuapp.com/LoginUser", {
    method: "POST",
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      await localStorage.setItem("name", data.data.name);
      window.location.replace(`https://lets-meet-sg.herokuapp.com/${uuidv4()}`)
    })
    .catch((error) => {
      const showError = document.querySelector(".error");
      // clear the div for any error(if present)
      while (showError.firstChild) showError.firstChild.remove();

      const div = document.createElement("div");
      div.classList.add("alert");
      div.classList.add("alert-danger");
      div.innerText = "Invalid credentials.";
      showError.appendChild(div);

      console.log("Error", error);
    });
};

loginForm.addEventListener("submit", login);