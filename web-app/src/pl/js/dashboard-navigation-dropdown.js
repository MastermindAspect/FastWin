
document.addEventListener("DOMContentLoaded", function(){
    let links = document.getElementsByClassName("dashboardItemHeader")
    let dropdowns = document.getElementsByClassName("dropdown")
    for (let i = 0; i<links.length; i++){
        dropdowns[i].classList.toggle("dropdownDisable")
        links[i].addEventListener("click", function(){
            links[i].firstElementChild.classList.toggle("arrow")
            links[i].firstElementChild.classList.toggle("defaultarrow")
            dropdowns[i].classList.toggle("dropdownDisable")
        })
    }
})
