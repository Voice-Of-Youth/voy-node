const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const isAvailable = (element) => {
    return String(element).length !== 0;
}


function checkUserData(email, password) {
    return userData.readers.find(user => user.email === email && user.password === password) ? true : false
}

// signup

document.getElementById("signup-button").addEventListener("click", (e) => {
    let sPassword = document.getElementById("signup-password").value
    let sEPassword = document.getElementById("signup-e-password").value
    let sEmail= document.getElementById("signup-email").value
    let sFullName = document.getElementById("signup-fname").value
    let sDisplayName = document.getElementById("signup-dname").value
    
    if(!isAvailable(sFullName)||!isAvailable(sDisplayName)||!isAvailable(sEmail)||!isAvailable(sEPassword)||!isAvailable(sPassword)) {
        document.getElementById("signup-error").innerText = "reguired input field is empty";
    } else if(sPassword.value !== sEPassword) {
        document.getElementById("signup-error").innerText = "Passwords don't match";
    }   else if(!validateEmail(sEmail)) {
        document.getElementById("signup-error").innerText = "Enter a Valid Email";
    } else {
        e.preventDefault();
        sessionStorage.removeItem("database");
        sessionStorage.setItem("database", JSON.stringify(
            createUser(sFullName.value, sDisplayName.value, sPassword.value, sEmail.value)
        )) 
    }
})

// login

document.getElementById("signin-button").addEventListener("click", (e) => {
    let lPassword = document.getElementById("login-password").value
    let lEmail= document.getElementById("login-email").value

    const logInSession = {mail: lEmail, pass: lPassword}

    if(!isAvailable(lPassword), !isAvailable(lEmail)) {
        document.getElementById("signin-error").innerText = "reguired input field is empty";
    } else if(!validateEmail(lEmail)) {
        document.getElementById("signin-error").innerText = "Enter a Valid Email";
    } else if(!checkUserData(lEmail, lPassword)) {
        console.log(checkUserData(lEmail, lPassword))
        document.getElementById("signin-error").innerText = "No Such User Exists";
    } else {
        sessionStorage.setItem("login-session", JSON.stringify(logInSession))
        alert("Successful")
    }
})