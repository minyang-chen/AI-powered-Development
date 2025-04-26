"use strict";(()=>{var e={};e.id=426,e.ids=[426],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},6555:e=>{e.exports=import("uuid")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},3906:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{config:()=>c,default:()=>l,routeModule:()=>p});var n=r(1802),s=r(7153),i=r(6249),a=r(1223),u=e([a]);a=(u.then?(await u)():u)[0];let l=(0,i.l)(a,"default"),c=(0,i.l)(a,"config"),p=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/admin/emails",pathname:"/api/admin/emails",bundlePath:"",filename:""},userland:a});o()}catch(e){o(e)}})},74:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.d(t,{Pi:()=>m,Xt:()=>p,gR:()=>c,ym:()=>l});var n=r(6555),s=e([n]);n=(s.then?(await s)():s)[0];let i=process.env.EMAIL_SIMULATOR_DIR||"./data/emails",a=()=>{{let e=r(2048);e.existsSync(i)||e.mkdirSync(i,{recursive:!0})}},u=(e,t,o,s)=>{{let u=r(2048),l=r(5315);a();let c={id:(0,n.v4)(),to:e,subject:t,html:o,text:s,sentDate:new Date().toISOString(),status:"sent"},p=l.join(i,`${c.id}.json`);return u.writeFileSync(p,JSON.stringify(c,null,2)),console.log(`[Email Simulator] Email sent to ${e}: ${t}`),c}},l=()=>{{let e=r(2048),t=r(5315);return a(),e.readdirSync(i).filter(e=>e.endsWith(".json")).map(r=>{let o=t.join(i,r),n=e.readFileSync(o,"utf-8");return JSON.parse(n)})}},c=e=>{{let t=r(2048),o=r(5315);a();let n=o.join(i,`${e}.json`);if(!t.existsSync(n))return null;let s=t.readFileSync(n,"utf-8");return JSON.parse(s)}},p=(e,t)=>{let r=process.env.APP_URL||"http://localhost:3000",o=`${r}/confirm?token=${t}`,n=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #232F3E;">Amazon Q Developer News</h2>
      <p>Thank you for subscribing to Amazon Q Developer News!</p>
      <p>Please confirm your subscription by clicking the button below:</p>
      <p>
        <a href="${o}" style="background-color: #FF9900; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Confirm Subscription
        </a>
      </p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${o}</p>
      <p>If you did not request this subscription, you can ignore this email.</p>
      <p>Thank you,<br>Amazon Q Developer Team</p>
    </div>
  `,s=`
    Amazon Q Developer News
    
    Thank you for subscribing to Amazon Q Developer News!
    
    Please confirm your subscription by visiting this URL:
    ${o}
    
    If you did not request this subscription, you can ignore this email.
    
    Thank you,
    Amazon Q Developer Team
  `;return u(e,"Confirm your subscription to Amazon Q Developer News",n,s)},m=(e,t)=>{let r=process.env.APP_URL||"http://localhost:3000",o=`${r}/unsubscribe?token=${t}`,n=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #232F3E;">Welcome to Amazon Q Developer News!</h2>
      <p>Your subscription has been confirmed.</p>
      <p>You will now receive updates about Amazon Q Developer features, best practices, and tips.</p>
      <p>Thank you for joining our community!</p>
      <p>Amazon Q Developer Team</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">
        To unsubscribe, <a href="${o}" style="color: #00A8E1;">click here</a>.
      </p>
    </div>
  `,s=`
    Welcome to Amazon Q Developer News!
    
    Your subscription has been confirmed.
    
    You will now receive updates about Amazon Q Developer features, best practices, and tips.
    
    Thank you for joining our community!
    
    Amazon Q Developer Team
    
    ---
    
    To unsubscribe, visit: ${o}
  `;return u(e,"Welcome to Amazon Q Developer News",n,s)};o()}catch(e){o(e)}})},1223:(e,t,r)=>{r.a(e,async(e,o)=>{try{r.r(t),r.d(t,{default:()=>i});var n=r(74),s=e([n]);n=(s.then?(await s)():s)[0];let a=e=>{let t=e.headers["x-admin-key"];return"local-admin-key"===t};async function i(e,t){if(!a(e))return t.status(401).json({success:!1,message:"Unauthorized"});if("GET"!==e.method)return t.status(405).json({success:!1,message:"Method not allowed"});try{let{id:r}=e.query;if(r&&!Array.isArray(r)){let e=(0,n.gR)(r);if(!e)return t.status(404).json({success:!1,message:"Email not found"});return t.status(200).json({success:!0,email:e})}{let e=(0,n.ym)();return t.status(200).json({success:!0,emails:e})}}catch(e){return console.error("Admin emails error:",e),t.status(500).json({success:!1,message:"Server error"})}}o()}catch(e){o(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=3906);module.exports=r})();