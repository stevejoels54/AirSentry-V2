import log from "@config/winston";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatBot {
  chatBot: OpenAIApi;
  chatModel: string;

  constructor(model: string) {
    this.chatBot = new OpenAIApi(configuration);
    this.chatModel = model;
  }

  async chatCompletion(prompt: ChatCompletionRequestMessage[]) {
    log.info("ChatBot: chatCompletion");
    const response = await this.chatBot.createChatCompletion({
      model: this.chatModel,
      messages: prompt,
    });

    log.info("ChatBot: chatCompletion: response");

    return response.data.choices[0].message;
  }
}

export default ChatBot;
