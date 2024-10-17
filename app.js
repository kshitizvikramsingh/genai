import {ChatOpenAI} from "@langchain/openai"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import {StringOutputParser} from "@langchain/core/output_parsers"
import {StructuredOutputParser} from "langchain/output_parsers"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
import { OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { createRetrievalChain } from "langchain/chains/retrieval"
import { createStuffDocumentsChain } from "langchain/chains/combine_documents" 
import express from "express"
import path from "path"
import say from "say"
import textToSpeech from'@google-cloud/text-to-speech'
import util from'util';
import dotenv from "dotenv"
dotenv.config()

const __dirname = path.resolve();

const app=express()

const pubDir=path.join(__dirname,"/public")
const views=path.join(__dirname,"/views")

app.use(express.static(pubDir))

app.set("views",views)
app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
  const model=new ChatOpenAI({
    model:"gpt-3.5-turbo",
    temperature:0.7,
    verbose:false,
    openAIApiKey:"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"
})

const prompt2= ChatPromptTemplate.fromMessages([
    ["system","Identify the type of language that user enters in in one word"],
    ["human","{input}"]
])


const chain2=prompt2.pipe(model)






const prompt= ChatPromptTemplate.fromTemplate(
    `Answer the user's Question in the {lang} script. 
     Context: {context}
     Question:{input}`
)





app.get("/",async(req,res)=>{
    res.render("home.ejs")
})

app.post("/",async(req,res)=>{
    console.log(req.body)
    const loader= new CheerioWebBaseLoader(req.body.url||"https://google.com")
const docs= await loader.load();
const splitter= new RecursiveCharacterTextSplitter({
    chunkSize:200,
    chunkOverlap:20
})
const splitDocs=await splitter.splitDocuments(docs)
const embeddings=new OpenAIEmbeddings({
    openAIApiKey:"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"
})

const vectorStore= await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);

//Retrieve data from vector store

const retriever= vectorStore.asRetriever({
})
const chain=await createStuffDocumentsChain({
    llm: model,
    prompt
})
    const retrievalChain= await createRetrievalChain({
        combineDocsChain: chain,
        retriever: retriever,
         
})

    const resp= (await retrievalChain.invoke({input:req.body.prompt,lang:req.body.lang})).answer
     console.log(await retrievalChain.invoke({input:req.body.prompt,lang:req.body.lang}))
    const resp2=await(await chain2.invoke({input:resp})).content
    
   
    res.render("answer.ejs",{resp,resp2})
})


app.get("/about",(req,res)=>{
    res.render("about.ejs")
})
app.listen("80",()=>{
    console.log("express server up on port 80")
})

