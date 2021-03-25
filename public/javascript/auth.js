const login = () => {
  console.log("login");
  return false;
};

const register = () => {
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
      console.log(data.message);
      await localStorage.setItem('name', data.data.name);
    })
    .catch((error) => {
      console.log("Error", error);
    });

    console.log(localStorage.getItem('name'));
    if(localStorage.getItem('name'))
        return true;

    return false;
};
