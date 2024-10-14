console.log("Loading icon script loaded")



const btn=document.querySelector(".btn")
const form=document.querySelector("form")
btn.addEventListener("click",(event)=>{
    let load=document.createElement("progress")
    document.querySelector(".btn").innerHTML=""
    btn.append(load)
})