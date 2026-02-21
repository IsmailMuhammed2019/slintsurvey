import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#1B4F72","#2E86C1","#1ABC9C","#27AE60","#F39C12","#E74C3C","#8E44AD","#D35400","#16A085","#2C3E50","#C0392B","#7D3C98"];

const t = {
  bg:"#F7F8FA",card:"#FFFFFF",border:"#E5E7EB",accent:"#1B4F72",accentL:"#2E86C1",
  green:"#1ABC9C",gold:"#C8910A",text:"#1A202C",mid:"#4A5568",dim:"#9CA3AF",
  danger:"#DC2626",purple:"#7C3AED",
  sh:"0 1px 3px rgba(0,0,0,0.05),0 1px 2px rgba(0,0,0,0.03)",
  shMd:"0 4px 14px rgba(0,0,0,0.06)",
};

const SECTIONS = [
  {id:"A",title:"Basic Information",required:true},
  {id:"B",title:"Member Profile & Identity"},
  {id:"C",title:"How You Want to Engage"},
  {id:"D",title:"Priority Areas"},
  {id:"E",title:"Ideas, Concepts & Partnerships"},
  {id:"F",title:"Financing & Venture Experience"},
  {id:"G",title:"Business Growth & Capital"},
  {id:"H",title:"What You Want From SLINT"},
  {id:"I",title:"Student Questions",conditional:"Student"},
  {id:"J",title:"Government & Policy",conditional:"Government / Public Sector Official"},
  {id:"K",title:"Professional Standards"},
  {id:"L",title:"Corporate & Employer",conditional:"Corporate Employer / HR Decision Maker"},
  {id:"M",title:"Engagement & Participation"},
  {id:"N",title:"Time Commitment"},
  {id:"O",title:"Expo, Awards & Innovation"},
  {id:"P",title:"Willingness to Contribute"},
  {id:"Q",title:"National Constraints"},
  {id:"R",title:"Strategic Input"},
];

const Q=(id,text,type,options,o={})=>({id,text,type,options,required:o.required||false,limit:o.limit,condition:o.condition,helperText:o.helperText});

