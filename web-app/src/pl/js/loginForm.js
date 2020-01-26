document.addEventListener('DOMContentLoaded', (event) => {
    let loginForm = document.getElementById("loginForm")
    let createAccountForm = document.getElementById("createAccountForm")
    let changeFormText = document.getElementById("changeFormText")
    let changeFormButton = document.getElementById("changeFormButton")
    createAccountForm.style.display = "None"
    changeFormButton.addEventListener("click", function(event) {
        if (changeFormButton.innerText == "Create Account") {
            changeFormButton.innerText = "Log in"
            changeFormText.innerText = "Already have an account?"
            createAccountForm.style.display = ""
            loginForm.style.display = "None"
            
        } else {
            changeFormButton.innerText = "Create Account"
            changeFormText.innerText = "Don't have a account?"
            createAccountForm.style.display = "None"
            loginForm.style.display = ""
        }
    })

    function getAlertObject() {
        alertObj = document.createElement("div")
        alertObj.className = "alert alert-danger"
        alertObj.role = "alert"
        alertObj.style.display = "None"
        return alertObj
    }

    let errorPlacements = []
    errorPlacements.push(document.getElementById("usernamePlacement"))
    errorPlacements.push(document.getElementById("emailPlacement"))
    errorPlacements.push(document.getElementById("password1Placement"))
    errorPlacements.push(document.getElementById("password2Placement"))

    for (let i = 0; i < errorPlacements.length; i++) {
        var alert = getAlertObject()
        errorPlacements[i].appendChild(alert)
    }

    createAccountForm.addEventListener("submit", function(event) {
        let currentErrors = document.getElementsByClassName("alert alert-danger")
        console.log(currentErrors.length)
        for (let i = 0; i < currentErrors.length; i++) {
            console.log(currentErrors[i])
            currentErrors[i].innerText = ""
            currentErrors[i].style.display = "None"
        }
        console.log("hejsan")
        let username = document.getElementById("username")
        let email = document.getElementById("email")
        let password = document.getElementById("password1")
        let validationPassword = document.getElementById("password2")
        let errors = 0;
        if (username.value == "") {
            currentErrors[0].innerText = "You need to have a username"
            currentErrors[0].style.display = ""
            errors++
        }
        
        if (email.value == "") {
            currentErrors[1].innerText = "You need to enter a email"
            currentErrors[1].style.display = ""
            errors++
        } else if (!email.value.includes('@')) {
            currentErrors[1].innerText = "This is not a valid email"
            currentErrors[1].style.display = ""
            errors++
        }
        if (password.value == "" || password.value.length < 5) {
            currentErrors[2].innerText = "The password needs to contain 5 characters"
            currentErrors[2].style.display = ""
            errors++
        }
        if (password.value != validationPassword.value) {
            currentErrors[3].innerText = "The passwords does not match"
            currentErrors[3].style.display = ""
            errors++
        }
        if (errors > 0) {
            event.preventDefault()
        }
    })


})