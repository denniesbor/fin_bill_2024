import openai
import os


from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

openai.api_key = os.getenv("api_key_secret")


class ChatBot:
    def __init__(self, system=""):
        self.system = system
        self.messages = []
        if self.system:
            self.messages.append({"role": "system", "content": system})

    def __call__(self, message):
        self.messages.append({"role": "user", "content": message})
        result = self.execute()
        self.messages.append({"role": "assistant", "content": result})
        return result

    def execute(self):
        completion = openai.chat.completions.create(
            model="gpt-4", messages=self.messages
        )

        return completion.choices[0].message.content