
document.addEventListener("DOMContentLoaded", function(){
    console.log("html loaded")
    let links = document.getElementsByClassName("dashboardItemHeader")
    console.log(links)
    let dropdowns = document.getElementsByClassName("dropdown")
    console.log(dropdowns)
    for (let i = 0; i<links.length; i++){
        links[i].addEventListener("click", function(){
            console.log(i)
            dropdowns[i].classList.toggle("dropdownDisable")
        })
    }
})
