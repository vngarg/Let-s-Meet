const login = () => {
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    if(email == 'shlok@gordian.in' && password == '123456')
        return true;
    
    return false;
}