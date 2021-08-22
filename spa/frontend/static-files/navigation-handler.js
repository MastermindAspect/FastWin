const IP = "http://localhost:";
const PORT = 3000;
document.addEventListener("DOMContentLoaded", function(){
	
	changeToPage(location.pathname)
	
	if(localStorage.accessToken){
		login(localStorage.accessToken, localStorage.idToken)
	}else{
		logout()
	}
	
	document.body.addEventListener("click", function(event){
		if(event.target.tagName == "A"){
			event.preventDefault()
			const url = event.target.getAttribute("href")
			goToPage(url)
		}
	})

	document.querySelector("#create-hub-page form").addEventListener("submit", function(event){
		event.preventDefault()
		const errorMessage = document.querySelector("#create-hub-page .errorMessage")
		const errors = document.querySelector("#create-hub-page .errors")
		const name = document.querySelector("#create-hub-page .name").value
		const description = document.querySelector("#create-hub-page .description").value
		const game = document.querySelector("#create-hub-page .game").value
		const hub = {
			hub_name: name,
			description,
			game
		}
		fetch(
			IP+PORT+"/hubs/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				},
				body: JSON.stringify(hub)
			}
		).then(function(response){
			if (response.status != 201) {
				response.json().then(function(errorObj){
					errorMessage.innerText = errorObj.message
					if (errorObj.errors){
						for (error of errorObj.errors){
							var li = document.createElement("li");
							li.appendChild(document.createTextNode(error))
							errors.appendChild(li)
						}
					}
				})
			}else{
				goToPage("/"+String(response.headers.get("Location")))
			} 
		}).catch(function(error){
			console.log(error)
		})
		
	})
	
	document.querySelector("#login-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const username = document.querySelector("#login-page .username").value
		const password = document.querySelector("#login-page .password").value
		const errorMessage = document.querySelector("#login-page .errorMessage")
		const errors = document.querySelector("#login-page .errors")
		
		fetch(
			IP+PORT+"/", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: "grant_type=password&username="+encodeURI(username)+"&password="+encodeURI(password)
			}
			).then(function(response){
				const data = response.json()
				errorMessage.innerText = "";
				errors.innerHTML = "";
				if (response.status != 200) {
					data.then(function(errorObj){
						errorMessage.innerText = errorObj.message
						if (errorObj.errors){
							for (error of errorObj.errors){
								var li = document.createElement("li");
								li.appendChild(document.createTextNode(error))
								errors.appendChild(li)
							}
						}
					})
				} 
				else return data
			}).then(function(body){
				/*const userData = jwt_decode(body.id_token);
				document.getElementById("test").innerText =*/
				login(body.access_token, body.id_token)
				goToPage("/")
		}).catch(function(error){
			console.log(error)
		})
	})


	document.querySelector("#register-page form").addEventListener("submit", function(event){
		event.preventDefault()
		const username = document.querySelector("#register-page .username").value
		const password = document.querySelector("#register-page .password").value
		const email = document.querySelector("#register-page .email").value
		const errorMessage = document.querySelector("#register-page .errorMessage")
		const errors = document.querySelector("#register-page .errors")
		const user = {
			username,password,email
		}
		console.log(user)
		
		fetch(
			IP+PORT+"/users/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: JSON.stringify(user)
			}
			).then(function(response){
				const data = response.json()
				errorMessage.innerText = ""
				errors.innerHTML = ""
				if (response.status != 201) {
					data.then(function(errorObj){
						errorMessage.innerText = errorObj.message
						if (errorObj.errors.errors){
							for (error of errorObj.errors.errors){
								var li = document.createElement("li");
								li.appendChild(document.createTextNode(error))
								errors.appendChild(li)
							}
						}
					})
				} 
				else return data
			}).then(function(body){
				console.log(body)
				goToPage("/login")
		}).catch(function(error){
			console.log(error)
		})
	})

	document.querySelector("#hubs-edit-page form").addEventListener("submit", function(event){
		event.preventDefault()
		const errorMessage = document.querySelector("#hubs-edit-page .errorMessage")
		const errors = document.querySelector("#hubs-edit-page .errors")
		const name = document.querySelector("#hubs-edit-page .name").value
		const description = document.querySelector("#hubs-edit-page .description").value
		const game = document.querySelector("#hubs-edit-page .game").value
		const hubId = parseInt(document.querySelector("#hubs-edit-page .id").innerText)
		const hub = {
			"hub_name": name,
			"description":description,
			"game":game
		}		
		fetch(
			IP+PORT+"/hubs/edit/"+hubId, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: JSON.stringify(hub)
			}).then(function(response){
				errorMessage.innerText = ""
				errors.innerHTML = ""
				if (response.status != 200) {
					response.json().then(function(errorObj){
						errorMessage.innerText = errorObj.message
						if (errorObj.errors.errors){
							for (error of errorObj.errors.errors){
								var li = document.createElement("li");
								li.appendChild(document.createTextNode(error))
								errors.appendChild(li)
							}
						}
					})
				} 
				else return goToPage("/hubs/"+hubId)
			}).catch(function(error){
				console.log(error)
		})
	})
	
	document.querySelector("#hub-page .editButton").addEventListener("click", function(event){
		event.preventDefault()
		const hubId = parseInt(document.querySelector("#hub-page .id").innerText)
		goToPage("/hubs/edit/"+hubId)
	})
	document.querySelector("#hub-page .deleteButton").addEventListener("click", function(event){
		event.preventDefault()
		const hubId = parseInt(document.querySelector("#hub-page .id").innerText)
		const errorMessage = document.querySelector("#hub-page .errorMessage")
		const errors = document.querySelector("#hub-page .errors")
		fetch(
			IP+PORT+"/hubs", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: JSON.stringify({"hubId":hubId})	
			}).then(function(response){
				errorMessage.innerText = ""
				errors.innerHTML = ""
				if (response.status != 202) {
					response.json().then(function(errorObj){
						errorMessage.innerText = errorObj.message
						if (errorObj.errors.errors){
							for (error of errorObj.errors.errors){
								var li = document.createElement("li");
								li.appendChild(document.createTextNode(error))
								errors.appendChild(li)
							}
						}
					})
				} 
				else return response.json()
			}).then(function(body){
				console.log(body)
				goToPage("/hubs/all")
		}).catch(function(error){
			console.log(error)
		})
	})

})

