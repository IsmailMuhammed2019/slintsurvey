"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/components/login-modal";
import "./report.css";

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="report-body">
      {/* Premium Header */}
      <header className="report-header">
        <div className="report-header-inner">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="SLINT Logo" width={50} height={50} className="object-contain" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-[0.1em] text-[#1B4F72]">SLINT</span>
              <p className="text-[9px] tracking-[0.2em] text-slate-500 uppercase leading-none">Sierra Leoneans in Technology</p>
            </div>
          </div>
          <div className="report-nav-btns">
            <button onClick={() => setIsLoginOpen(true)} className="report-btn-secondary">
              Member Login
            </button>
            <Link href="/survey" className="report-btn-primary">
              Start Survey
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ COVER ═══ */}
      <div className="report-cover">
        <img src="https://slint.org/wp-content/uploads/2023/02/88616-01-150x150.png" alt="SLINT" />
        <div className="org">Sierra Leone Innovation & Technology Society</div>
        <h1>Membership Diagnostic Report</h1>
        <div className="report-cdv"></div>
        <div className="sub">Community Intelligence, Ecosystem Analysis, Benchmarking & Strategic Roadmap</div>
        <div className="dt">2026–2029 Strategic Term &nbsp;|&nbsp; March 2026</div>
        <div className="report-csr">
          <div className="report-cs"><div className="cn">65%</div><div className="cl">Funding Need</div></div>
          <div className="report-cs"><div className="cn">95%</div><div className="cl">Card Interest</div></div>
          <div className="report-cs"><div className="cn">55%</div><div className="cl">Leadership Ready</div></div>
          <div className="report-cs"><div className="cn">0%</div><div className="cl">Say "Not Needed"</div></div>
        </div>
        <p style={{ position: 'absolute', bottom: '14px', fontSize: '8px', opacity: '.25', width: '100%', left: 0, textAlign: 'center' }}>
          SLINT Executive Research & Diagnostic Unit | slint.org
        </p>
      </div>

      {/* ═══ 1. EXECUTIVE SUMMARY ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 1</div><h2>Executive Summary</h2></div>
        <div className="report-sb">
          <div className="report-sr">
            <div className="report-sc"><div className="sv" style={{ color: '#C8910A' }}>65%</div><div className="sl">Need Funding</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#1ABC9C' }}>95%</div><div className="sl">Card Interest</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#2E86C1' }}>55%</div><div className="sl">Committee Ready</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#1B4F72' }}>2.45</div><div className="sl">Avg Roles</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#DC2626' }}>0%</div><div className="sl">"Not Needed"</div></div>
          </div>

          <p className="report-pr">The SLINT Membership Diagnostic was conceived as more than a satisfaction survey. It was designed as a one-time structural listening exercise — a comprehensive instrument covering 18 thematic sections and over 100 individual data points — deployed to approximately 300 contacts across the SLINT ecosystem during the 2026–2029 leadership transition. The diagnostic asked respondents not only who they are, but what they need, what they can contribute, what structures they value, and where the ecosystem's deepest gaps lie.</p>

          <p className="report-pr">The findings reveal a community that is <b>highly entrepreneurial</b> (45% startup founders, 35% business owners), <b>globally distributed</b> (60% based outside Freetown, spanning the US East Coast, West Africa, and beyond), <b>experienced</b> (60% with 5+ years), <b>capital-seeking</b> (65% with current or near-term needs), and <b>structurally hungry</b> (95% want the SLINT card, 90% support enforceable professional standards, 55% are ready for committee-level involvement).</p>

          <p className="report-pr">But perhaps the most telling finding is not any single percentage. It is that when members were asked what they want most from SLINT, <b>mentorship ranked number one — above direct capital access</b>. In a community where 65% need funding, the fact that guidance outranks money as the top ask tells us something profound: this community understands that capital without execution capacity is wasted. They are asking for an ecosystem, not a chequebook.</p>

          <div className="report-co">
            <h4>Why This Report Matters Now</h4>
            <p>This diagnostic lands at a convergence of national momentum unprecedented in Sierra Leone's digital history. The World Bank approved <b>US$137 million for WARDIP2</b> on 10 March 2026. The <b>US$50 million SLDTP</b> has connected 50 government MDAs to broadband. The <b>US$150 million F&#x25B;lei TechCity</b> is advancing in Bo District. The <b>20th ECOWAS ICT Ministerial</b> is convening in Freetown. An <b>AI Readiness Assessment</b> is underway. The <b>NC3</b> is producing cybersecurity-certified professionals. The <b>Invest Salone</b> study identifies the ecosystem as "poised for growth." The infrastructure investment is arriving. The question this report answers is whether the human capital, entrepreneurial talent, and institutional coordination layer is ready to match it. The answer, with caveats this report addresses directly, is yes.</p>
          </div>
        </div>
      </div>

      {/* ═══ 2. METHODOLOGY ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 2</div><h2>Methodology: How the Diagnostic Was Built</h2></div>
        <div className="report-sb">
          <p className="report-pr">The diagnostic was not assembled from generic templates. It was purpose-built to answer institutional design questions that SLINT's incoming leadership identified as prerequisites for credible programme development. The instrument was structured across 18 sections, each targeting a specific ecosystem dimension:</p>

          <p className="report-pr"><b>Sections A–B (Identity and Profile)</b> captured who is in the network — not by single labels, but through multi-select professional identity mapping. Respondents could identify as a startup founder AND an industry professional AND a diaspora actor simultaneously. This design choice was deliberate: it forces the data to reveal the multi-layered nature of the ecosystem rather than flattening members into single categories.</p>

          <p className="report-pr"><b>Section C (Engagement)</b> asked how members want to participate — from committee leadership to general volunteering — providing the raw material for governance architecture.</p>

          <p className="report-pr"><b>Sections D and H (Priorities and Expectations)</b> used forced-choice limits (select up to 3 priorities; select up to 5 expectations) to prevent "everything is important" responses and surface genuine prioritisation signals.</p>

          <p className="report-pr"><b>Section G (Business Growth and Capital)</b> was the most complex section, employing conditional logic: respondents who indicated they operate a business were routed to business stage, revenue, and growth questions; those planning to start were routed to barrier identification; and funding-seekers were routed to range, type, use, and partnership geography questions. This architecture generates layered, actionable capital demand data rather than flat yes/no signals.</p>

          <p className="report-pr"><b>Sections I, J, and L</b> activated conditionally for students, government officials, and corporate employers respectively — ensuring that specialised questions reached only relevant respondents while keeping the instrument manageable for others.</p>

          <p className="report-pr"><b>Sections K and M (Standards and Engagement Design)</b> explored professional credentialing, ethics infrastructure, membership card design, and participation preferences — generating the institutional design data needed to build SLINT's governance and value-delivery architecture.</p>

          <p className="report-pr"><b>Section Q (National Constraints)</b> asked respondents to identify up to five ecosystem barriers, producing a severity-ranked constraint map that can be presented directly to government and DFI stakeholders.</p>

          <p className="report-pr">The diagnostic was distributed via the SLINT WhatsApp community and associated professional networks, with secure token-authenticated access through a dedicated web platform. The leadership established in advance that respondents represent the engaged voice of the community — the segment most likely to drive implementation — and their insights are therefore used to guide strategic planning.</p>
        </div>
      </div>

      {/* ═══ 3. NATIONAL CONTEXT ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 3</div><h2>Sierra Leone's Digital Moment: The Investment Convergence</h2></div>
        <div className="report-sb">
          <div className="report-sr">
            <div className="report-sc"><div className="sv" style={{ color: '#1B4F72' }}>8.7M</div><div className="sl">Population</div><div className="su">Median age: 19.7</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#DC2626' }}>~21%</div><div className="sl">Internet</div><div className="su">vs 72.5% global</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#2E86C1' }}>$50M</div><div className="sl">SLDTP</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#1ABC9C' }}>$137M</div><div className="sl">WARDIP2</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#C8910A' }}>$150M</div><div className="sl">TechCity</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#8E44AD' }}>93%</div><div className="sl">National ID</div></div>
          </div>

          <p className="report-pr">Sierra Leone is experiencing something it has never had before: simultaneous, multi-source investment in its digital economy from the World Bank, bilateral partners, the private sector, and the government itself. Understanding the SLINT diagnostic requires understanding this convergence, because the diagnostic findings do not exist in a vacuum — they speak directly to whether Sierra Leone's human and entrepreneurial capital is ready to absorb and benefit from this investment.</p>

          <p className="report-pr"><b>The infrastructure story is real but incomplete.</b> Internet penetration has grown from 2.5% in 2015 to approximately 21% in 2025 — significant progress, but still less than the Sub-Saharan African average of approximately 36% and far below the global average of 72.5%. The SLDTP (US$50M) has connected 50 government MDAs to broadband. WARDIP2 (US$137M, approved 10 March 2026) targets 5.2 million people connected and 5.4 million new digital service users. F&#x25B;lei TechCity (US$150M) envisions a 130-acre special economic zone with incubation, BPO, data centre, and training facilities.</p>

          <p className="report-pr"><b>But infrastructure without people is just equipment.</b> The question SLINT's diagnostic answers is: does the human layer exist to make this infrastructure productive? The answer is nuanced. The talent exists — but it is fragmented, under-credentialed, under-funded, and under-coordinated. That is exactly what SLINT is positioned to address.</p>

          <table className="report-table">
            <thead>
              <tr><th>Year</th><th>SL Internet</th><th>SSA Average</th><th>Gap</th><th>What Was Happening</th></tr>
            </thead>
            <tbody>
              <tr><td>2015</td><td>2.5%</td><td>~18%</td><td style={{ color: '#DC2626' }}>-15.5 pts</td><td style={{ fontSize: '9px', color: '#64748B' }}>Post-Ebola recovery period</td></tr>
              <tr><td>2019</td><td>~13%</td><td>~28%</td><td style={{ color: '#DC2626' }}>-15 pts</td><td style={{ fontSize: '9px', color: '#64748B' }}>DSTI established; early digital policy</td></tr>
              <tr><td>2023</td><td>20.6%</td><td>~36%</td><td style={{ color: '#DC2626' }}>-15.4 pts</td><td style={{ fontSize: '9px', color: '#64748B' }}>SLDTP begins; Employment Act 2023</td></tr>
              <tr><td>2025</td><td>~21%</td><td>~38%</td><td style={{ color: '#DC2626' }}>-17 pts</td><td style={{ fontSize: '9px', color: '#64748B' }}>50 MDAs connected; AI assessment; WARDIP2 approved</td></tr>
            </tbody>
          </table>

          <div className="report-co t">
            <h4>The Youth Imperative</h4>
            <p>Approximately 70% of Sierra Leone's youth (~2.5 million) are underemployed or unemployed. The Employment Act 2023 mandates local content (Section 9) and training succession plans. Sierra Leone's 93% national ID coverage — exceeding Nigeria (~50%) — provides a strong digital identity foundation. These structural realities make SLINT's skills, credentialing, and entrepreneurship programming not merely an association initiative but a national development priority. Every finding in this diagnostic should be read against this backdrop.</p>
          </div>

          <p className="report-h3s">Active National Programmes</p>
          <p className="report-pr"><b>SLDTP</b> (US$50M, 2022–2027): Broadband expansion, digital skills, e-government, enabling environment. Connected 50 MDAs. <b>WARDIP2</b> (US$137M, March 2026): 5.2M connected, 5.4M digital users, cross-border services. <b>F&#x25B;lei TechCity</b> ($150M): 130-acre SEZ — incubation, BPO, data centre (Africell), training. <b>Also:</b> AI Readiness Assessment (Compute, Capacity, Context); NC3 cyber certifications; Nigeria–SL Digital Bilateral; blockchain MoU (MoCTI–SIGN); Big 5 Innovation Challenge; ECOWAS ICT Ministerial (Freetown, March 2026); Invest Salone ecosystem study (fintech as priority sector; SL startups: 15 of 30 at 2024 Startup World Cup).</p>
        </div>
      </div>

      {/* ═══ 4. CONTINENTAL VC ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 4</div><h2>The Continental Capital Landscape: Where Sierra Leone Fits</h2></div>
        <div className="report-sb">
          <div className="report-sr">
            <div className="report-sc"><div className="sv" style={{ color: '#1B4F72' }}>$4.1B</div><div className="sl">Total Africa</div><div className="su">2025, Partech</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#C8910A' }}>$1.64B</div><div className="sl">Debt Record</div><div className="su">41% of total</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#2E86C1' }}>72%</div><div className="sl">Big Four</div><div className="su">KE, ZA, EG, NG</div></div>
          </div>

          <p className="report-pr">To understand SLINT's capital demand data, it must be positioned against continental reality. African tech funding reached approximately US$4.1 billion in 2025 (Partech), a 25% YoY rebound — but this headline obscures critical structural facts. Debt financing hit a record US$1.64 billion (41% of total), meaning much of the "rebound" was driven by structured finance for already-scaled companies, not new equity for early-stage ventures. The "Big Four" — Kenya, South Africa, Egypt, Nigeria — captured 72% of total funding. Countries outside these four typically recorded fewer than 25 equity transactions per year.</p>

          <div className="report-cc">
            <h3>2025 Africa Tech VC by Market (US$M)</h3>
            <div className="report-br"><div className="report-bl">Kenya</div><div className="report-bt"><div className="report-bf" style={{ width: '85%', background: '#1B4F72' }}>$1,040M</div></div></div>
            <div className="report-br"><div className="report-bl">South Africa</div><div className="report-bt"><div className="report-bf" style={{ width: '58%', background: '#2E86C1' }}>$715M</div></div></div>
            <div className="report-br"><div className="report-bl">Egypt</div><div className="report-bt"><div className="report-bf" style={{ width: '49%', background: '#1ABC9C' }}>$604M</div></div></div>
            <div className="report-br"><div className="report-bl">Nigeria</div><div className="report-bt"><div className="report-bf" style={{ width: '47%', background: '#27AE60' }}>$572M</div></div></div>
            <div className="report-br"><div className="report-bl">Rest of Africa</div><div className="report-bt"><div className="report-bf" style={{ width: '95%', background: '#94A3B8' }}>$1,169M</div></div></div>
          </div>

          <p className="report-pr"><b>Sierra Leone does not yet appear in continental VC tracking.</b> This is not because Sierra Leonean entrepreneurs lack ambition — this diagnostic proves they have it. It is because the ecosystem lacks the institutional coordination, investor-readiness infrastructure, and deal-flow visibility that would make Sierra Leonean ventures visible to the tracking systems that shape continental investor attention. The Invest Salone study (January 2026) confirms the country's ecosystem is "poised for growth" and notes Sierra Leonean startups comprised 15 of 30 at the 2024 Startup World Cup. <b>SLINT's role is to build the pre-investment layer</b> — founder readiness, pitch discipline, investor matching, and deal-flow visibility — so that Sierra Leonean ventures can enter continental capital flows rather than waiting for capital to discover Freetown.</p>
        </div>
      </div>

      {/* ═══ 5. WHO IS SLINT? ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 5</div><h2>Who Is SLINT? A Community Profile in Depth</h2></div>
        <div className="report-sb">
          <p className="report-pr">The diagnostic asked respondents to identify all professional roles that currently describe them — deliberately permitting multi-selection. This design choice reveals that SLINT is not a community of single-identity professionals. It is a network of people who simultaneously build ventures, practice professionally, connect diaspora resources, advise institutions, and mentor emerging talent. The average respondent selected <b>2.45 roles</b>. That single number is one of the most strategically significant findings in the report.</p>

          <div className="report-cc">
            <h3>Professional Identity (% selecting each)</h3>
            <div className="report-br"><div className="report-bl">Industry Professional</div><div className="report-bt"><div className="report-bf" style={{ width: '83%', background: '#1B4F72' }}>50%</div></div></div>
            <div className="report-br"><div className="report-bl">Startup Founder</div><div className="report-bt"><div className="report-bf" style={{ width: '75%', background: '#2E86C1' }}>45%</div></div></div>
            <div className="report-br"><div className="report-bl">Business Owner</div><div className="report-bt"><div className="report-bf" style={{ width: '58%', background: '#1ABC9C' }}>35%</div></div></div>
            <div className="report-br"><div className="report-bl">Diaspora Professional</div><div className="report-bt"><div className="report-bf" style={{ width: '50%', background: '#27AE60' }}>30%</div></div></div>
            <div className="report-br"><div className="report-bl">Student</div><div className="report-bt"><div className="report-bf" style={{ width: '33%', background: '#F39C12' }}>20%</div></div></div>
          </div>
          
          <p className="report-pr"><b>What the diagnostic asked:</b> "Which best describes you currently?" with 11 options and the instruction to select all that apply. <b>What the community told us:</b> Half are private-sector professionals. Nearly half are startup founders. A third own businesses. A third are diaspora-connected.</p>

          <div className="report-cc">
            <h3>Experience Distribution</h3>
            <div className="report-br"><div className="report-bl">10+ years</div><div className="report-bt"><div className="report-bf" style={{ width: '58%', background: '#1B4F72' }}>35%</div></div></div>
            <div className="report-br"><div className="report-bl">5–10 years</div><div className="report-bt"><div className="report-bf" style={{ width: '42%', background: '#2E86C1' }}>25%</div></div></div>
            <div className="report-br"><div className="report-bl">2–5 years</div><div className="report-bt"><div className="report-bf" style={{ width: '42%', background: '#1ABC9C' }}>25%</div></div></div>
            <div className="report-br"><div className="report-bl">Under 2 years</div><div className="report-bt"><div className="report-bf" style={{ width: '25%', background: '#94A3B8' }}>15%</div></div></div>
          </div>

          <div className="report-co">
            <h4>Action Point: National and Diaspora Visibility Campaign</h4>
            <p>SLINT will launch a multi-channel membership drive including <b>outdoor billboards</b>, <b>TV and radio jingles</b>, and <b>chapter launch events</b> in DC, New York, London, and Lagos. The goal: increase active membership to 500+ verified members within the first 12 months.</p>
          </div>
        </div>
      </div>

      {/* ═══ 6. CAPITAL ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 6</div><h2>Capital Demand: What Members Need</h2></div>
        <div className="report-sb">
          <div className="report-sr">
            <div className="report-sc"><div className="sv" style={{ color: '#DC2626' }}>45%</div><div className="sl">Seeking Now</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#C8910A' }}>20%</div><div className="sl">Within 12 Mo</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#1B4F72' }}>30%</div><div className="sl">$10K–$50K</div><div className="su">Catalytic zone</div></div>
            <div className="report-sc"><div className="sv" style={{ color: '#1ABC9C' }}>10%</div><div className="sl">$1M+</div><div className="su">Scaling</div></div>
          </div>

          <div className="report-cc">
            <h3>Funding Range Distribution (%)</h3>
            <div className="report-br"><div className="report-bl">Under $10K</div><div className="report-bt"><div className="report-bf" style={{ width: '33%', background: '#2E86C1' }}>20%</div></div></div>
            <div className="report-br"><div className="report-bl" style={{ fontWeight: 700 }}>$10K–$50K</div><div className="report-bt"><div className="report-bf" style={{ width: '50%', background: '#1B4F72' }}>30% Catalytic</div></div></div>
            <div className="report-br"><div className="report-bl">$1M+</div><div className="report-bt"><div className="report-bf" style={{ width: '17%', background: '#1ABC9C' }}>10%</div></div></div>
          </div>

          <div className="report-co g">
            <h4>How Rwanda Addressed This</h4>
            <p>Rwanda's ICT Chamber works with regulators to establish favourable policies and mobilises seed capital for early-stage startups. SLINT can propose equivalent structures to the World Bank SLDTP and WARDIP2 managers.</p>
          </div>
        </div>
      </div>

      {/* ═══ 7. MEMBERSHIP & STANDARDS ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 7</div><h2>Professional Identity: The Card & Standards</h2></div>
        <div className="report-sb">
          <p className="report-pr">95% would register for a SLINT membership card. 90% support enforceable professional standards. Zero per cent said a standards body is "not necessary."</p>
          
          <div className="report-cc">
            <h3>Membership Card Interest (%)</h3>
            <div className="report-br"><div className="report-bl">If Benefits</div><div className="report-bt"><div className="report-bf" style={{ width: '83%', background: '#1B4F72' }}>50%</div></div></div>
            <div className="report-br"><div className="report-bl">Immediately</div><div className="report-bt"><div className="report-bf" style={{ width: '58%', background: '#1ABC9C' }}>35%</div></div></div>
            <div className="report-br"><div className="report-bl">If Employers</div><div className="report-bt"><div className="report-bf" style={{ width: '17%', background: '#2E86C1' }}>10%</div></div></div>
          </div>

          <div className="report-co">
            <h4>Action Points: Membership Card and Professional Standards</h4>
            <p>Launch tiered membership. Deploy the SLINT Membership Card as a professional access credential. Establish a Code of Ethics and Verified Member Registry. Pursue government-recognised advisory status.</p>
          </div>
        </div>
      </div>

      {/* ═══ 8. LEADERSHIP ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 8</div><h2>Leadership and Engagement</h2></div>
        <div className="report-sb">
          <div className="report-cc">
            <h3>Time Commitment (%)</h3>
            <div className="report-br"><div className="report-bl">10–25 hrs</div><div className="report-bt"><div className="report-bf" style={{ width: '50%', background: '#1B4F72' }}>30%</div></div></div>
            <div className="report-br"><div className="report-bl">Committee</div><div className="report-bt"><div className="report-bf" style={{ width: '42%', background: '#2E86C1' }}>25%</div></div></div>
            <div className="report-br"><div className="report-bl">25–50 hrs</div><div className="report-bt"><div className="report-bf" style={{ width: '25%', background: '#1ABC9C' }}>15%</div></div></div>
          </div>
          
          <p className="report-pr">55% are willing to serve at committee level or commit 25+ hours annually. This is exceptional and provides SLINT with the human capital needed to scale.</p>

          <div className="report-co">
            <h4>Action Points: Governance Architecture</h4>
            <p>Establish standing committees with TORs: Membership, Skills, Diaspora, Policy, Founders, Corporate, and Communications. Activate Chapters in DC, London, and Lagos.</p>
          </div>
        </div>
      </div>

      {/* ═══ 9. PRIORITIES ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 9</div><h2>What Should SLINT Do? Priorities</h2></div>
        <div className="report-sb">
          <div className="report-cc">
            <h3>Priority Programming Areas</h3>
            <div className="report-br"><div className="report-bl">Entrepreneurship</div><div className="report-bt"><div className="report-bf" style={{ width: '90%', background: '#1ABC9C' }}>Very High</div></div></div>
            <div className="report-br"><div className="report-bl">AI & Emerging</div><div className="report-bt"><div className="report-bf" style={{ width: '85%', background: '#1ABC9C' }}>Very High</div></div></div>
            <div className="report-br"><div className="report-bl">Cybersecurity</div><div className="report-bt"><div className="report-bf" style={{ width: '75%', background: '#27AE60' }}>High</div></div></div>
          </div>

          <div className="report-co">
            <h4>The Mentorship Insight</h4>
            <p>While 65% need funding, <b>mentorship ranks number one</b> — above direct capital access. SLINT will build a structured mentoring programme pairing experienced members with earlier-stage founders.</p>
          </div>
        </div>
      </div>

      {/* ═══ 16. ROADMAP ═══ */}
      <div className="report-pg">
        <div className="report-sh"><div className="sn">SECTION 16</div><h2>Implementation Roadmap</h2></div>
        <div className="report-sb">
          <table className="report-table">
            <thead>
              <tr><th>Phase</th><th>Timeline</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ fontWeight: 700, color: '#1B4F72' }}>Foundation</td><td>Days 1–30</td><td>Membership framework. Publish diagnostic. Announce committees.</td></tr>
              <tr><td style={{ fontWeight: 700, color: '#2E86C1' }}>Structure</td><td>Days 31–60</td><td>Committees with TORs. Registration portal. Chapter leadership named.</td></tr>
              <tr><td style={{ fontWeight: 700, color: '#1ABC9C' }}>Activation</td><td>Days 61–90</td><td>First Founder Showcase. Skills Workshop. Billboard rollout in Freetown.</td></tr>
            </tbody>
          </table>

          <div className="report-fban">
            <h3>The Diagnostic Has Provided the Foundation.</h3>
            <p>The community is ready. The ecosystem is aligned. The national digital agenda is accelerating. We are building the coordination layer of Sierra Leone's innovation future.</p>
            <p className="cp">Copyright 2026 | SLINT | slint.org | All Rights Reserved</p>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
