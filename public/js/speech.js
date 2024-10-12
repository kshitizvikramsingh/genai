console.log("speech script loaded")


let speech=document.querySelector("#speech")
let lang=document.querySelector("#lang").textContent
let data=speech.textContent


console.log(lang)

const msg=new SpeechSynthesisUtterance(data)
console.log(data)
switch(lang) {
    case "Hindi":
        msg.lang = "hi-IN";
        break;
    case "Chinese":
        msg.lang = "zh-CN";
        break;
    case "Japanese":
        msg.lang = "ja-JP";
        break;
    case "Italian":
        msg.lang = "it-IT";
        break;
    case "French":
        msg.lang = "fr-FR";
        break;
    default:
        msg.lang = "en-US";
}

speechSynthesis.speak(msg)
