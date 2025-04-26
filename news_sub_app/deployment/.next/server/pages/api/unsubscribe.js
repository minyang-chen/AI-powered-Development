"use strict";(()=>{var e={};e.id=48,e.ids=[48],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},6555:e=>{e.exports=import("uuid")},6249:(e,s)=>{Object.defineProperty(s,"l",{enumerable:!0,get:function(){return function e(s,r){return r in s?s[r]:"then"in s&&"function"==typeof s.then?s.then(s=>e(s,r)):"function"==typeof s&&"default"===r?s:void 0}}})},3217:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.r(s),r.d(s,{config:()=>l,default:()=>c,routeModule:()=>b});var i=r(1802),n=r(7153),a=r(6249),o=r(552),u=e([o]);o=(u.then?(await u)():u)[0];let c=(0,a.l)(o,"default"),l=(0,a.l)(o,"config"),b=new i.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/unsubscribe",pathname:"/api/unsubscribe",bundlePath:"",filename:""},userland:o});t()}catch(e){t(e)}})},74:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.d(s,{Pi:()=>d,Xt:()=>b,gR:()=>l,ym:()=>c});var i=r(6555),n=e([i]);i=(n.then?(await n)():n)[0];let a=process.env.EMAIL_SIMULATOR_DIR||"./data/emails",o=()=>{{let e=r(2048);e.existsSync(a)||e.mkdirSync(a,{recursive:!0})}},u=(e,s,t,n)=>{{let u=r(2048),c=r(5315);o();let l={id:(0,i.v4)(),to:e,subject:s,html:t,text:n,sentDate:new Date().toISOString(),status:"sent"},b=c.join(a,`${l.id}.json`);return u.writeFileSync(b,JSON.stringify(l,null,2)),console.log(`[Email Simulator] Email sent to ${e}: ${s}`),l}},c=()=>{{let e=r(2048),s=r(5315);return o(),e.readdirSync(a).filter(e=>e.endsWith(".json")).map(r=>{let t=s.join(a,r),i=e.readFileSync(t,"utf-8");return JSON.parse(i)})}},l=e=>{{let s=r(2048),t=r(5315);o();let i=t.join(a,`${e}.json`);if(!s.existsSync(i))return null;let n=s.readFileSync(i,"utf-8");return JSON.parse(n)}},b=(e,s)=>{let r=process.env.APP_URL||"http://localhost:3000",t=`${r}/confirm?token=${s}`,i=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #232F3E;">Amazon Q Developer News</h2>
      <p>Thank you for subscribing to Amazon Q Developer News!</p>
      <p>Please confirm your subscription by clicking the button below:</p>
      <p>
        <a href="${t}" style="background-color: #FF9900; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Confirm Subscription
        </a>
      </p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${t}</p>
      <p>If you did not request this subscription, you can ignore this email.</p>
      <p>Thank you,<br>Amazon Q Developer Team</p>
    </div>
  `,n=`
    Amazon Q Developer News
    
    Thank you for subscribing to Amazon Q Developer News!
    
    Please confirm your subscription by visiting this URL:
    ${t}
    
    If you did not request this subscription, you can ignore this email.
    
    Thank you,
    Amazon Q Developer Team
  `;return u(e,"Confirm your subscription to Amazon Q Developer News",i,n)},d=(e,s)=>{let r=process.env.APP_URL||"http://localhost:3000",t=`${r}/unsubscribe?token=${s}`,i=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #232F3E;">Welcome to Amazon Q Developer News!</h2>
      <p>Your subscription has been confirmed.</p>
      <p>You will now receive updates about Amazon Q Developer features, best practices, and tips.</p>
      <p>Thank you for joining our community!</p>
      <p>Amazon Q Developer Team</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">
        To unsubscribe, <a href="${t}" style="color: #00A8E1;">click here</a>.
      </p>
    </div>
  `,n=`
    Welcome to Amazon Q Developer News!
    
    Your subscription has been confirmed.
    
    You will now receive updates about Amazon Q Developer features, best practices, and tips.
    
    Thank you for joining our community!
    
    Amazon Q Developer Team
    
    ---
    
    To unsubscribe, visit: ${t}
  `;return u(e,"Welcome to Amazon Q Developer News",i,n)};t()}catch(e){t(e)}})},497:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.d(s,{F0:()=>p,aB:()=>f,eQ:()=>m,fy:()=>h,su:()=>y,tY:()=>d});var i=r(6555),n=e([i]);i=(n.then?(await n)():n)[0];let a=process.env.DATA_STORAGE_DIR||"./data",o=process.env.SUBSCRIBERS_FILE||"subscribers.json",u=process.env.BACKUP_DIR||"./data/backups",c=()=>{{let e=r(2048);e.existsSync(a)||e.mkdirSync(a,{recursive:!0}),e.existsSync(u)||e.mkdirSync(u,{recursive:!0})}},l=()=>{{let e=r(2048),s=r(5315).join(a,o);if(!e.existsSync(s)){let r={subscribers:[],meta:{lastUpdated:new Date().toISOString(),totalSubscribers:0,activeSubscribers:0}};e.writeFileSync(s,JSON.stringify(r,null,2))}}},b=()=>{{let e=r(2048),s=r(5315),t=s.join(a,o),i=s.join(u,`subscribers_${Date.now()}.json`);e.existsSync(t)&&e.copyFileSync(t,i)}},d=()=>{{let e=r(2048),s=r(5315);c(),l();let t=s.join(a,o),i=e.readFileSync(t,"utf-8");return JSON.parse(i)}},p=e=>{{let s=r(2048),t=r(5315),n=d();if(n.subscribers.find(s=>s.email===e))throw Error("Email already registered");let u={email:e,status:"pending",subscriptionDate:new Date().toISOString(),confirmationDate:null,lastEmailSentDate:null,preferences:{},unsubscribeToken:(0,i.v4)(),confirmationToken:(0,i.v4)()};n.subscribers.push(u),n.meta.lastUpdated=new Date().toISOString(),n.meta.totalSubscribers=n.subscribers.length,n.meta.activeSubscribers=n.subscribers.filter(e=>"confirmed"===e.status).length,b();let c=t.join(a,o);return s.writeFileSync(c,JSON.stringify(n,null,2)),u}},m=(e,s)=>{{let t=r(2048),i=r(5315),n=d(),u=n.subscribers.findIndex(s=>s.email===e);if(-1===u)throw Error("Subscriber not found");n.subscribers[u].status=s,"confirmed"===s&&(n.subscribers[u].confirmationDate=new Date().toISOString()),n.meta.lastUpdated=new Date().toISOString(),n.meta.activeSubscribers=n.subscribers.filter(e=>"confirmed"===e.status).length,b();let c=i.join(a,o);return t.writeFileSync(c,JSON.stringify(n,null,2)),n.subscribers[u]}},f=e=>d().subscribers.find(s=>s.confirmationToken===e)||null,y=e=>d().subscribers.find(s=>s.unsubscribeToken===e)||null,h=()=>{let e=d();return{total:e.subscribers.length,active:e.subscribers.filter(e=>"confirmed"===e.status).length,pending:e.subscribers.filter(e=>"pending"===e.status).length,unsubscribed:e.subscribers.filter(e=>"unsubscribed"===e.status).length,lastUpdated:e.meta.lastUpdated}};t()}catch(e){t(e)}})},7622:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.d(s,{Ld:()=>o,h9:()=>u,r1:()=>c});var i=r(497),n=r(74),a=e([i,n]);[i,n]=a.then?(await a)():a;let o=async e=>{try{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return{success:!1,message:"Invalid email format"};let s=(0,i.F0)(e);return await (0,n.Xt)(e,s.confirmationToken),{success:!0,message:"Subscription initiated. Please check your email to confirm.",subscriber:s}}catch(e){return{success:!1,message:e.message||"Failed to subscribe"}}},u=async e=>{try{let s=(0,i.aB)(e);if(!s)return{success:!1,message:"Invalid or expired confirmation token"};if("confirmed"===s.status)return{success:!0,message:"Subscription already confirmed",subscriber:s};let r=(0,i.eQ)(s.email,"confirmed");return await (0,n.Pi)(s.email,r.unsubscribeToken),{success:!0,message:"Subscription confirmed successfully",subscriber:r}}catch(e){return{success:!1,message:e.message||"Failed to confirm subscription"}}},c=async e=>{try{let s=(0,i.su)(e);if(!s)return{success:!1,message:"Invalid unsubscribe token"};if("unsubscribed"===s.status)return{success:!0,message:"Already unsubscribed",subscriber:s};let r=(0,i.eQ)(s.email,"unsubscribed");return{success:!0,message:"Successfully unsubscribed",subscriber:r}}catch(e){return{success:!1,message:e.message||"Failed to unsubscribe"}}};t()}catch(e){t(e)}})},552:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.r(s),r.d(s,{default:()=>a});var i=r(7622),n=e([i]);async function a(e,s){if("GET"!==e.method)return s.status(405).json({success:!1,message:"Method not allowed"});try{let{token:r}=e.query;if(!r||Array.isArray(r))return s.status(400).json({success:!1,message:"Valid token is required"});let t=await (0,i.r1)(r);if(!t.success)return s.status(400).json(t);return s.status(200).json(t)}catch(e){return console.error("Unsubscribe error:",e),s.status(500).json({success:!1,message:"Server error"})}}i=(n.then?(await n)():n)[0],t()}catch(e){t(e)}})},7153:(e,s)=>{var r;Object.defineProperty(s,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,s,r)=>{e.exports=r(145)}};var s=require("../../webpack-api-runtime.js");s.C(e);var r=s(s.s=3217);module.exports=r})();