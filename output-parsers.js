import {ChatOpenAI} from "@langchain/openai"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"




const parser= new StringOutputParser


const model = new ChatOpenAI({
    openAIApiKey:"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",
    temperature:0.7,
    verbose:true
})

//crate a prompt template

const prompt=ChatPromptTemplate.fromMessages(
    ["system", "You are Nivi, an Indian financial assistant! Tell something about finance based on the {input} by user"],
    ["human","{input}"]
)


console.log(await prompt.format({input:"Tax"}))


//create a chain

const chain= prompt.pipe(model).pipe(parser)

const resp = await chain.invoke({
    input: "Tax"
})

console.log(resp)