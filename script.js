const chatinput = document.querySelector(".chat-input textarea");
const sendchatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbottoggler = document.querySelector(".chatbot-toggler")
const chatbotclosebtn = document.querySelector(".close-btn")

let usermessage;
const API_KEY = "AIzaSyDGqBG0pdiDNe_kB3u9ITbMVqOr8Jk33Dw";

const createchatli = (message, classname) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", classname);
    let chatcontent = classname === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-rounded">smart_toy</span><p>${message}</p>`
    chatli.innerHTML = chatcontent;
    return chatli;
}

const generateresponse = (incomingchatli) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingchatli.querySelector("p");


    const requestoptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: usermessage }]
            }]
        }),
    };

    fetch(API_URL, requestoptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oopsies! Samajh nhi aaya. Dubara bolo.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}
const handlechat = () => {
    usermessage = chatinput.value.trim();
    if (!usermessage) return;
    chatinput.value = "";

    chatbox.appendChild(createchatli(usermessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingchatli = createchatli("ruko sochne do...", "incoming")
        chatbox.appendChild(incomingchatli);
        chatbox.scrollTo(0, chatbox.scrollHeight);


        generateresponse(incomingchatli);
    }, 300);
}



chatbottoggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotclosebtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendchatbtn.addEventListener("click", handlechat);
chatinput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (event.shiftKey) {
            event.preventDefault();
            const cursorPosition = chatinput.selectionStart;
            chatinput.value = chatinput.value.substring(0, cursorPosition) + "\n" + chatinput.value.substring(cursorPosition);
            chatinput.selectionStart = chatinput.selectionEnd = cursorPosition + 1;
        } else {
            event.preventDefault();
            handlechat();
        }
    }
});