const QUESTIONS={
  A:[Q("A1","Full Name","text",null,{required:true}),Q("A2","Email Address","email",null,{required:true}),Q("A3","Phone Number","text"),Q("A4","Location (City & Country)","text"),Q("A5","Are you currently a registered SLINT member?","radio",["Yes","No (I plan to register)"]),Q("A6","Years of experience in tech-related fields","radio",["Under 2 years","2–5 years","5–10 years","10+ years"])],
  B:[Q("B1","Which best describes you currently?","checkbox",["Student","Business Owner / Entrepreneur","Startup Founder (Pre-revenue or Early Stage)","Industry Professional (Private Sector)","Government / Public Sector Official","Academic / Researcher","Investor / Venture Capital / Angel Investor","Development / NGO Professional","Diaspora Professional","Corporate Employer / HR Decision Maker","Not currently active in tech but interested"],{helperText:"Select all that apply"})],
  C:[Q("C1","How would you like to participate in SLINT during this term?","checkbox",["Committee member","Committee lead or co-lead","Mentor / Advisor","Speaker / Trainer","Startup / Entrepreneur support","Policy / Government engagement","Academia / Research collaboration","Private sector / Industry partnerships","Student / Youth engagement","Member business promotion","General volunteer","Not sure yet — open to discussion"])],
  D:[Q("D1","Which areas should SLINT prioritize?","checkbox",["AI & Emerging Technologies","Cybersecurity","Software & Digital Services","Tech Education & Academia","Tech Entrepreneurship & Startups","Innovation & R&D","ICT Policy & Government Collaboration","Trade, Export & Market Access","Diaspora–Home Collaboration","Mentorship & Leadership Development"],{limit:3})],
  E:[Q("E1","Briefly describe what you would like to work on or help expand.","textarea",null,{helperText:"This can be an idea, a program, a partnership, or a problem you want SLINT to help address."}),Q("E2","Are there Sierra Leonean or global organizations SLINT should affiliate or collaborate with?","textarea",null,{helperText:"Examples: ISOC, innovation hubs, universities, investment bodies, diaspora groups."}),Q("E3","Would you like to submit a more detailed concept or proposal?","radio",["Yes (please follow up with me)","Not at this time"])],
  F:[Q("F1","Do you have experience in financing, venture capital, or investment?","checkbox",["Angel investing","Venture capital","Private equity","Startup fundraising","Business financing (loans, credit, grants)","Educational financing / scholarships / student funding","Diaspora investment structures","Trade finance","Government or multilateral funding programs","I do not have financing experience","Interested in learning about venture financing"])],
  G:[Q("G1","Are you currently operating a business?","radio",["Yes","No","Planning to start"]),Q("G2","How long have you been in business?","radio",["Pre-revenue / Idea stage","0–1 year (Startup stage)","1–3 years (Early growth)","3–7 years (Scaling stage)","7+ years (Established business)"],{condition:{field:"G1",value:"Yes"}}),Q("G3","Industry / Sector of your business","text",null,{condition:{field:"G1",value:"Yes"}}),Q("G4","What stage best describes your revenue?","radio",["Pre-revenue / Idea stage","Early revenue (under $50k/year)","Growth stage ($50k–$500k/year)","Scaling ($500k–$2M/year)","Established ($2M+)"],{condition:{field:"G1",value:"Yes"}}),Q("G5","What is currently holding you back from starting a business?","checkbox",["Lack of startup capital","Limited access to investors","Fear of failure","Lack of mentorship","Regulatory / legal uncertainty","Market access challenges","Lack of technical skills","Limited network","Time constraints","Lack of co-founder / team","Unsure where to start","Risk of economic instability","Family or personal obligations","Prefer employment stability","Other (please specify)"],{condition:{field:"G1",value:"Planning to start"}}),Q("G6","Do you currently have a funding need?","radio",["Yes","No","Possibly within 12 months"]),Q("G7","What type of funding are you seeking?","checkbox",["Seed funding","Angel investment","Venture capital","Grant funding","Bank financing","Government-backed financing","Diaspora investment","Trade finance","Export financing","Equipment financing","Educational funding","Working capital"],{condition:{field:"G6",values:["Yes","Possibly within 12 months"]}}),Q("G8","What funding range are you targeting?","radio",["Under $10,000","$10,000 – $50,000","$50,000 – $100,000","$100,000 – $250,000","$250,000 – $500,000","$500,000 – $1M","$1M+"],{condition:{field:"G6",values:["Yes","Possibly within 12 months"]}}),Q("G9","What is the primary use of the funding?","checkbox",["Product development","Market expansion","Hiring talent","Infrastructure / equipment","Export development","Research & innovation","Government contract readiness","Certification & compliance","Working capital stabilization","Technology upgrade"],{condition:{field:"G6",values:["Yes","Possibly within 12 months"]}}),Q("G10","Briefly describe your growth objective.","text",null,{condition:{field:"G6",values:["Yes","Possibly within 12 months"]}}),Q("G11","Are you seeking partnerships?","radio",["Yes","No"]),Q("G12","What geography of partnership?","checkbox",["Local (Sierra Leone)","Regional (West Africa)","Pan-African","Diaspora-based","Europe","North America","Middle East","Asia"],{condition:{field:"G11",value:"Yes"}}),Q("G13","What type of partner are you seeking?","checkbox",["Technical partner","Strategic investor","Distribution partner","Government partner","Export buyer","University / research partner","Corporate client","Procurement channel partner"],{condition:{field:"G11",value:"Yes"}}),Q("G14","What countries are priority for you?","text",null,{condition:{field:"G11",value:"Yes"}})],
  H:[Q("H1","What would you like from the SLINT community?","checkbox",["Access to investors","Venture funding introductions","Business financing guidance","Startup incubation","Mentorship","Partnerships","Government access","Market access (local or international)","Skill development","Policy influence","Visibility / promotion","Research collaboration","Speaking opportunities","Diaspora engagement","Community networking","Educational scholarships","Internship or job placement support","Access to grants","Corporate sponsorship connections","Nothing specific — open to collaboration"],{limit:5})],
  I:[Q("I1","What is your area of study?","text"),Q("I2","Level of Study","radio",["Undergraduate","Postgraduate","PhD","Professional certification","Vocational / Technical"]),Q("I3","How can SLINT best support education in Sierra Leone?","checkbox",["Scholarship programs","Internship placement","Industry mentorship","Curriculum modernization","Certification sponsorship","Tech equipment support","Research grants","Startup support for student founders","University partnerships","Government advocacy for education reform","Career pathway guidance"])],
  J:[Q("J1","Would you be interested in supporting SLINT's engagement with government?","radio",["Yes","Maybe","No"]),Q("J2","How do you see working with SLINT?","checkbox",["ICT policy development","Digital transformation programs","Cybersecurity initiatives","Youth employment programs","Public-private partnerships","Innovation policy advisory","Skills development programs","Diaspora engagement frameworks","Regulatory reform collaboration","Trade & export development"]),Q("J3","Would your institution recognize SLINT-certified professionals in procurement?","checkbox",["Yes — as preferred technical providers","Yes — as pre-qualified vendors","Possibly — subject to legal review","Not currently"]),Q("J4","Would you support preferential consideration for SLINT-certified indigenous businesses?","checkbox",["Yes — through set-asides","Yes — through evaluation scoring weight","Yes — through vendor shortlisting preference","Needs policy development","No"]),Q("J5","Would you collaborate with SLINT on:","checkbox",["ICT standards alignment","National digital skills framework","Cybersecurity standards","Local content policy","Technology procurement reform","Government advisory boards","Startup regulatory simplification","National innovation roadmap"]),Q("J6","How does your institution currently source industry professionals?","checkbox",["Direct hiring","Consultancy firms","International agencies","Open procurement","Informal networks"]),Q("J7","Would you support SLINT as a policy formulation partner?","radio",["Yes — formal advisory role","Yes — working committee participation","Yes — periodic consultation","Not at this time"]),Q("J8","What specific area of collaboration would you prioritize?","textarea")],
  K:[Q("K1","Do you believe Sierra Leone needs a recognized professional technology association with enforceable standards?","radio",["Yes — urgently","Yes — but gradual implementation","Neutral","Not necessary"]),Q("K2","Would you support SLINT implementing:","checkbox",["Professional membership tiers","Code of ethics & conduct","Verified member registry","Certified industry proficiency ratings","Disciplinary and ethics review board","Employer-recognized accreditation","Government-recognized advisory status","Continuing professional development (CPD) requirements","Annual renewal & professional reporting"]),Q("K3","Should SLINT maintain a public directory of verified tech professionals?","radio",["Yes","Yes, but with privacy controls","No"]),Q("K4","Would you be willing to:","checkbox",["Undergo proficiency validation","Submit professional references","Adhere to a SLINT Code of Ethics","Participate in peer review","Submit annual professional development updates","Carry a barcoded SLINT Membership ID"]),Q("K5","If SLINT issues a physical barcoded membership card with digital verification, would you:","radio",["Register immediately","Register if recognized by employers","Register if linked to professional benefits","Not interested"]),Q("K6","What should a SLINT Membership Card represent?","checkbox",["Verified professional status","Ethical accountability","Industry competence","Access to opportunities","Employer trust signal","Government recognition","Access to exclusive training","Access to investment opportunities","Professional prestige"],{limit:3}),Q("K7","Should SLINT adopt a formal Code of Ethics including:","checkbox",["Data protection & privacy standards","Anti-corruption commitments","Professional confidentiality","Conflict of interest disclosure","Competency standards","Continuing learning obligations","Disciplinary measures"]),Q("K8","Should SLINT maintain a professional rating and reporting mechanism for ethical conduct?","radio",["Yes — confidential","Yes — structured review system","No","Needs further consultation"])],
  L:[Q("L1","Would your organization recognize SLINT membership as:","checkbox",["A hiring advantage","A preferred candidate indicator","A required qualification for certain roles","A professional credibility signal","Not currently"]),Q("L2","Would your organization be willing to:","checkbox",["Sponsor employee SLINT memberships","Pay annual corporate membership","Require SLINT code of ethics adherence","Participate in professional rating feedback","Report ethical violations through SLINT","Offer internships to SLINT members","Offer discounted services to members"]),Q("L3","Should companies contribute through paid corporate membership?","radio",["Yes — mandatory for participating companies","Yes — voluntary","No","Needs consultation"]),Q("L4","What benefits would justify corporate membership?","checkbox",["Access to verified tech talent","Public listing as SLINT-recognized employer","Policy advisory access","Workforce development collaboration","Professional certification pipeline","Industry events & exposure","Government advocacy representation","Ethics compliance certification","Research & data access"],{limit:5})],
  M:[Q("M1","In professional associations, what factors most influence participation?","checkbox",["Clear strategic direction","Defined roles & responsibilities","Measurable impact","Regular communication","Recognition & professional benefit","Time-efficient meetings","Access to funding opportunities","Strong committee structure","Visible leadership accessibility","Clear annual roadmap","Member-driven initiatives","Professional accreditation value"],{limit:3}),Q("M2","Which communication style would increase your participation?","checkbox",["Structured monthly update","Quarterly strategy brief","WhatsApp summaries only","Email newsletter","Clear project assignments","Small focused working groups","Defined short-term tasks","In-person meetings","Hybrid virtual meetings","Annual planning retreat"]),Q("M3","What engagement structure would encourage your participation going forward?","checkbox",["Small focused working groups","Time-bound project teams","Advisory committees","Quarterly strategy forums","Digital collaboration platforms","Recognition-based participation","Funding-linked initiatives","Professional certification involvement"]),Q("M4","Would you be more engaged if:","checkbox",["Roles were clearly defined","Impact was measurable","Recognition systems were introduced","There were professional benefits attached","There was funding attached to initiatives","Committees had autonomy","There was leadership accountability reporting","Meetings were shorter and structured","Digital tools were better used"]),Q("M5","What motivates you to stay active in a professional association?","checkbox",["Career advancement","Industry recognition","Access to capital","Policy influence","Mentorship opportunities","Giving back","Networking","Skill development","National development impact"]),Q("M6","Do you feel participation challenges in associations are primarily:","radio",["Structural","Leadership style","Communication gaps","Member commitment","Resource limitations","Not sure"]),Q("M7","Would you prefer SLINT to focus on:","radio",["Fewer, high-impact initiatives","Many small community activities","Strong policy & institutional focus","Strong startup & funding focus","Balanced ecosystem approach"]),Q("M8","How can SLINT design engagement that respects members' time and maximizes impact?","textarea")],
  N:[Q("N1","How much time could you realistically contribute per year?","radio",["5–10 hours per year","10–25 hours","25–50 hours","50–100 hours","100+ hours","Committee-level involvement"]),Q("N2","Preferred months of engagement in 2026","checkbox",["March","April","May","June","July","August","September","October","November","December"])],
  O:[Q("O1","Should SLINT host:","radio",["Annual Tech Excellence Awards (separate from Expo)","Awards integrated into Expo","Both (Local Awards + Global Recognition)","Not necessary"]),Q("O2","Should SLINT host events globally?","radio",["One annual event in Sierra Leone only","One in Sierra Leone + one in a diaspora-heavy country","Rotate globally each year","Hybrid virtual + physical"]),Q("O3","Preferred diaspora country for second event?","checkbox",["USA","UK","Canada","UAE","Nigeria","Other"]),Q("O4","Would you participate in a SLINT Innovation Fund Pitch Competition?","radio",["Yes","Maybe","No"]),Q("O5","If SLINT launched a pitch platform, would you apply for:","checkbox",["Grant awards","Seed investment","Convertible note funding","Corporate partnership","Government contract pipeline","Export introduction"]),Q("O6","Should SLINT create a dedicated Innovation Fund?","radio",["Yes","Yes — through corporate sponsors","Yes — through diaspora capital","Yes — blended public-private","No"]),Q("O7","What funding structure do you prefer?","checkbox",["Non-dilutive grants","Equity investment","Revenue share","Convertible instruments","Loan model","Blended structure"]),Q("O8","Should award categories include:","checkbox",["Tech Startup of the Year","Cybersecurity Excellence","AI Innovation Award","Best Student Innovator","Corporate Tech Leadership","Public Sector Digital Transformation","Diaspora Tech Impact","Ethical Tech Leadership"]),Q("O9","Should SLINT integrate Pitch Competition into events?","checkbox",["Integrate Pitch Competition into Annual Expo","Host Pitch Finals during Awards Night","Create separate Innovation Week","Have diaspora finals abroad","All of the above"])],
  P:[Q("P1","Would you be willing to:","checkbox",["Mentor startups","Serve on an advisory board","Invest in SL tech startups","Lead a financing working group","Sponsor a program","Co-develop policy proposals","Host events","Provide internships","Provide seed capital"])],
  Q:[Q("Q1","What are the biggest constraints preventing growth in Sierra Leone's tech sector?","checkbox",["Access to capital","Regulatory uncertainty","Procurement barriers","Skills gap","Infrastructure","Limited investor presence","Trust / credibility issues","Lack of certification standards","Weak diaspora coordination","Limited export readiness","Corruption / ethical risks"],{limit:5})],
  R:[Q("R1","What structural improvements would most strengthen SLINT's long-term institutional credibility?","textarea"),Q("R2","If SLINT were to launch one high-impact initiative in the next 12 months, what should it be?","textarea"),Q("R3","Anything else you would like the SLINT leadership to know?","textarea")],
};

