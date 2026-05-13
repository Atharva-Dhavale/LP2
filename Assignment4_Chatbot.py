# Assignment 4: Elementary Chatbot for Customer Interaction
# Develop an elementary Chatbot for any suitable customer interaction
# application (Rule based & GUI Based)

import tkinter as tk
from tkinter import scrolledtext

# --- Rule-Based Response System ---
def get_response(user_input):
    user_input = user_input.lower().strip()
    
    responses = {
        # Greetings
        "hi": "Hello! Welcome to our customer support. How can I help you?",
        "hello": "Hi there! How can I assist you today?",
        "hey": "Hey! Welcome. What can I do for you?",
        
        # Order related
        "order": "To track your order, please visit 'My Orders' section or share your Order ID.",
        "track": "You can track your order using the tracking link sent to your email.",
        "cancel": "To cancel an order, go to 'My Orders' > Select order > Click 'Cancel'. Note: Only pending orders can be cancelled.",
        "return": "You can return a product within 7 days of delivery. Go to 'My Orders' > 'Return Item'.",
        "refund": "Refunds are processed within 5-7 business days after we receive the returned item.",
        
        # Payment
        "payment": "We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery.",
        "price": "Please check the product page for current pricing and offers.",
        
        # Shipping
        "shipping": "Standard shipping takes 5-7 days. Express shipping takes 2-3 days.",
        "delivery": "Delivery typically takes 5-7 business days depending on your location.",
        
        # Account
        "account": "You can manage your account in the 'Profile' section. Need help with something specific?",
        "password": "To reset your password, click 'Forgot Password' on the login page.",
        
        # General
        "help": "I can help you with: Orders, Payments, Shipping, Returns, Account issues. What do you need?",
        "thank": "You're welcome! Is there anything else I can help with?",
        "thanks": "You're welcome! Have a great day!",
        "bye": "Goodbye! Thank you for contacting us. Have a nice day!",
        "quit": "Thank you for chatting with us. Goodbye!",
    }
    
    # Check if any keyword matches
    for keyword, response in responses.items():
        if keyword in user_input:
            return response
    
    return "I'm sorry, I didn't understand that. You can ask about: orders, payments, shipping, returns, or account issues."

# ========== GUI VERSION (Tkinter) ==========
class ChatbotGUI:
    def __init__(self, root):
        root.title("Customer Support Chatbot")
        root.geometry("500x600")
        root.configure(bg="#2c3e50")
        
        # Title
        title = tk.Label(root, text="🤖 Customer Support Bot", font=("Arial", 16, "bold"),
                        bg="#2c3e50", fg="white")
        title.pack(pady=10)
        
        # Chat display area
        self.chat_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, width=55, height=25,
                                                    font=("Arial", 11), state='disabled',
                                                    bg="#ecf0f1", fg="#2c3e50")
        self.chat_area.pack(padx=10, pady=5)
        
        # Input frame
        input_frame = tk.Frame(root, bg="#2c3e50")
        input_frame.pack(pady=10, padx=10, fill=tk.X)
        
        self.entry = tk.Entry(input_frame, font=("Arial", 12), width=35)
        self.entry.pack(side=tk.LEFT, padx=(0, 10), expand=True, fill=tk.X)
        self.entry.bind("<Return>", self.send_message)
        
        send_btn = tk.Button(input_frame, text="Send", command=self.send_message,
                            font=("Arial", 11, "bold"), bg="#27ae60", fg="white",
                            padx=15, pady=5)
        send_btn.pack(side=tk.RIGHT)
        
        # Welcome message
        self.display_message("Bot", "Hello! Welcome to Customer Support.\nHow can I help you today?\n(Ask about: orders, payments, shipping, returns)")
    
    def send_message(self, event=None):
        user_msg = self.entry.get().strip()
        if not user_msg:
            return
        
        self.display_message("You", user_msg)
        self.entry.delete(0, tk.END)
        
        # Get bot response
        response = get_response(user_msg)
        self.display_message("Bot", response)
    
    def display_message(self, sender, message):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, f"{sender}: {message}\n\n")
        self.chat_area.config(state='disabled')
        self.chat_area.see(tk.END)

# ========== CONSOLE VERSION ==========
def console_chatbot():
    print("=" * 50)
    print("  Customer Support Chatbot (Console Version)")
    print("=" * 50)
    print("Bot: Hello! How can I help you today?")
    print("     (Type 'quit' to exit)\n")
    
    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Bot: Goodbye! Have a nice day!")
            break
        response = get_response(user_input)
        print(f"Bot: {response}\n")

# --- Main ---
if __name__ == "__main__":
    print("Choose mode:")
    print("1. GUI Chatbot (Tkinter)")
    print("2. Console Chatbot")
    choice = input("Enter choice (1/2): ").strip()
    
    if choice == "1":
        root = tk.Tk()
        app = ChatbotGUI(root)
        root.mainloop()
    else:
        console_chatbot()
