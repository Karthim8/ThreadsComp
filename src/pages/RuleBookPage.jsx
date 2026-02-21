import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Menu, X, Download } from 'lucide-react';

/* ─────────────────────────────────────────────
   ALL RULE-BOOK CONTENT
───────────────────────────────────────────── */
const SECTIONS = [
    {
        id: 'dept',
        tag: 'COVER',
        color: '#00D9FF',
        title: "THREADS'26 RULE BOOK",
        subtitle: 'Department of Computer Science and Engineering',
        content: [
            { type: 'cover-sub', text: 'B.E. CSE · B.E. CSE(AIML) · B.E. CSD · B.Tech. CSBS · B.E. CSE(SCE)' },
            { type: 'cover-year', text: 'March 5–6, 2026 · Sona College of Technology' },
        ],
    },
    {
        id: 'tech-header',
        tag: 'SECTION',
        color: '#00D9FF',
        title: 'TECHNICAL EVENTS',
        subtitle: '',
        content: [{ type: 'section-divider', text: 'The following pages contain rules for all technical events.' }],
    },
    {
        id: 'paper',
        tag: 'T-01',
        color: '#00D9FF',
        title: 'PAPER PRESENTATION',
        subtitle: 'Rules and Regulations',
        organizers: ['Bhagyashree S', 'Grace Christel C', 'Harini G S'],
        note: 'Mail your paper, PPT, and queries to the organizers — mention "Paper Presentation – CSE-A" in the subject line.',
        content: [
            { type: 'rule', n: 1, text: 'Maximum number of participants in a team is 3 (teams of up to 3 members or individual participation allowed).' },
            { type: 'rule', n: 2, text: 'Participants can choose any recent or emerging topic in Computer Science (AI & ML, Cybersecurity, Data Science & Big Data, Cloud Computing & IoT, Blockchain, Robotics, AR/VR, Green Computing, Web Technologies, Software Engineering, etc.).' },
            { type: 'rule', n: 3, text: 'The full paper must follow IEEE format, be 6–8 pages in length, and include: Title & Author Details, Abstract, Introduction, Methodology/Proposed Concept, Applications/Use Cases, Conclusion & Future Scope, References.' },
            { type: 'rule', n: 4, text: 'The paper must be original, plagiarism-free, and properly cited. Any plagiarism will lead to disqualification.' },
            { type: 'rule', n: 5, text: 'Prepare a PowerPoint presentation with clear diagrams, charts, and bullet points. Avoid long paragraphs on slides. Do not read directly from slides.' },
            { type: 'rule', n: 6, text: 'Time limit: 7 minutes for presentation + 3 minutes for Q&A (strictly enforced).' },
            { type: 'rule', n: 7, text: 'Submit soft copies of: Research paper (PDF format) & PowerPoint presentation file before the deadline. Late submissions not accepted.' },
            { type: 'rule', n: 8, text: 'The submission email should include: Paper title, Team/participant names, Contact phone number, Email IDs of all members.' },
            { type: 'rule', n: 9, text: 'The first slide of the PPT must contain: Title of the presentation, Names of all team members, Email IDs of team members.' },
            { type: 'rule', n: 10, text: 'Judges will evaluate based on: research quality & technical depth, innovation & originality, clarity & confidence, slide design & quality, ability to answer questions.' },
            { type: 'rule', n: 11, text: 'The decision of the judges is final and no arguments or appeals will be entertained.' },
            { type: 'rule', n: 12, text: 'Participants must maintain professionalism; any misconduct leads to disqualification.' },
        ],
    },
    {
        id: 'codehunt',
        tag: 'T-02',
        color: '#8338EC',
        title: 'CODEHUNT',
        subtitle: 'Web Development Challenge',
        organizers: ['Lokeshwaran R', 'Mohammed Ali A', 'Lithwin Shuji J', 'Lenin S'],
        content: [
            { type: 'subheading', text: 'Team Rules' },
            { type: 'rule', n: 1, text: 'Each team must consist of 2–3 members.' },
            { type: 'rule', n: 2, text: 'No individual participation is allowed.' },
            { type: 'rule', n: 3, text: 'Team members cannot be changed after registration.' },
            { type: 'rule', n: 4, text: 'All participants must carry a valid student ID card.' },
            { type: 'subheading', text: 'Technical Rules' },
            { type: 'rule', n: 1, text: 'Allowed Languages: Python, C++, Java, C (Primary). Other languages (C#, Ruby, etc.) if supported.' },
            { type: 'rule', n: 2, text: 'Only pen and paper allowed for rough work.' },
            { type: 'rule', n: 3, text: 'Mobile phones, smart devices, internet, or external storage strictly prohibited unless permitted.' },
            { type: 'rule', n: 4, text: 'Participants must use only the system/platform assigned by the organizers.' },
            { type: 'subheading', text: 'Round Structure' },
            { type: 'round', round: 'Round 1 – Syntax & Cipher', duration: '50 min', details: '20 questions (MCQs, Flowcharts, Debugging). No negative marking. Top 60% qualify.' },
            { type: 'round', round: 'Round 2 – Patterns & Decryption', duration: '30 min', details: '10 mixed questions (Coding + Puzzle solving). Partial scoring may apply. Top 50% qualify.' },
            { type: 'round', round: 'Round 3 – Final Round', duration: '20 min', details: '3 tasks: Hands-on Coding, Puzzle Assembly, Logical Reasoning. Final results based on accuracy and time.' },
            { type: 'subheading', text: 'Disqualification Criteria' },
            { type: 'bullet', text: 'Plagiarism between teams, use of unfair means, disturbing other participants, or failing to follow coordinator instructions.' },
        ],
    },
    {
        id: 'quiz2quirk',
        tag: 'T-03',
        color: '#00D9FF',
        title: 'QUIZ TO QUIRK',
        subtitle: 'Web Development Challenge',
        organizers: ['Pavinithi N K', 'Pavishya P L', 'Sailekha M', 'Shifana Fathima M', 'Shri Dharshini S'],
        content: [
            { type: 'rule', n: 1, text: 'Each team must consist of exactly 3 members.' },
            { type: 'rule', n: 2, text: 'The event consists of 3 rounds: Basics MCQ, Frontend Project Demo, and Modification & Implementation.' },
            { type: 'round', round: 'Round 1 – Basics MCQ', duration: 'Timed', details: 'MCQs on HTML, CSS, JavaScript basics. Strict time limit per question. Shortlisted teams advance.' },
            { type: 'round', round: 'Round 2 – Frontend Project Demo', duration: 'Timed', details: 'Present your own frontend project (HTML/CSS/JS). Evaluated on UI design, functionality, code quality, explanation.' },
            { type: 'round', round: 'Round 3 – Modification & Implementation', duration: 'Timed', details: 'Real-time challenge — implement specific changes or new features on existing project within allotted time.' },
            { type: 'rule', n: 6, text: 'Strict time limits apply to each round — no extra time will be given.' },
            { type: 'rule', n: 7, text: 'Teams must work independently. Any plagiarism, malpractice, or copying will result in immediate disqualification.' },
            { type: 'rule', n: 8, text: 'Participants must maintain professionalism — any misconduct leads to disqualification.' },
            { type: 'rule', n: 10, text: 'The decision of the judges is final and no arguments or appeals will be entertained.' },
        ],
    },
    {
        id: 'ctf',
        tag: 'T-04',
        color: '#FF2A6D',
        title: 'CAPTURE THE FLAG',
        subtitle: 'CTF – By Byte Busters Club',
        organizers: ['Subash Chandra Bose S', 'Pranesh K K', 'Tanushree T B', 'Karthikeyan R', 'Macernest Antony D'],
        content: [
            { type: 'rule', n: 1, text: 'Each team must consist of exactly 3 members.' },
            { type: 'rule', n: 2, text: 'Team members can collaborate freely within their team and share knowledge among themselves.' },
            { type: 'subheading', text: 'Challenge Categories' },
            { type: 'bullet', text: 'General Questions' },
            { type: 'bullet', text: 'Web Challenges (SQL injection, XSS, broken authentication, etc.)' },
            { type: 'bullet', text: 'Linux, Network & Python Challenges' },
            { type: 'bullet', text: 'Forensic & Cryptography Challenges' },
            { type: 'subheading', text: 'Allowed Resources' },
            { type: 'bullet', text: 'ChatGPT and other AI tools' },
            { type: 'bullet', text: 'YouTube tutorials and demonstrations' },
            { type: 'bullet', text: 'Google searches & official documentation' },
            { type: 'rule', n: 5, text: 'Copying entire previously published solutions or walkthroughs is strictly prohibited.' },
            { type: 'rule', n: 6, text: 'Flags must be submitted in the correct format CTF{flag_content} through the designated platform/portal.' },
            { type: 'rule', n: 7, text: 'The competition has a strict time limit. No extra time will be granted unless announced by organizers.' },
            { type: 'rule', n: 8, text: 'No interference with other teams. No cross-team collaboration.' },
            { type: 'rule', n: 9, text: 'Scoring: Points based on challenge difficulty and time. Tiebreakers: most challenges solved in shortest time.' },
            { type: 'rule', n: 11, text: 'Eligibility restriction: Participants who have already won prizes in previous CTF competitions are NOT eligible.' },
            { type: 'rule', n: 13, text: 'The decisions of the organizers and judges are final and binding — no arguments or appeals.' },
        ],
    },
    {
        id: 'modelmetrics',
        tag: 'T-05',
        color: '#00FFA3',
        title: 'MODEL AND METRICS',
        subtitle: 'Machine Learning Competition',
        organizers: ['Subramanian GPH', 'Mohammed Usman S', 'Lokeshwaran S', 'Mohammedrifath M'],
        content: [
            { type: 'rule', n: 1, text: 'Teams must consist of 2 to 4 members.' },
            { type: 'round', round: 'Round 1 – ML Quiz (Selection)', duration: 'Timed', details: 'Quiz testing supervised/unsupervised learning, feature engineering, performance metrics, and more.' },
            { type: 'round', round: 'Round 2 – Model Presentation (Final)', duration: 'Timed', details: 'In-depth PPT and technical demonstration of the developed predictive model.' },
            { type: 'subheading', text: 'Allowed Resources' },
            { type: 'bullet', text: 'ChatGPT / AI tools, Google AI Studio / Gemini, Google Colab, Kaggle Datasets' },
            { type: 'rule', n: 6, text: 'Copy-pasting full source codes or pre-existing solutions is not allowed — work must be original.' },
            { type: 'subheading', text: 'Round 2 Submission' },
            { type: 'bullet', text: 'Pre-processed Data (cleaned dataset with documented feature engineering steps).' },
            { type: 'bullet', text: 'Trained Model (final model file or script with training logic).' },
            { type: 'bullet', text: 'Tested Model (performance evaluation: Accuracy, F1-Score, RMSE, etc.).' },
            { type: 'rule', n: 9, text: 'Any form of plagiarism, malpractice, or rule violation will result in disqualification.' },
            { type: 'rule', n: 10, text: 'The decision of the judges/organizers is final and no arguments or appeals will be entertained.' },
        ],
    },
    {
        id: 'pixelera',
        tag: 'T-06',
        color: '#8338EC',
        title: 'PIXELERA',
        subtitle: 'Design Through the Ages',
        organizers: ['Nagulan V', 'Siva Sankar C', 'Sabari P', 'Bhuvaneshwaran R'],
        content: [
            { type: 'subheading', text: 'Event Overview' },
            { type: 'para', text: "What if Figma had existed centuries ago? PixelEra challenges participants to reimagine modern digital interfaces as if today's design tools had been available in a completely different historical era." },
            { type: 'subheading', text: 'Eligibility' },
            { type: 'bullet', text: 'Open to students from all departments.' },
            { type: 'bullet', text: 'Participation: Individual or teams of 1–2 members.' },
            { type: 'subheading', text: 'Challenge Format' },
            { type: 'para', text: 'Each team receives a randomly assigned historical era (Ancient Egyptian, Mughal Era, Victorian Era, 1920s Art Deco, 1980s Memphis, Early 1990s Cyberpunk, Edo-period Japan, Bauhaus, etc.) and a modern digital product to redesign.' },
            { type: 'subheading', text: 'Key Constraints' },
            { type: 'bullet', text: 'Stay visually and culturally true to the assigned era (typography, color palette, motifs, layout logic, etc.).' },
            { type: 'bullet', text: 'Apply modern UI/UX principles (hierarchy, accessibility, clear navigation).' },
            { type: 'bullet', text: 'Figma is mandatory — all final work must be done in a Figma file.' },
            { type: 'subheading', text: 'Judging Criteria' },
            { type: 'round', round: 'Era Authenticity', duration: '35%', details: 'How convincingly does it feel like it belongs to the assigned period?' },
            { type: 'round', round: 'Creative Concept & Storytelling', duration: '25%', details: 'Imaginative fusion of era + modern product.' },
            { type: 'round', round: 'Usability & Modern UX Thinking', duration: '20%', details: 'Functional, intuitive, thoughtful design.' },
            { type: 'round', round: 'Visual Craft & Polish', duration: '15%', details: 'Execution quality, consistency, attention to detail.' },
            { type: 'round', round: 'Explanation & Rationale', duration: '5%', details: 'Clarity of thought process.' },
        ],
    },
    {
        id: 'nontech-header',
        tag: 'SECTION',
        color: '#FF2A6D',
        title: 'NON-TECHNICAL EVENTS',
        subtitle: '',
        content: [{ type: 'section-divider', text: 'The following pages contain rules for all non-technical events.' }],
    },
    {
        id: 'sherlock',
        tag: 'N-01',
        color: '#FF2A6D',
        title: 'SHERLOCK HOLMES',
        subtitle: 'Investigative Mystery Competition',
        organizers: ['Bharath S', 'Keerthan Kamath G', 'AkashKumaran S', 'Ranjan M'],
        content: [
            { type: 'rule', n: 1, text: 'Each team must consist of 2 to 4 members.' },
            { type: 'round', round: "Round 1 – Detective's Quiz", duration: 'Timed', details: 'Comprehensive test of investigative concepts — situational logic, forensic science, pattern recognition, and more.' },
            { type: 'round', round: 'Round 2 – Case Presentation', duration: 'Timed', details: 'In-depth PPT presentation and technical demonstration of the developed solution, focusing on logic, methodology, and results.' },
            { type: 'subheading', text: 'Allowed Resources' },
            { type: 'bullet', text: 'Digital Forensic Tools, Evidence Databases, Case Dossiers / Clue Files, Logic Frameworks & Mind Maps.' },
            { type: 'subheading', text: 'Round 2 Submission' },
            { type: 'bullet', text: 'Processed Evidence: Cleaned log of clues with documented deduction steps.' },
            { type: 'bullet', text: 'The Deductive Model: Final case file or script containing the investigative logic.' },
            { type: 'bullet', text: 'Final Verdict: Performance evaluation (Logical Consistency, Motive Accuracy).' },
            { type: 'rule', n: 6, text: 'Teams must work collaboratively to finalize the solution within the given time — no extra time will be provided.' },
            { type: 'rule', n: 7, text: 'The decision of the judges/organizers is final and no arguments or appeals will be entertained.' },
            { type: 'rule', n: 8, text: 'Participants must maintain professionalism and discipline throughout the event.' },
        ],
    },
    {
        id: 'treasure',
        tag: 'N-02',
        color: '#00FFA3',
        title: 'TREASURE HUNT',
        subtitle: 'Mystery · Momentum · Mastery',
        organizers: ['Rakksitha R', 'Joshikaa K', 'Niroshini K'],
        content: [
            { type: 'rule', n: 1, text: 'Teams must consist of 2 to 4 members.' },
            { type: 'round', round: 'Round 1 – The Initiation Phase', duration: 'Multi-Phase', details: 'Time-bound qualifier with three sequential interconnected phases. Phases must be completed in fixed order. Ranked by total completion time.' },
            { type: 'round', round: 'Round 2 – The Final Treasure Hunt', duration: 'Live', details: 'Live, real-world strategic treasure hunt exclusive to qualified teams. Involves navigation, logical reasoning, deduction, and strategic movement.' },
            { type: 'subheading', text: 'Winning Determinants (Round 2)' },
            { type: 'bullet', text: 'Successful completion of the final objective.' },
            { type: 'bullet', text: 'Optimal time and resource utilization.' },
            { type: 'bullet', text: 'Strict compliance with event rules and fair-play standards.' },
            { type: 'rule', n: 6, text: 'Advancement to Round 2 is strictly merit-based — only the fastest and most efficient teams from Round 1 qualify.' },
            { type: 'rule', n: 7, text: 'Any form of malpractice, unfair means, external help, or rule violation will result in immediate disqualification.' },
            { type: 'rule', n: 9, text: 'The decisions of the organizers and judges are final and binding — no arguments or appeals.' },
        ],
    },
    {
        id: 'karaoke',
        tag: 'N-03',
        color: '#00D9FF',
        title: 'KARAOKE BUZZER BATTLE',
        subtitle: 'Music Recognition & Buzzer Competition',
        organizers: ['Mona Rachel D C', 'Kanishka M', 'Kavipriya A S', 'Bhavadharani K', 'Akshaya N'],
        content: [
            { type: 'rule', n: 1, text: 'Each team must consist of exactly 2 members.' },
            { type: 'round', round: 'Round 1 – Find the Song from BGM', duration: 'Buzzer', details: 'Short background music (BGM) clip played. First team to buzz and identify the song name wins.' },
            { type: 'round', round: 'Round 2 – Find the Song from Image', duration: 'Buzzer', details: "An image visually representing or describing a song's lyrics is shown. First team to buzz and name the song wins." },
            { type: 'round', round: 'Round 3 – Find the Missing Line', duration: 'Buzzer', details: 'Song played and paused. First team to buzz and correctly say or sing the next missing line wins.' },
            { type: 'rule', n: 6, text: 'All rounds are strictly buzzer-based. If the answer is incorrect, the question may be passed to another team.' },
            { type: 'rule', n: 9, text: 'No use of mobile phones, external assistance, or shouting answers without buzzing allowed.' },
            { type: 'rule', n: 11, text: 'Points awarded for each correct answer — scoring adjusted based on round difficulty.' },
            { type: 'rule', n: 12, text: 'In case of a tie, a tie-breaker round will be conducted.' },
        ],
    },
    {
        id: 'connections',
        tag: 'N-04',
        color: '#8338EC',
        title: 'CONNECTIONS',
        subtitle: 'Non-Technical – Connection Game',
        organizers: ['Sudharshinee S K', 'Vaishnavi M', 'Valarmathi A', 'Shubhagitha P'],
        content: [
            { type: 'rule', n: 1, text: 'Each team must consist of 2 to 3 participants.' },
            { type: 'round', round: 'Round 1 – Connect the Photo & Find the Song', duration: '30 sec/Q', details: 'Set of images/emojis representing a famous song. Identify the song title. +10 per correct answer (no negative marks).' },
            { type: 'round', round: 'Round 2 – Connect the Clues & Find the Movie', duration: '30–45 sec/Q', details: 'Pictures/characters connected to a movie. +15 per correct answer. Bonus +5 if answered within 10 seconds.' },
            { type: 'round', round: 'Round 3 – Complete the Dialogue / Identify Movie', duration: '20 sec/Q', details: 'Famous movie dialogue with missing words. Complete it or identify the movie/character. +20 per correct answer.' },
            { type: 'rule', n: 6, text: 'Strict time limits apply to each question — late answers will not be counted.' },
            { type: 'rule', n: 7, text: 'No use of mobile phones, internet, or any external help allowed during the event.' },
            { type: 'rule', n: 9, text: 'Elimination may occur after each round based on scores.' },
            { type: 'rule', n: 10, text: 'In case of a tie, a rapid-fire tiebreaker round will be conducted.' },
            { type: 'rule', n: 11, text: 'The decision of the host/judges is final and no arguments or appeals will be entertained.' },
            { type: 'rule', n: 12, text: 'Teams must maintain discipline and professionalism throughout the event.' },
        ],
    },
];