function getCluster(a){const b=a.B1||[],g=a.G2||"",c=[];if(b.includes("Student"))c.push("Student");if(b.includes("Startup Founder (Pre-revenue or Early Stage)")||g.includes("Pre-revenue")||g.includes("0–1"))c.push("Startup");if(g.includes("1–3"))c.push("Early Growth");if(g.includes("3–7")||g.includes("7+"))c.push("Scaling");if(b.includes("Government / Public Sector Official"))c.push("Government");if(b.includes("Investor / Venture Capital / Angel Investor"))c.push("Investor");if(b.includes("Diaspora Professional"))c.push("Diaspora");if(b.includes("Corporate Employer / HR Decision Maker"))c.push("Corporate");if(b.includes("Academic / Researcher"))c.push("Academic");if(!c.length)c.push("General");return c;}

// ── Banner Component ──
function Banner(){
  return(
    <div style={{
      background:"linear-gradient(180deg, #FFFFFF 0%, #F0F2F5 50%, #E8ECF0 100%)",
      borderBottom:"1px solid #D1D5DB",
      padding:"40px 24px 36px",
      textAlign:"center",
      position:"relative",
      overflow:"hidden",
    }}>
      {/* Metallic shine overlay */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",
        background:"linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
        pointerEvents:"none"}}/>
      {/* Subtle decorative lines */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,
        background:"linear-gradient(90deg, #1B4F72, #2E86C1, #1ABC9C, #2E86C1, #1B4F72)"}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto"}}>
        {/* SLINT Logo */}
        <img
          src="https://slint.org/wp-content/uploads/2023/02/88616-01-150x150.png"
          alt="SLINT Logo"
          style={{width:90,height:90,marginBottom:16,borderRadius:16,
            boxShadow:"0 4px 20px rgba(27,79,114,0.12)",
            background:"#FFFFFF",padding:4}}
          onError={(e)=>{e.target.style.display='none'}}
        />

        <div style={{fontSize:28,fontWeight:800,color:t.accent,letterSpacing:2,marginBottom:6,
          fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
          SLINT
        </div>
        <div style={{fontSize:11,fontWeight:600,color:t.mid,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>
          Sierra Leoneans in Technology
        </div>

        {/* Divider */}
        <div style={{width:60,height:2,background:"linear-gradient(90deg,#1B4F72,#1ABC9C)",
          margin:"0 auto 18px",borderRadius:1}}/>

        <div style={{fontSize:18,fontWeight:700,color:t.text,marginBottom:6}}>
          Institutional Diagnostic Survey
        </div>
        <div style={{fontSize:13,fontWeight:500,color:t.mid,letterSpacing:0.5}}>
          2026–2029 Strategic Term &nbsp;·&nbsp; Members Only
        </div>
      </div>
    </div>
  );
}

// ── Form Components ──
function CBox({options,value=[],onChange,limit}){
  const v=Array.isArray(value)?value:[];
  return(<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {options.map(o=>{const ck=v.includes(o),dis=limit&&v.length>=limit&&!ck;
      return(<label key={o} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:10,
        border:`1.5px solid ${ck?t.accent:t.border}`,background:ck?"rgba(27,79,114,0.04)":"#FFFFFF",
        cursor:dis?"not-allowed":"pointer",opacity:dis?0.35:1,fontSize:13,color:ck?t.accent:t.text,
        transition:"all 0.15s",minWidth:180,flex:"1 1 220px",maxWidth:420}}>
        <input type="checkbox" checked={ck} disabled={dis}
          onChange={()=>{if(ck)onChange(v.filter(x=>x!==o));else if(!limit||v.length<limit)onChange([...v,o]);}}
          style={{accentColor:t.accent,width:16,height:16,cursor:"inherit"}}/>
        <span>{o}</span></label>);})}
  </div>);
}

function RGroup({options,value,onChange}){
  return(<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {options.map(o=>{const ck=value===o;
      return(<label key={o} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:10,
        border:`1.5px solid ${ck?t.accent:t.border}`,background:ck?"rgba(27,79,114,0.04)":"#FFFFFF",
        cursor:"pointer",fontSize:13,color:ck?t.accent:t.text,transition:"all 0.15s",
        minWidth:180,flex:"1 1 220px",maxWidth:420}}>
        <input type="radio" checked={ck} onChange={()=>onChange(o)}
          style={{accentColor:t.accent,width:16,height:16}}/>
        <span>{o}</span></label>);})}
  </div>);
}

