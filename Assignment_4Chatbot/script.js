const responses = [
  {
    keywords: ["hi", "hello", "hey"],
    answer: "Hello! Welcome to our customer support. How can I help you today?"
  },
  {
    keywords: ["order", "track"],
    answer: "To track your order, please open the My Orders section or share your Order ID."
  },
  {
    keywords: ["cancel"],
    answer: "To cancel an order, go to My Orders, select the order, and choose Cancel. Only pending orders can be cancelled."
  },
  {
    keywords: ["return"],
    answer: "You can return a product within 7 days of delivery from the My Orders section."
  },
  {
    keywords: ["refund"],
    answer: "Refunds are usually processed within 5 to 7 business days after the returned item is received."
  },
  {
    keywords: ["payment", "price"],
    answer: "We accept credit cards, debit cards, UPI, net banking, and cash on delivery."
  },
  {
    keywords: ["shipping", "delivery"],
    answer: "Standard shipping takes 5 to 7 days, while express delivery takes 2 to 3 days."
  },
  {
    keywords: ["account", "profile"],
    answer: "You can manage account details in the Profile section. Tell me what you want to update."
  },
  {
    keywords: ["password", "reset"],
    answer: "To reset your password, use the Forgot Password option on the login page."
  },
  {
    keywords: ["help"],
    answer: "I can help with orders, payments, shipping, returns, refunds, and account issues."
  },
  {
    keywords: ["thank", "thanks"],
    answer: "You are welcome. Let me know if you need anything else."
  },
  {
    keywords: ["bye", "exit", "quit"],
    answer: "Thank you for chatting with us. Have a great day!"
  }
];

const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const quickButtons = document.querySelectorAll(".quick-btn");

function getResponse(message) {
  const normalized = message.toLowerCase().trim();

  for (const rule of responses) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.answer;
    }
  }

  return "I did not fully understand that. You can ask about orders, shipping, returns, payments, refunds, or account support.";
}

function appendMessage(sender, text) {
  const message = document.createElement("article");
  message.className = `message ${sender.toLowerCase()}`;

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = sender === "Bot" ? "Bot" : "You";

  const content = document.createElement("p");
  content.textContent = text;
  content.style.margin = "0";

  message.append(label, content);
  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function handleUserMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    return;
  }

  appendMessage("User", trimmed);
  appendMessage("Bot", getResponse(trimmed));
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleUserMessage(userInput.value);
  userInput.value = "";
  userInput.focus();
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleUserMessage(button.dataset.message || "");
  });
});

appendMessage(
  "Bot",
  "Hello! I am your customer support assistant. Ask me about orders, payments, shipping, returns, refunds, or account issues."
);