window.addEventListener("popstate", function(event){
	const url = location.pathname
	changeToPage(url)
})

function goToPage(url){
	changeToPage(url)
	history.pushState({}, "", url)
}

function changeToPage(url){
	
	const currentPageDiv = document.getElementsByClassName("current-page")[0]
	if(currentPageDiv){
		currentPageDiv.classList.remove("current-page")
	}

	if(url == "/"){
		document.getElementById("home-page").classList.add("current-page")
	}else if(url == "/about"){
		document.getElementById("about-page").classList.add("current-page")
	}else if(url == "/hubs/all"){
		document.getElementById("hubs-page").classList.add("current-page")
		fetchAllHubs()
	}else if(url == "/login"){
		document.getElementById("login-page").classList.add("current-page")
		
	}
	else if(url == "/logout"){
		logout();
	}
	else if(new RegExp("^/hubs/[0-9]+$").test(url)){
		document.getElementById("hub-page").classList.add("current-page")
		const id = url.split("/")[2]
		fetchHub(id, "hub-page")
	}else if(url == "/create-hub"){
		document.getElementById("create-hub-page").classList.add("current-page")
	}else if (url == "/register"){
		document.getElementById("register-page").classList.add("current-page")
	}else if (new RegExp("^/hubs/edit/[0-9]+$").test(url)){
		document.getElementById("hubs-edit-page").classList.add("current-page")
		const id = url.split("/")[3]
		fetchHub(id, "hubs-edit-page")
	}else{
		document.getElementById("error-page").classList.add("current-page")
	}
	
}

