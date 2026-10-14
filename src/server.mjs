
import http from 'node:http';import{auth,parsePacket,draftReceipt}from './contract.mjs';
const secret=process.env.X1_GPT_BRIDGE_TOKEN,port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1';
http.createServer(async(req,res)=>{const send=(n,data)=>{res.writeHead(n,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(data));};
if(req.url==='/health'&&req.method==='GET')return send(200,{service:'x1-minimal-bridge',ready:!!secret,queue_bound:false,mode:'DRAFT_ONLY'});
if(!auth(req.headers.authorization,secret))return send(401,{error:'UNAUTHORIZED'});
if(req.url==='/api/gpt/sync'&&req.method==='POST'){try{let str='';for await(const b of req){str+=b;if(str.length>65536)throw Error('TOO_LARGE');}return send(202,draftReceipt(parsePacket(JSON.parse(str))));}catch(e){return send(400,{error:e.message});}}
if(req.url==='/api/gpt/status'&&req.method==='GET')return send(503,{error:'DURABLE_STATUS_ADAPTER_NOT_BOUND'});return send(404,{error:'NOT_FOUND'});}).listen(port,host,()=>console.log('x1 draft-only bridge running'));