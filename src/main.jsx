import React, {Component, Suspense, lazy, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
const BrainAssembly = lazy(() => import('./BrainScene.jsx')); 
import './style.css';
import SpringIndicator from './SpringIndicator.jsx';

const CityScene = lazy(() => import('./CityScene.jsx'));
const LINKEDIN = 'https://www.linkedin.com/in/mario-lin7/';
const SOURCE = 'https://github.com/mario-lindev/Mario-Portfolio';

function Icon({name='arrow', size=20, ...props}) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
    music: <><path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/></>,
    moon: <path d="M20.4 14.2A8.8 8.8 0 0 1 9.8 3.6a8.8 8.8 0 1 0 10.6 10.6Z"/>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    external: <path d="M7 17 17 7M7 7h10v10"/>,
    reset: <><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6"/></>,
    down: <path d="M12 4v16M6 14l6 6 6-6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    pause: <path d="M9 5v14M15 5v14"/>,
    play: <path d="m9 5 10 7-10 7Z"/>,
    award: <><circle cx="12" cy="9" r="5"/><path d="m8 13-1 8 5-3 5 3-1-8M10 9l1.5 1.5L14 8"/></>,
    layers: <path d="m3 8 9-5 9 5-9 5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>,
    math: <path d="M19 4H5l7 8-7 8h14M19 4v3M19 17v3"/>,
    code: <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>,
    robot: <><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12v2M16 12v2M9 17h6M1 12v4M23 12v4"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
class SceneBoundary extends Component {
  state = {failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? this.props.fallback : this.props.children;}
}
function useMotion(){
  const [enabled,setEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = e => setEnabled(!e.matches);
    preference.addEventListener('change',update);
    return () => preference.removeEventListener('change',update);
  },[]);
  useEffect(() => {document.documentElement.dataset.motion = enabled ? 'on' : 'off';},[enabled]);
  return [enabled,setEnabled];
}
function BrainObject({motion}){
  return <div className="brain-object"><SceneBoundary fallback={<span className="brain-fallback">Interactive brain puzzle.</span>}><Suspense fallback={<span className="brain-fallback">Interactive brain puzzle.</span>}><BrainAssembly enabled={motion}/></Suspense></SceneBoundary></div>;
}
function Project({motion}){
  const [separated,setSeparated] = useState(false);
  const [details,setDetails] = useState(false);
  const [resetToken,setResetToken] = useState(0);
  const [topDown,setTopDown] = useState(false);
  const [loadScene,setLoadScene] = useState(false);
  const stage = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {if(entry.isIntersecting){setLoadScene(true);observer.disconnect();}}, {rootMargin:'250px'});
    observer.observe(stage.current);
    return () => observer.disconnect();
  },[]);
  const fallback = <div className="city-fallback"><Icon name="layers" size={64}/><span>Connected systems. One city.</span></div>;
  return <section id="work" className="work-section section-shell">
    <div className="section-intro"><h2>Auquara.</h2><p>A prototype city for the Future City Competition, focused on efficiency and connected systems.</p></div>
    <article className="project">
      <div className="project-visual" ref={stage}>
        <div className="stage-header"><span>Auquara</span><span>Future City Competition · 2024–2025</span></div>
        <div className="city-canvas">
          {loadScene && <SceneBoundary fallback={fallback}><Suspense fallback={fallback}><CityScene separated={separated} motion={motion} resetToken={resetToken} topDown={topDown} onViewChange={setTopDown}/></Suspense></SceneBoundary>}
        </div>
        <div className="stage-footer"><div className="segmented" role="group" aria-label="City visualization"><button aria-pressed={!separated} onClick={() => setSeparated(false)}>Together</button><button aria-pressed={separated} onClick={() => setSeparated(true)}>Exploded view</button><SpringIndicator second={separated} motion={motion}/></div><div className="view-tools"><span className="stage-hint">Drag to rotate. Arrow keys work, too.</span><button className="top-view" onClick={()=>setTopDown(v=>!v)} aria-pressed={topDown} aria-label={topDown?"Show landscape city view":"Show top-down city view"}>{topDown?"Landscape view":"Top view"}</button><button className="reset-view" onClick={()=>{setTopDown(false);setResetToken(v=>v+1);}} aria-label="Reset city view"><Icon name="reset" size={16}/></button></div></div>
      </div>
      <div className="project-summary"><div><h3>Auquara</h3><p>A city, considered as a system.</p></div><p className="project-description">A Future City Competition prototype focused on efficiency, productivity, and how a city’s systems work together.</p><button className="project-disclosure" aria-label={details?'Hide Auquara project details':'Explore Auquara project details'} aria-expanded={details} aria-controls="project-details" onClick={() => setDetails(v=>!v)}><span>{details?'Close details':'Project details'}</span><Icon name="plus" size={18} className={details?'rotated':''}/></button></div>
      <div className="project-details" id="project-details" hidden={!details}><div><h4>Thinking in systems.</h4><p>The project combined construction, project management, and leadership, and received the Excellence in Systems Integration award in the Future City Competition.</p></div><a className="inline-link" href={LINKEDIN+'details/projects/'} target="_blank" rel="noreferrer">Project on LinkedIn <Icon name="external" size={17}/></a></div>
    </article>
    <div className="recognition"><div className="award-medallion"><Icon name="award" size={30}/></div><div><h3>Excellence in Systems Integration</h3><a className="award-source" href={LINKEDIN+'details/projects/'} target="_blank" rel="noreferrer">View award on LinkedIn <Icon name="external" size={14}/></a></div><span>Future City Competition</span></div>
    <div className="model-downloads"><a href="/models/auquara.glb" download>Download 3D model (.glb)</a><a href="/models/auquara.scad" download>Download editable CAD (.scad)</a></div>
  </section>;
}
function SignalGuard(){
  return <section className="signalguard-section section-shell" aria-labelledby="signalguard-title">
    <div className="signalguard-heading"><h2 id="signalguard-title">SignalGuard<span>.</span></h2><p>Machine learning · October–November 2026</p><a className="inline-link" href={LINKEDIN+'details/projects/'} target="_blank" rel="noreferrer">Project on LinkedIn <Icon name="external" size={17}/></a></div>
    <div className="signalguard-story"><p className="project-lead">Listening for changes.<br/>Helping keep water flowing.</p><p>I’m exploring how sound recorded on a basic phone can help identify changes in water-pump performance. SignalGuard learns a pump’s healthy acoustic baseline and flags unusual sounds for inspection.</p><p>Built with rural communities in mind, the prototype brings together audio recording, anomaly scoring, and maintenance history. Field validation is planned to evaluate its real-world reliability.</p><p className="project-status">Prototype · Associated with Leland High School</p></div>
  </section>;
}
function Weave(){
  return <section id="weave" className="signalguard-section section-shell" aria-labelledby="weave-title">
    <div className="signalguard-heading"><h2 id="weave-title">Weave<span>.</span></h2><p>AI video editing · October–November 2026</p><a className="inline-link" href={LINKEDIN+'details/projects/'} target="_blank" rel="noreferrer">Project on LinkedIn <Icon name="external" size={17}/></a></div>
    <div className="signalguard-story"><p className="project-lead">Five agents.<br/>One video workflow.</p><p>Weave is an AI-powered video editing platform developed for the Flip the Switch Hackathon. It uses five specialized Claude Code agents to automate video production, from editing and visual effects to quality assurance and collaborative workflows.</p><p>Built with JavaScript, Node.js, Switch, and FFmpeg.</p><p className="project-status">Collaborator: Rishith · Associated with Leland High School</p></div>
  </section>;
}
function AlmadenHacks(){
  return <section id="almaden" className="almaden-section section-shell" aria-labelledby="almaden-title">
    <div className="almaden-title"><h2 id="almaden-title">Almaden Hacks<span>.</span></h2><p>Co-founder · September 2026–present</p><a className="inline-link" href="https://almadenhacks.com" target="_blank" rel="noreferrer">Visit the website <Icon name="external" size={17}/></a></div>
    <div className="almaden-story"><p className="project-lead">Building a place for students<br className="desktop-break"/> to build together.</p><p>I’m co-organizing a student-led hackathon in San Jose, planned for June 2027. I designed and built our website, and I lead outreach to companies and local businesses for sponsorship and resources.</p><p>Alongside my co-founders, I coordinate responsibilities and help make the decisions that bring the event together.</p><div className="almaden-links"><a className="story-source" href={LINKEDIN+'details/experience/'} target="_blank" rel="noreferrer">My role on LinkedIn <Icon name="external" size={14}/></a><a className="story-source" href="https://www.linkedin.com/company/144108080/" target="_blank" rel="noreferrer">Almaden Hacks on LinkedIn <Icon name="external" size={14}/></a></div></div>
  </section>;
}
function Interests(){
  const [active,setActive]=useState('robotics');
  const items={
    robotics:{name:'Robotics',icon:'robot',title:'FRC Robotics 604',description:'I’m learning how ideas become working hardware with FRC Robotics 604 at Leland High School.',facts:[['School','Leland High School'],['Focus','Engineering & hardware']],source:'details/education/',sourceLabel:'Education on LinkedIn'},
    learning:{name:'Machine learning',icon:'code',title:'Learning from sound',description:'Through SignalGuard, I’m exploring machine learning, digital signal processing, data analysis, and research.',facts:[['Project','SignalGuard'],['Focus','Audio analysis · Anomaly detection'],['Stage','Prototype · Field validation planned']],source:'details/projects/',sourceLabel:'Project on LinkedIn'},
  };
  const current=items[active];
  return <section className="interests section-shell" aria-labelledby="interests-title">
    <div className="section-intro"><h2 id="interests-title">What I’m exploring.</h2><p>Robotics and machine learning.<br className="desktop-break"/> From physical systems to patterns in sound.</p></div>
    <div className="interest-layout"><div className="interest-menu" role="group" aria-label="Explore interests">{Object.entries(items).map(([key,item])=><button key={key} onClick={()=>setActive(key)} aria-pressed={active===key} aria-controls="interest-panel"><Icon name={item.icon} size={22}/><span>{item.name}</span><Icon name="arrow" size={18}/></button>)}</div>
      <div className="interest-content" id="interest-panel" aria-live="polite"><div className="interest-text"><h3>{current.title}</h3><p>{current.description}</p><dl className="interest-facts">{current.facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><a className="inline-link" href={LINKEDIN+current.source} target="_blank" rel="noreferrer">{current.sourceLabel}<Icon name="external" size={16}/></a></div></div>
    </div>
  </section>;
}
function MusicButton(){
  const audio=useRef(null);
  const request=useRef(0);
  const [playing,setPlaying]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const toggle=async()=>{
    const player=audio.current;
    const id=++request.current;
    setError('');
    if(!player.paused||loading){player.pause();setLoading(false);return;}
    setLoading(true);
    try{await player.play();}
    catch(reason){if(id===request.current&&reason.name!=='AbortError')setError('Music could not play. Please try again.');}
    finally{if(id===request.current)setLoading(false);}
  };
  return <div className="music-control">
    <audio ref={audio} src="/audio/music.mp3" preload="none" onPlaying={()=>{setPlaying(true);setLoading(false);}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>{setPlaying(false);setLoading(false);setError('Music could not load. Please try again.');}}/>
    <button className="music-toggle" onClick={toggle} aria-label={loading?'Cancel music loading':playing?'Pause music':'Play music'} aria-pressed={playing} aria-busy={loading} title={playing?'Pause music':'Play music'}><Icon name={playing?'pause':'music'} size={17}/><span>{loading?'Loading…':playing?'Pause music':'Music'}</span></button>
    <span className="music-status" role="status">{error}</span>
  </div>;
}
function useAppearance(){
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'light');
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#111216':'#ffffff');try{localStorage.setItem('mario-appearance',theme);}catch{}},[theme]);
  return [theme,()=>setTheme(v=>v==='dark'?'light':'dark')];
}
function App(){
  const [motion,setMotion] = useMotion();
  const [theme,toggleTheme]=useAppearance();
  return <><a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="header-inner"><a href="#" className="wordmark" aria-label="Mario Lin home">Mario Lin<span className="wordmark-dot"/></a><nav aria-label="Main navigation"><a href="#work">Projects</a><a href="#about">Community</a><a href="#journey">Background</a></nav><div className="header-actions"><button className="appearance-toggle" onClick={toggleTheme} aria-label={theme==='dark'?'Switch to light appearance':'Switch to dark appearance'} aria-pressed={theme==='dark'} title="Appearance"><Icon name={theme==='dark'?'moon':'sun'} size={17}/><span>{theme==='dark'?'Dark':'Light'}</span></button><MusicButton/><a className="nav-connect" aria-label="Mario Lin on LinkedIn" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn <Icon name="external" size={15}/></a></div></div></header>
    <main id="main">
      <section className="hero section-shell"><div className="hero-main"><div className="hero-copy"><h1>Mario Lin<span className="hero-period">.</span></h1><p className="hero-statement">A student exploring<br/>how things work.</p><p>I’m at Leland High School in San Jose. I explore robotics and machine learning, and I’m a co-founder of Almaden Hacks.</p><div className="hero-actions"><a href="#work" className="button-primary">Explore Auquara <Icon name="arrow" size={18}/></a><a href="#about" className="text-button">What I’m up to <Icon name="down" size={16}/></a></div></div><div className="hero-art"><BrainObject motion={motion}/><div className="art-caption"><span>Interactive brain puzzle. Drag to rotate.</span><button className="motion-control" onClick={()=>setMotion(v=>!v)} aria-label={motion?'Pause animations':'Play animations'} aria-pressed={motion}><Icon name={motion?'pause':'play'} size={14}/></button></div></div></div><div className="hero-foot"><span>Leland High School <span className="foot-dot"/> Grade 9</span><a href="#almaden">Co-founder of Almaden Hacks <Icon name="down" size={14}/></a></div></section>
      <Project motion={motion}/>
      <SignalGuard/>
      <Weave/>
      <AlmadenHacks/>
      <Interests/>
      <section className="about-section" id="about"><div className="section-shell"><div className="about-heading"><h2>Beyond the build.</h2><p>A few other things I spend my time on.</p></div><div className="about-stories"><article><h3>ACDS Cougar Shootout</h3><p>Second place among more than 10 teams at Almaden Country Day School’s annual tournament in January 2026.</p><a className="story-source" href={LINKEDIN+'details/honors/'} target="_blank" rel="noreferrer">Tournament result <Icon name="external" size={14}/></a></article><article><h3>Helping others learn</h3><p>I volunteer as a tutor with Breakthrough Silicon Valley. My current term runs from October to December 2026.</p><a className="story-source" href={LINKEDIN+'details/volunteering-experiences/'} target="_blank" rel="noreferrer">Volunteer experience <Icon name="external" size={14}/></a></article></div></div></section>
      <section id="journey" className="journey-section section-shell"><div className="journey-heading"><h2>Where I’m learning.</h2><p>At school, on a team, and through the things I make.</p></div><div className="education-records"><ol className="timeline"><li><div className="timeline-date">Aug 2026—Present<span>Grade 9</span></div><div className="timeline-content"><h3>Leland High School <span className="current-label">Now</span></h3><p>FRC Robotics 604 · Leland Hackathon Club · Key Club</p><span>Exploring engineering and hardware.</span></div></li></ol><section className="language-summary" aria-labelledby="languages-title"><h3 id="languages-title">Languages</h3><dl className="interest-facts"><div><dt>Chinese & English</dt><dd>Native or bilingual proficiency</dd></div><div><dt>Spanish</dt><dd>Limited working proficiency</dd></div></dl><a className="inline-link" href={LINKEDIN+'details/languages/'} target="_blank" rel="noreferrer">Languages on LinkedIn <Icon name="external" size={16}/></a></section></div></section>
      <section className="contact-section"><div className="section-shell contact-inner"><div className="contact-monogram" aria-hidden="true">m<span>l.</span></div><h2>Let’s make something.</h2><p>Have a project in mind, or want to talk about<br className="desktop-break"/> Almaden Hacks? Find me on LinkedIn.</p><a className="linkedin-connect" href={LINKEDIN} target="_blank" rel="noopener noreferrer">Connect on LinkedIn <Icon name="external" size={18}/></a></div></section>
    </main><footer className="site-footer section-shell"><div className="footer-top"><a href="#" className="wordmark">Mario Lin<span className="wordmark-dot"/></a><span>Leland student · Almaden Hacks co-founder.</span><a href="#" className="back-top">Back to top <Icon name="down" size={14}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Mario Lin</span><div><a href={SOURCE} target="_blank" rel="noreferrer">GitHub <Icon name="external" size={12}/></a><button onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>Animations {motion?'on':'off'}</button></div></div></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