function QCard({q,value,onChange,answers}){
  if(q.condition){const av=answers[q.condition.field];
    if(q.condition.value&&av!==q.condition.value)return null;
    if(q.condition.values&&!q.condition.values.includes(av))return null;}
  const iS={width:"100%",padding:"12px 16px",borderRadius:10,border:`1.5px solid ${t.border}`,
    background:"#FFFFFF",color:t.text,fontSize:14,outline:"none",boxSizing:"border-box",
    fontFamily:"inherit",transition:"border-color 0.2s"};
  const foc=e=>e.target.style.borderColor=t.accent;
  const blr=e=>e.target.style.borderColor=t.border;
  return(
    <div style={{marginBottom:18,padding:24,borderRadius:14,background:"linear-gradient(180deg,#FFFFFF,#FAFBFC)",
      border:"1px solid rgba(0,0,0,0.06)",boxShadow:t.sh}}>
      <div style={{fontSize:14,fontWeight:600,color:t.text,marginBottom:6,lineHeight:1.5}}>
        {q.text}{q.required&&<span style={{color:t.danger,marginLeft:4}}>*</span>}
      </div>
      {q.limit&&<div style={{fontSize:11,color:t.gold,fontWeight:700,marginBottom:6}}>Select up to {q.limit}</div>}
      {q.helperText&&<div style={{fontSize:12,color:t.dim,marginBottom:10}}>{q.helperText}</div>}
      {q.type==="text"&&<input type="text" value={value||""} onChange={e=>onChange(e.target.value)} style={iS} onFocus={foc} onBlur={blr}/>}
      {q.type==="email"&&<input type="email" value={value||""} onChange={e=>onChange(e.target.value)} style={iS} onFocus={foc} onBlur={blr}/>}
      {q.type==="textarea"&&<textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={3} style={{...iS,resize:"vertical"}} onFocus={foc} onBlur={blr}/>}
      {q.type==="radio"&&<RGroup options={q.options} value={value} onChange={onChange}/>}
      {q.type==="checkbox"&&<CBox options={q.options} value={value} onChange={onChange} limit={q.limit}/>}
    </div>
  );
}

