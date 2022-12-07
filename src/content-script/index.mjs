import MarkdownIt from "markdown-it";
import Browser from "webextension-polyfill";

async function main(question) {
  const md = new MarkdownIt();

  const container = document.createElement("div");
  container.className = "chat-gpt-container";
  container.innerHTML = '<p class="isLoading sidebar-free">Waiting for ChatGPT response...</p>';

  const sidebarContainer = document.getElementById("b_context");
  sidebarContainer.prepend(container);

  const port = Browser.runtime.connect({ name: "chat-gpt" });
  port.onMessage.addListener((msg) => {
    if (msg.answer) {
      container.innerHTML =
        '<p class="prefix">ChatGPT:</p><div id="answer" class="markdown-body" dir="auto"></div>';
      container.querySelector("#answer").innerHTML = md.render(msg.answer);
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>';
    } else {
      container.innerHTML = "<p>Failed to load response from ChatGPT</p>";
    }
  });
  port.postMessage({ question });
}

const searchInput = document.getElementsByName("q")[0];
if (searchInput && searchInput.value) {
  main(searchInput.value);
}