/* ── Content renderer ── */
function renderContent(item, idx, accent) {
    switch (item.type) {
        case 'cover-sub':
            return <p key={idx} className="text-center font-orbitron text-xs tracking-widest opacity-70 mt-2">{item.text}</p>;
        case 'cover-year':
            return <p key={idx} className="text-center font-orbitron text-xs tracking-widest mt-6 opacity-50">{item.text}</p>;
        case 'section-divider':
            return <p key={idx} className="text-center text-sm opacity-60 mt-4 italic">{item.text}</p>;
        case 'rule':
            return (
                <div key={idx} className="flex gap-3 mb-3">
                    <span className="shrink-0 w-6 h-6 rounded-full text-[10px] font-black font-orbitron flex items-center justify-center border mt-0.5"
                        style={{ borderColor: accent, color: accent, minWidth: '1.5rem' }}>{item.n}</span>
                    <p className="text-sm leading-relaxed text-white/80">{item.text}</p>
                </div>
            );
        case 'bullet':
            return (
                <div key={idx} className="flex gap-2 mb-2 ml-4">
                    <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
            );
        case 'subheading':
            return <h4 key={idx} className="font-orbitron font-bold text-[11px] tracking-widest uppercase mt-5 mb-2 pb-1 border-b"
                style={{ color: accent, borderColor: `${accent}40` }}>{item.text}</h4>;
        case 'para':
            return <p key={idx} className="text-sm leading-relaxed mb-3 text-white/70">{item.text}</p>;
        case 'round':
            return (
                <div key={idx} className="mb-3 ml-2 pl-3 border-l-2" style={{ borderColor: `${accent}60` }}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-orbitron font-bold text-xs" style={{ color: accent }}>{item.round}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-orbitron font-black"
                            style={{ background: `${accent}20`, color: accent }}>{item.duration}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/60">{item.details}</p>
                </div>
            );
        default: return null;
    }
}