// ── Dashboard ──
function Dash({responses:rs}){
  if(!rs.length)return(<div style={{textAlign:"center",padding:80,color:t.dim}}>
    <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:8}}>No Responses Yet</div>
    <div>Analytics will appear once responses are collected.</div></div>);
  const cnt=(f)=>{const m={};rs.forEach(r=>{const v=r[f];if(!v)return;(Array.isArray(v)?v:[v]).forEach(i=>{m[i]=(m[i]||0)+1;});});
    return Object.entries(m).map(([n,v])=>({name:n.length>34?n.slice(0,32)+"…":n,value:v,fullName:n})).sort((a,b)=>b.value-a.value);};
  const clD=()=>{const m={};rs.forEach(r=>getCluster(r).forEach(c=>{m[c]=(m[c]||0)+1;}));
    return Object.entries(m).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);};
  const mC=(l,v,c)=>(<div style={{background:"#FFFFFF",borderRadius:14,padding:24,flex:"1 1 170px",minWidth:170,
    border:"1px solid rgba(0,0,0,0.06)",boxShadow:t.sh,textAlign:"center"}}>
    <div style={{fontSize:32,fontWeight:800,color:c||t.accent}}>{v}</div>
    <div style={{fontSize:12,color:t.mid,marginTop:6,fontWeight:500}}>{l}</div></div>);
  const cB=(title,ch)=>(<div style={{background:"#FFFFFF",borderRadius:14,padding:24,border:"1px solid rgba(0,0,0,0.06)",
    boxShadow:t.sh,flex:"1 1 440px",minWidth:320}}>
    <div style={{fontSize:14,fontWeight:700,color:t.text,marginBottom:16,paddingBottom:8,
      borderBottom:`2px solid ${t.accent}`,display:"inline-block"}}>{title}</div>{ch}</div>);
  const bC=(d,c=t.accent)=>(<ResponsiveContainer width="100%" height={Math.max(200,d.length*30)}>
    <BarChart data={d.slice(0,10)} layout="vertical" margin={{left:10,right:20,top:5,bottom:5}}>
      <XAxis type="number" tick={{fill:t.dim,fontSize:11}}/><YAxis dataKey="name" type="category" width={150} tick={{fill:t.text,fontSize:11}}/>
      <Tooltip contentStyle={{background:"#fff",border:`1px solid ${t.border}`,borderRadius:10,color:t.text,boxShadow:t.shMd}}
        formatter={(v,n,p)=>[v,p.payload.fullName||p.payload.name]}/>
      <Bar dataKey="value" fill={c} radius={[0,6,6,0]}/></BarChart></ResponsiveContainer>);
  const pC=(d)=>(<ResponsiveContainer width="100%" height={260}><PieChart>
    <Pie data={d.slice(0,8)} cx="50%" cy="50%" outerRadius={90} dataKey="value"
      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:t.dim}} fontSize={10}>
      {d.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie>
    <Tooltip contentStyle={{background:"#fff",border:`1px solid ${t.border}`,borderRadius:10,color:t.text}}/></PieChart></ResponsiveContainer>);

  const fN=rs.filter(r=>r.G6==="Yes"||r.G6==="Possibly within 12 months").length;
  const gR=rs.filter(r=>(r.B1||[]).includes("Government / Public Sector Official")).length;
  const cI=rs.filter(r=>r.K5&&r.K5!=="Not interested").length;

  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:32}}>
      {mC("Total Responses",rs.length,t.accent)}{mC("Funding Needs",fN,"#C8910A")}
      {mC("Govt Respondents",gR,"#7C3AED")}{mC("Card Interest",cI,t.green)}
      {mC("Countries",[...new Set(rs.map(r=>r.A4).filter(Boolean))].length,"#2E86C1")}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Member Profile",pC(cnt("B1")))}{cB("Priority Areas",bC(cnt("D1"),"#2E86C1"))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Ecosystem Constraints",bC(cnt("Q1"),"#DC2626"))}{cB("Funding Range",bC(cnt("G8"),"#C8910A"))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("What Members Want",bC(cnt("H1"),"#7C3AED"))}{cB("Clusters",pC(clD()))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Card Interest",pC(cnt("K5")))}{cB("Partnership Geography",bC(cnt("G12"),"#1ABC9C"))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Participation Drivers",bC(cnt("M1"),"#2E86C1"))}{cB("Time Commitment",pC(cnt("N1")))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Professional Standards",bC(cnt("K2"),t.accent))}{cB("Expo & Awards",pC(cnt("O1")))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Funding Types",bC(cnt("G7"),"#C8910A"))}{cB("Engagement Structure",bC(cnt("M3"),"#7C3AED"))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginBottom:20}}>{cB("Award Categories",bC(cnt("O8"),"#D35400"))}{cB("Willingness to Contribute",bC(cnt("P1"),t.accent))}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20}}>{cB("Preferred Months 2026",bC(cnt("N2"),"#1ABC9C"))}{cB("Financing Experience",bC(cnt("F1"),"#C8910A"))}</div>
  </div>);
}

