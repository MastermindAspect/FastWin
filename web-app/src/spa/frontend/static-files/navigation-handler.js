document.addEventListener("DOMContentLoaded", function(){
	
	changeToPage(location.pathname)
	
	if(localStorage.accessToken){
		login(localStorage.accessToken, localStorage.refreshToken)
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
	
	// TODO: Avoid using this long lines of code.
	document.querySelector("#create-hub-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const name = document.querySelector("#create-hub-page .name").value
		const description = document.querySelector("#create-hub-page .description").value
		const game = document.querySelector("#create-hub-page .game").value
		
		const hub = {
			hub_name: name,
			description,
			game
		}
		
		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
			"http://localhost:3000/hubs/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				},
				body: JSON.stringify(hub)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
			// TODO: Update the view somehow.
			console.log(response)
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
		
	})
	
	document.querySelector("#login-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const username = document.querySelector("#login-page .username").value
		const password = document.querySelector("#login-page .password").value
		
		fetch(
			"http://localhost:3000/log/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: "grant_type=password&username="+username+"&password="+password
			}
			).then(function(response){
				// TODO: Check status code to see if it succeeded. Display errors if it failed.
				return response.json()
			}).then(function(body){
				// TODO: Read out information about the user account from the id_token.
				login(body.access_token, body.refresh_token)
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
	
	// TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
	// TODO: Factor out common code in all branches.
	if(url == "/"){
		document.getElementById("home-page").classList.add("current-page")
	}else if(url == "/about"){
		document.getElementById("about-page").classList.add("current-page")
	}else if(url == "/hubs/all"){
		document.getElementById("hubs-page").classList.add("current-page")
		fetchAllHubs()
	}else if(url == "/login"){
		document.getElementById("login-page").classList.add("current-page")
	}else if(new RegExp("^/hubs/[0-9]+$").test(url)){
		document.getElementById("hub-page").classList.add("current-page")
		const id = url.split("/")[2]
		fetchHub(id)
	}else if(url == "/create-hub"){
		document.getElementById("create-hub-page").classList.add("current-page")
	}else{
		document.getElementById("error-page").classList.add("current-page")
	}
	
}

function getNewAccessToken(refreshToken){
	fetch(
		"http://localhost:3000/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({"token":refreshToken, "grant_type":"refresh_token"})
	}).then(function(response){
		const data = response.json()
		return data
	}).then(function(obj){
		console.log(obj.access_token)
		localStorage.accessToken = obj.access_token
	}).catch(function(error){
		console.log(error)
	})
}

function fetchAllHubs(){
	fetch(
		"http://localhost:3000/hubs/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer "+localStorage.accessToken
		}
	}).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		const data = response.json()
		if (response.status == "200") return data
		else if (data.status == undefined) {
			//check if access token is set, if so token has probably expired
			//and now we gather a new one using the refresh token
			getNewAccessToken(localStorage.refreshToken)
			return fetchAllHubs()
		}
		else {
			console.log(data.message)
		}
	}).then(function(obj){
		const hubs = obj.allHubs
		const ul = document.querySelector("#hubs-page ul")
		ul.innerText = ""
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

function fetchHub(id){
	fetch(
		"http://localhost:3000/hubs/"+id
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		return response.json()
	}).then(function(hub){
		const nameSpan = document.querySelector("#hub-page .name")
		const idSpan = document.querySelector("#hub-page .id")
		nameSpan.innerText = hub.hubName
		idSpan.innerText = hub.id
	}).catch(function(error){
		console.log(error)
	})
	
}

function login(accessToken, refreshToken){
	localStorage.accessToken = accessToken
	localStorage.refreshToken = refreshToken
	console.log("Logged in successfully!")
	document.body.classList.remove("isLoggedOut")
	document.body.classList.add("isLoggedIn")
}

function logout(){
	localStorage.accessToken = ""
	document.body.classList.remove("isLoggedIn")
	document.body.classList.add("isLoggedOut")
}