import {ChatOpenAI} from "@langchain/openai"
import {ChatPromptTemplate} from "@langchain/core/prompts"
import express from "express"
import path from "path"
import say from "say"
import textToSpeech from'@google-cloud/text-to-speech'
import util from'util';



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


const prompt= ChatPromptTemplate.fromMessages([
    ["system","Answer the user in {lang} script"],
    ["human","{input}"]
])
const prompt2= ChatPromptTemplate.fromMessages([
    ["system","Identify the type of language that user enters in in one word"],
    ["human","{input}"]
])

const chain=prompt.pipe(model)
const chain2=prompt2.pipe(model)





app.get("/",async(req,res)=>{
   
    res.render("home.ejs")
})

app.post("/",async(req,res)=>{
    console.log(req.body)
    const resp=await (await chain.invoke({input:req.body.prompt,lang:req.body.lang})).content
    const resp2=await(await chain2.invoke({input:resp})).content
    
    res.render("answer.ejs",{resp,resp2})
})


app.get("/about",(req,res)=>{
    res.render("about.ejs")
})
app.listen("80",()=>{
    console.log("express server up on port 80")
})

