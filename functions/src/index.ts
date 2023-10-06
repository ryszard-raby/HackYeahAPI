/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GPT } from "./components/gpt";
import * as cors from "cors";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const corsHandler = cors({
  origin: true,
});

export const gpt = onRequest((request, response) => {
  corsHandler(request, response, () => {
    const question = request.query.question;

    if (!question) {
      response.send({
        message: "No query provided"
      });
      return;
    }
  
    const gpt = new GPT(question as string);
    gpt.getAnswer().then((output) => {
      response.send({
        question: question,
        ...output,
      });
    });
  });
});