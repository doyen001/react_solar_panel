import { RunnableLambda } from "@langchain/core/runnables";
import { retrieveFaqContext } from "./faqDocuments";

/**
 * LangChain runnable: maps a user query to retrieved FAQ text (keyword overlap over chunked PDF).
 */
export const retrieveFaqRunnable = RunnableLambda.from(
  async (input: { query: string }) => ({
    query: input.query,
    faqContext: await retrieveFaqContext(input.query),
  }),
);
