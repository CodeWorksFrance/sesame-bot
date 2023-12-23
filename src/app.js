import Bot from "./bot.js";
import Interrupter from "./interrupter.js";

const app = () => {
  const bot = new Bot(Interrupter());
  bot.startListening();
};

export default app;