function checkAccessToken(errorObj, errorElement){
	if (localStorage.accessToken == undefined || localStorage.accessToken == null) {
		errorElement.innerText = "Please login to view this page!"
		return logout()
	}
	if (errorObj.message == "No id_token stored" || errorObj.message == "No token"){  //not logged in
		logout()
		errorElement.innerText = "Please login to view this page!"
	}
}

function fetchAllHubs(){
	const errorMessage = document.querySelector("#hubs-page .errorMessage")
	fetch(
		IP+PORT+"/hubs/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+localStorage.accessToken
		}
	}).then(function(response){
		const data = response.json()
		errorMessage.innerText = ""
		if (response.status == "200") return data
		else {
			data.then(function(errorObj){
				checkAccessToken(errorObj, errorMessage)
			})
		}
	}).then(function(obj){
		const hubs = obj.allHubs
		const ul = document.querySelector("#hubs-page ul")
		ul.innerHTML = ""
		for(const hub of hubs){
			const li = document.createElement("li")
			const anchor = document.createElement("a")
			anchor.innerText = hub.hubName
			anchor.setAttribute("href", '/hubs/'+hub.id)
			li.appendChild(anchor)
			ul.append(li)
		}
	}).catch(function(error){
		console.log(error)
	})
}

function fetchHub(id, page){
	const errorMessage = document.querySelector("#"+page+" .errorMessage")
	fetch(
		IP+PORT+"/hubs/"+id,{
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+localStorage.accessToken
		}
	}).then(function(response){
		const data = response.json()
		errorMessage.innerText = ""
		if (response.status == "200") return data
		else {
			data.then(function(errorObj){
				checkAccessToken(errorObj, errorMessage)
			})
		}
	}).then(function(obj){
		if (page == "hub-page"){
			const nameSpan = document.querySelector("#hub-page .name")
			const idSpan = document.querySelector("#hub-page .id")
			const descriptionSpan = document.querySelector("#hub-page .description")
			const gameSpan = document.querySelector("#hub-page .game")
			descriptionSpan.innerText = obj.hub.description
			gameSpan.innerText = obj.hub.game
			nameSpan.innerText = obj.hub.hubName
			idSpan.innerText = obj.hub.id
		} else if (page == "hubs-edit-page"){
			const nameSpan = document.querySelector("#hubs-edit-page .name")
			const idSpan = document.querySelector("#hubs-edit-page .id")
			const descriptionSpan = document.querySelector("#hubs-edit-page .description")
			const gameSpan = document.querySelector("#hubs-edit-page .game")
			descriptionSpan.value = obj.hub.description
			gameSpan.value = obj.hub.game
			nameSpan.value = obj.hub.hubName
			idSpan.innerText = obj.hub.id
		}
	}).catch(function(error){
		console.log(error)
	})
	
}

function login(accessToken, idToken){
	localStorage.accessToken = accessToken
	localStorage.idToken = idToken
	console.log(accessToken)
	document.body.classList.remove("isLoggedOut")
	document.body.classList.add("isLoggedIn")
	getUserInformation();
}

function logout(){
	localStorage.accessToken = ""
	document.body.classList.remove("isLoggedIn")
	document.body.classList.add("isLoggedOut")
	document.getElementsByClassName("username").innerText = "";

	goToPage("/")
}

function getUserInformation(){
	fetch(
		IP+PORT+"/users/userInfo",{
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+localStorage.idToken
		}
	}).then(function(response){
		const data = response.json()
		if (response.status == "200") return data
		else {
			data.then(function(errorObj){
				checkAccessToken(errorObj, errorMessage)
			})
		}
	}).then(function(obj){
		console.log(obj.user)
		document.getElementById("username").innerText = obj.user.nickname;
	}).catch(function(error){
		console.log(error)
	})
}