// ── Responses Table ──
function RTable({responses:rs,onDelete}){
  const[exp,setExp]=useState(null);
  if(!rs.length)return(<div style={{textAlign:"center",padding:80,color:t.dim}}>
    <div style={{fontSize:20,fontWeight:700,color:t.text}}>No Responses Yet</div></div>);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{fontSize:14,color:t.mid,fontWeight:500}}>{rs.length} response{rs.length!==1?"s":""}</div>
      <button onClick={()=>{
        const csv=["Name,Email,Location,Profile,Cluster,Funding Need,Funding Range,Card Interest,Time Commitment"];
        rs.forEach(r=>{csv.push([r.A1,r.A2,r.A4,(r.B1||[]).join("; "),getCluster(r).join("; "),r.G6,r.G8,r.K5,r.N1].map(v=>`"${(v||"").toString().replace(/"/g,'""')}"`).join(","));});
        const b=new Blob([csv.join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="slint_responses.csv";a.click();
      }} style={{padding:"10px 22px",borderRadius:10,background:t.accent,color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,boxShadow:t.sh}}>
        Export CSV
      </button>
    </div>
    {rs.map((r,i)=>(<div key={i} style={{background:"#FFFFFF",borderRadius:14,border:`1px solid ${t.border}`,marginBottom:12,overflow:"hidden",boxShadow:t.sh}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",cursor:"pointer"}}
        onClick={()=>setExp(exp===i?null:i)}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(27,79,114,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:t.accent}}>
            {(r.A1||"?")[0].toUpperCase()}</div>
          <div><div style={{fontSize:14,fontWeight:600,color:t.text}}>{r.A1||"Unnamed"}</div>
            <div style={{fontSize:12,color:t.dim}}>{r.A2} · {r.A4} · {getCluster(r).join(", ")}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {r.G6==="Yes"&&<span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:"rgba(200,145,10,0.08)",color:t.gold}}>Funding</span>}
          {(r.B1||[]).includes("Government / Public Sector Official")&&<span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:"rgba(124,58,237,0.08)",color:t.purple}}>Govt</span>}
          <span style={{color:t.dim,fontSize:16,fontWeight:700}}>{exp===i?"−":"+"}</span>
        </div>
      </div>
      {exp===i&&(<div style={{padding:"0 24px 24px",borderTop:`1px solid ${t.border}`}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,paddingTop:16}}>
          {Object.entries(r).filter(([k,v])=>v&&k!=="timestamp"&&k!=="id").map(([k,v])=>(
            <div key={k} style={{background:t.bg,borderRadius:10,padding:"10px 14px",fontSize:12,flex:"1 1 280px",maxWidth:420}}>
              <span style={{color:t.accent,fontWeight:700}}>{k}: </span>
              <span style={{color:t.text}}>{Array.isArray(v)?v.join(", "):v}</span></div>))}
        </div>
        <button onClick={()=>onDelete(i)} style={{marginTop:14,padding:"8px 16px",borderRadius:8,background:"rgba(220,38,38,0.05)",
          color:t.danger,border:"1px solid rgba(220,38,38,0.15)",cursor:"pointer",fontSize:12,fontWeight:600}}>
          Delete Response</button>
      </div>)}
    </div>))}
  </div>);
}

