export default class App {
    getData(url, question) {
        return fetch(url + question)
            .then((response) => response.json())
            .then((data) => data.output);
    }
    constructor() {
        const result = document.getElementById("result");
        const input = document.getElementById("question");
        const submit = document.getElementById("submit");
        if (!result || !input || !submit) {
            return;
        }
        submit.addEventListener("click", () => {
            result.innerHTML = "Loading...";
            const question = document.getElementById("question").value;
            // const url = "http://127.0.0.1:5001/hackyeahapi/us-central1/gpt?question="
            const url = "https://gpt-2tjxhojddq-uc.a.run.app?question=";
            this.getData(url, question).then((answer) => {
                result.innerHTML = answer;
            });
        });
        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                submit.click();
            }
        });
    }
}
new App();
