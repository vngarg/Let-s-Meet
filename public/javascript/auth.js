localStorage.clear();

const login = async () => {
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  const data = {
    email,
    password,
  };

  fetch("http://localhost:3000/LoginUser", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
        alert(data.data.name)
      await localStorage.setItem("name", data.data.name);
    })
    .catch((error) => {
        alert(error)
      console.log("Error", error);
    });

    const userName = localStorage.getItem("name");
    if (userName != null) return true;

  return false;
};

const register = async () => {
  const name = document.querySelector(".fullName").value;
  const contact = document.querySelector(".number").value;
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  const data = {
    name,
    contact,
    email,
    password,
  };

  fetch("http://localhost:3000/Register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      await localStorage.setItem("name", data.data.name);
    })
    .catch((error) => {
      console.log("Error", error);
    });

  const userName = localStorage.getItem("name");
  if (userName != null) return true;

  return false;
};