// ── Main App ──
export default function SLINTSurvey(){
  const[view,setView]=useState("survey");
  const[cur,setCur]=useState(0);
  const[ans,setAns]=useState({});
  const[rs,setRs]=useState([]);
  const[done,setDone]=useState(false);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("slint-responses");if(r)setRs(JSON.parse(r.value));}catch(e){}setLoading(false);})();},[]);
  const save=async(d)=>{try{await window.storage.set("slint-responses",JSON.stringify(d));}catch(e){}};

  const vis=useMemo(()=>{const b=ans.B1||[];return SECTIONS.filter(s=>{if(!s.conditional)return true;
    if(s.conditional==="Student")return b.includes("Student");
    if(s.conditional==="Government / Public Sector Official")return b.includes("Government / Public Sector Official");
    if(s.conditional==="Corporate Employer / HR Decision Maker")return b.includes("Corporate Employer / HR Decision Maker")||b.includes("Business Owner / Entrepreneur");
    return true;});},[ans.B1]);

  const sec=vis[cur];const qs=sec?QUESTIONS[sec.id]||[]:[];
  const prog=vis.length?((cur+1)/vis.length)*100:0;
  const setA=useCallback((id,v)=>setAns(p=>({...p,[id]:v})),[]);

  const submit=async()=>{setSaving(true);const e={...ans,timestamp:new Date().toISOString(),id:Date.now().toString()};
    const u=[...rs,e];setRs(u);await save(u);setSaving(false);setDone(true);};
  const del=async(i)=>{const u=rs.filter((_,j)=>j!==i);setRs(u);await save(u);};
  const reset=()=>{setAns({});setCur(0);setDone(false);};

  if(loading)return(<div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{color:t.accent,fontSize:16,fontWeight:600}}>Loading...</div></div>);

  return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",color:t.text}}>
      {/* Banner */}
      <Banner/>

      {/* Nav */}
      <div style={{background:"#FFFFFF",borderBottom:`1px solid ${t.border}`,padding:"0 24px",position:"sticky",top:0,zIndex:100,
        boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:50}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src="https://slint.org/wp-content/uploads/2023/02/88616-01-150x150.png" alt="SLINT"
              style={{width:28,height:28,borderRadius:6}} onError={e=>{e.target.style.display='none'}}/>
            <span style={{fontSize:13,fontWeight:700,color:t.accent,letterSpacing:1}}>SLINT DIAGNOSTIC</span>
          </div>
          <div style={{display:"flex",gap:2}}>
            {["survey","dashboard","responses"].map(v=>(
              <button key={v} onClick={()=>setView(v)}
                style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,
                  fontWeight:view===v?700:400,background:view===v?"rgba(27,79,114,0.07)":"transparent",
                  color:view===v?t.accent:t.mid,transition:"all 0.15s",textTransform:"capitalize"}}>
                {v}{v==="responses"&&rs.length>0&&<span style={{marginLeft:6,padding:"2px 7px",borderRadius:10,fontSize:10,
                  background:t.accent,color:"#fff",fontWeight:700}}>{rs.length}</span>}
              </button>))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px 80px"}}>
        {/* Survey */}
        {view==="survey"&&(done?(
          <div style={{textAlign:"center",padding:80}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(27,79,114,0.07)",display:"inline-flex",
              alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{fontSize:26,fontWeight:700,color:t.accent,marginBottom:12}}>Thank You</div>
            <div style={{fontSize:14,color:t.mid,marginBottom:36,maxWidth:520,margin:"0 auto 36px",lineHeight:1.7}}>
              Your response has been recorded. SLINT leadership will use this data to strengthen professional standards, capital access, and industry collaboration across Sierra Leone's tech ecosystem.
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={reset} style={{padding:"12px 28px",borderRadius:10,background:t.accent,color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,boxShadow:t.sh}}>Submit Another</button>
              <button onClick={()=>setView("dashboard")} style={{padding:"12px 28px",borderRadius:10,background:"transparent",color:t.accent,border:`1.5px solid ${t.accent}`,cursor:"pointer",fontSize:14,fontWeight:600}}>View Dashboard</button>
            </div>
          </div>
        ):(
          <div>
            {cur===0&&(
              <div style={{background:"#FFFFFF",borderRadius:16,padding:32,marginBottom:28,border:"1px solid rgba(0,0,0,0.06)",
                boxShadow:t.sh,borderLeft:`4px solid ${t.accent}`}}>
                <div style={{fontSize:17,fontWeight:700,color:t.accent,marginBottom:10}}>Welcome to the SLINT Institutional Diagnostic</div>
                <div style={{fontSize:14,color:t.mid,lineHeight:1.8}}>
                  As SLINT enters its next phase of institutional development, we are conducting a forward-looking diagnostic to strengthen professional standards, capital access, government collaboration, and industry participation across Sierra Leone's technology ecosystem. This is a structural design exercise focused on long-term institutional excellence. Your responses will help design sustainable systems for the next decade.
                </div>
                <div style={{marginTop:14,fontSize:13,color:t.accent,fontWeight:600}}>— SLINT Executive 2026–2029</div>
              </div>
            )}

            {/* Progress */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
              <div style={{flex:1,height:4,borderRadius:2,background:"#E5E7EB",overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${t.accent},${t.green})`,
                  width:`${prog}%`,transition:"width 0.4s ease"}}/></div>
              <div style={{fontSize:12,color:t.mid,fontWeight:600,whiteSpace:"nowrap"}}>{cur+1} / {vis.length}</div>
            </div>

            {/* Section Pills */}
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:24}}>
              {vis.map((s,i)=>(
                <button key={s.id} onClick={()=>setCur(i)}
                  style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${i===cur?t.accent:t.border}`,
                    background:i===cur?"rgba(27,79,114,0.07)":i<cur?"rgba(27,79,114,0.02)":"#FFFFFF",
                    color:i===cur?t.accent:i<cur?t.accentL:t.dim,cursor:"pointer",fontSize:11,
                    fontWeight:i===cur?700:400,transition:"all 0.15s"}}>{s.id}</button>))}
            </div>

            {sec&&(<div style={{marginBottom:24}}>
              <div style={{fontSize:11,color:t.accentL,fontWeight:700,letterSpacing:2,marginBottom:4}}>SECTION {sec.id}</div>
              <div style={{fontSize:22,fontWeight:700,color:t.text}}>{sec.title}</div>
              {sec.required&&<div style={{fontSize:12,color:t.gold,marginTop:6,fontWeight:600}}>Required — all fields must be completed</div>}
            </div>)}

            {qs.map(q=><QCard key={q.id} q={q} value={ans[q.id]} onChange={v=>setA(q.id,v)} answers={ans}/>)}

            <div style={{display:"flex",justifyContent:"space-between",marginTop:36}}>
              <button onClick={()=>setCur(Math.max(0,cur-1))} disabled={cur===0}
                style={{padding:"12px 28px",borderRadius:10,background:cur===0?"transparent":"#FFFFFF",
                  color:cur===0?t.dim:t.text,border:`1.5px solid ${t.border}`,
                  cursor:cur===0?"default":"pointer",fontSize:14,fontWeight:500,
                  boxShadow:cur===0?"none":t.sh}}>Previous</button>
              {cur<vis.length-1?(
                <button onClick={()=>setCur(cur+1)}
                  style={{padding:"12px 28px",borderRadius:10,background:t.accent,color:"#fff",border:"none",
                    cursor:"pointer",fontSize:14,fontWeight:600,boxShadow:t.sh}}>Next Section</button>
              ):(
                <button onClick={submit} disabled={saving||!ans.A1||!ans.A2}
                  style={{padding:"12px 28px",borderRadius:10,
                    background:(!ans.A1||!ans.A2)?"#E5E7EB":t.accent,
                    color:(!ans.A1||!ans.A2)?t.dim:"#fff",border:"none",
                    cursor:(!ans.A1||!ans.A2)?"default":"pointer",fontSize:14,fontWeight:700,
                    boxShadow:t.sh}}>{saving?"Saving...":"Submit Response"}</button>
              )}
            </div>
          </div>
        ))}

        {view==="dashboard"&&(<div>
          <div style={{marginBottom:28}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text}}>SLINT Ecosystem Dashboard</div>
            <div style={{fontSize:13,color:t.mid,marginTop:6}}>Live analytics from diagnostic responses — publishable as the SLINT 2026 Sierra Leone Tech Ecosystem Report</div>
          </div><Dash responses={rs}/></div>)}

        {view==="responses"&&(<div>
          <div style={{marginBottom:28}}>
            <div style={{fontSize:22,fontWeight:700,color:t.text}}>Response Manager</div>
            <div style={{fontSize:13,color:t.mid,marginTop:6}}>View, inspect, and export all collected responses with cluster tagging</div>
          </div><RTable responses={rs} onDelete={del}/></div>)}
      </div>

      {/* Footer */}
      <div style={{background:"#FFFFFF",borderTop:`1px solid ${t.border}`,padding:"20px 24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <img src="https://slint.org/wp-content/uploads/2023/02/88616-01-150x150.png" alt="" style={{width:20,height:20,borderRadius:4}} onError={e=>{e.target.style.display='none'}}/>
          <span style={{fontSize:12,color:t.dim}}>SLINT — Sierra Leoneans in Technology · Institutional Diagnostic 2026–2029 · Members Only</span>
        </div>
      </div>
    </div>
  );
}