/* ── Single page card ── */
function PageCard({ section, isActive }) {
    const isCover = section.tag === 'COVER';
    const isSection = section.tag === 'SECTION';
    const accent = section.color;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative w-full rounded-xl overflow-hidden"
            style={{
                background: isCover
                    ? 'linear-gradient(135deg, #05001a 0%, #0a0020 60%, #000510 100%)'
                    : isSection
                        ? 'linear-gradient(135deg, #07182E 0%, #050c1a 100%)'
                        : 'linear-gradient(180deg, #07182E 0%, #060e1d 100%)',
                boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px rgba(0,0,0,0.5), 0 0 40px ${accent}18`,
                minHeight: '480px',
            }}
        >
            {/* Grain texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />

            {/* Top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />

            <div className="relative z-10 p-8 md:p-10">
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                    <span className="font-orbitron font-black text-[10px] tracking-[0.2em] px-3 py-1 rounded border"
                        style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                        THREADS'26 · {section.tag}
                    </span>
                    {!isCover && !isSection && (
                        <span className="font-orbitron text-[9px] tracking-widest text-white/20">RULE BOOK</span>
                    )}
                </div>

                {/* Title area */}
                {isCover ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center mb-8"
                            style={{ borderColor: accent, boxShadow: `0 0 30px ${accent}50` }}>
                            <BookOpen size={36} style={{ color: accent }} />
                        </div>
                        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-3">{section.title}</h1>
                        <p className="font-orbitron text-xs tracking-widest text-white/50">{section.subtitle}</p>
                    </div>
                ) : isSection ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-full h-px mb-10" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />
                        <h2 className="font-orbitron font-black text-3xl md:text-5xl tracking-wider" style={{ color: accent }}>{section.title}</h2>
                        <div className="w-full h-px mt-10" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />
                    </div>
                ) : (
                    <>
                        <h2 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-1"
                            style={{ textShadow: `0 0 24px ${accent}50` }}>{section.title}</h2>
                        <p className="font-orbitron text-xs tracking-wider mb-6" style={{ color: accent }}>{section.subtitle}</p>
                    </>
                )}

                {/* Rules content */}
                <div>{section.content.map((item, i) => renderContent(item, i, accent))}</div>

                {/* Organizers */}
                {section.organizers?.length > 0 && (
                    <div className="mt-8 pt-5 border-t" style={{ borderColor: `${accent}25` }}>
                        <p className="font-orbitron text-[10px] tracking-widest mb-3" style={{ color: accent }}>EVENT ORGANIZERS</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            {section.organizers.map((org, i) => (
                                <span key={i} className="text-xs text-white/50">{i + 1}. {org}</span>
                            ))}
                        </div>
                    </div>
                )}
                {section.note && (
                    <div className="mt-4 p-3 rounded text-xs italic text-white/50 border border-dashed"
                        style={{ borderColor: `${accent}25` }}>{section.note}</div>
                )}
            </div>

            {/* Page tag bottom */}
            <div className="absolute bottom-4 right-5 font-orbitron text-[9px] text-white/15">{section.tag}</div>
        </motion.div>
    );
}

/* ── Main page component ── */
export default function RuleBookPage() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [tocOpen, setTocOpen] = useState(false);
    const contentRef = useRef(null);

    const { scrollYProgress } = useScroll({ container: contentRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const goTo = (idx) => {
        setActiveIdx(idx);
        setTocOpen(false);
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prev = () => { if (activeIdx > 0) goTo(activeIdx - 1); };
    const next = () => { if (activeIdx < SECTIONS.length - 1) goTo(activeIdx + 1); };

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [activeIdx]);

    const current = SECTIONS[activeIdx];

    return (
        <div className="min-h-screen pt-20 pb-32 relative">
            {/* Page header */}
            <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <BookOpen size={28} className="text-neon-cyan shrink-0" />
                        <div>
                            <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white">
                                EVENT <span className="text-neon-cyan">RULE BOOK</span>
                            </h1>
                            <p className="font-orbitron text-[10px] tracking-widest text-white/40 mt-0.5">
                                THREADS'26 · {SECTIONS.filter(s => s.tag !== 'COVER' && s.tag !== 'SECTION').length} EVENTS
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://drive.google.com/uc?export=download&id=1veFVxL2vCNRCGPHdTz-ugRDBMC-2PL85"
                        target="_blank"
                        class="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold font-orbitron text-xs rounded-xl hover:bg-white hover:text-black transition-all w-fit"
                    >
                        DOWNLOAD PDF
                    </a>
                </motion.div>

                {/* Progress bar */}
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div className="h-full rounded-full origin-left"
                        style={{ scaleX, background: `linear-gradient(to right, ${current.color}, #8338EC)` }} />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 flex gap-6">

                {/* ── DESKTOP TOC ── */}
                <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-24 self-start rounded-xl overflow-hidden border"
                    style={{ background: '#04101d', borderColor: 'rgba(0,217,255,0.12)', maxHeight: 'calc(100vh - 7rem)' }}>
                    <div className="p-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="font-orbitron font-bold text-[10px] text-neon-cyan tracking-widest">CONTENTS</p>
                    </div>
                    <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8338EC30 transparent' }}>
                        {SECTIONS.map((s, i) => (
                            <button key={s.id} onClick={() => goTo(i)}
                                className="w-full text-left px-4 py-3 flex items-center gap-2 transition-all duration-200 border-l-2"
                                style={{
                                    background: activeIdx === i ? `${s.color}12` : 'transparent',
                                    borderLeftColor: activeIdx === i ? s.color : 'transparent',
                                }}>
                                <span className="text-[9px] font-orbitron font-black shrink-0 w-7"
                                    style={{ color: s.color, opacity: activeIdx === i ? 1 : 0.45 }}>{s.tag}</span>
                                <span className="text-[10px] font-orbitron truncate"
                                    style={{ color: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.35)' }}>{s.title}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 min-w-0">
                    {/* Mobile TOC toggle bar */}
                    <div className="lg:hidden flex items-center gap-3 mb-4 p-3 rounded-xl border"
                        style={{ background: '#04101d', borderColor: 'rgba(0,217,255,0.12)' }}>
                        <button onClick={() => setTocOpen(v => !v)}
                            className="flex items-center gap-2 font-orbitron text-xs text-neon-cyan">
                            {tocOpen ? <X size={14} /> : <Menu size={14} />}
                            {tocOpen ? 'CLOSE' : 'CONTENTS'}
                        </button>
                        <span className="ml-auto font-orbitron text-[10px] text-white/30">{activeIdx + 1} / {SECTIONS.length}</span>
                    </div>

                    {/* Mobile TOC drawer */}
                    <AnimatePresence>
                        {tocOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden mb-4 rounded-xl border"
                                style={{ background: '#04101d', borderColor: 'rgba(0,217,255,0.12)' }}>
                                <div className="max-h-64 overflow-y-auto">
                                    {SECTIONS.map((s, i) => (
                                        <button key={s.id} onClick={() => goTo(i)}
                                            className="w-full text-left px-4 py-3 flex items-center gap-2 border-l-2"
                                            style={{
                                                background: activeIdx === i ? `${s.color}12` : 'transparent',
                                                borderLeftColor: activeIdx === i ? s.color : 'transparent',
                                            }}>
                                            <span className="text-[9px] font-orbitron font-black w-7" style={{ color: s.color }}>{s.tag}</span>
                                            <span className="text-[10px] font-orbitron" style={{ color: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{s.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active page */}
                    <AnimatePresence mode="wait">
                        <PageCard key={current.id} section={current} isActive />
                    </AnimatePresence>

                    {/* Navigation controls */}
                    <div className="flex items-center justify-between mt-6 gap-4">
                        <motion.button
                            onClick={prev}
                            disabled={activeIdx === 0}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl border font-orbitron text-xs disabled:opacity-25 transition-all"
                            style={{ borderColor: 'rgba(0,217,255,0.25)', color: '#00D9FF', background: 'rgba(0,217,255,0.05)' }}
                        >
                            <ChevronUp size={16} /> PREV PAGE
                        </motion.button>

                        {/* Dot indicators */}
                        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
                            {SECTIONS.map((s, i) => (
                                <button key={s.id} onClick={() => goTo(i)}
                                    className="rounded-full transition-all duration-300"
                                    style={{
                                        width: activeIdx === i ? '20px' : '6px',
                                        height: '6px',
                                        background: activeIdx === i ? s.color : 'rgba(255,255,255,0.2)',
                                    }} />
                            ))}
                        </div>

                        <motion.button
                            onClick={next}
                            disabled={activeIdx === SECTIONS.length - 1}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl border font-orbitron text-xs disabled:opacity-25 transition-all"
                            style={{ borderColor: 'rgba(0,217,255,0.25)', color: '#00D9FF', background: 'rgba(0,217,255,0.05)' }}
                        >
                            NEXT PAGE <ChevronDown size={16} />
                        </motion.button>
                    </div>

                    {/* Keyboard hint */}
                    <p className="text-center font-orbitron text-[9px] text-white/20 mt-4 tracking-widest">
                        USE ← → or ↑ ↓ ARROW KEYS TO NAVIGATE
                    </p>
                </div>
            </div>
        </div>
    );
}
