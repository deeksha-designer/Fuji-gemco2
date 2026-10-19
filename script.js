const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>toggle?.setAttribute('aria-expanded','false')));
const megaToggle=document.querySelector('.mega-toggle'),megaMenu=document.querySelector('.mega-menu');
function setMega(open){megaToggle?.setAttribute('aria-expanded',String(open));megaMenu?.classList.toggle('open',open);megaMenu?.setAttribute('aria-hidden',String(!open));document.querySelector('.header')?.classList.toggle('menu-open',open)}
megaToggle?.addEventListener('click',e=>{e.stopPropagation();setMega(megaToggle.getAttribute('aria-expanded')!=='true')});
megaToggle?.addEventListener('mouseenter',()=>setMega(true));
document.querySelector('.header')?.addEventListener('mouseleave',()=>setMega(false));
megaMenu?.addEventListener('mouseleave',()=>setMega(false));
megaMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMega(false)));
document.addEventListener('click',e=>{if(!megaMenu?.contains(e.target)&&e.target!==megaToggle)setMega(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMega(false)});
const animated=document.querySelectorAll('.section-heading,.purpose-copy>*,.metric,.product-card,.sticky-copy>*,.steps article,.industry-card,.project-title>*,.project-grid,.project-thumb,.connected-head>*,.connected-cards article,.heading-line>*,.insight-grid article,.contact-grid>*,.footer-lead>*,.footer-grid>div');
animated.forEach(el=>el.classList.add('fade-up'));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px'});
animated.forEach(el=>observer.observe(el));

const header=document.querySelector('.header');
const updateHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>28);
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero banner slider
const hero=document.querySelector('.hero');
const heroSlides=[...document.querySelectorAll('.hero-slide')];
const heroCurrent=document.querySelector('.hero-current');
const heroProgress=document.querySelector('.hero-line i');
const heroCopy=document.querySelector('.hero-copy');
const heroKicker=document.querySelector('.hero-kicker');
const heroTitle=document.querySelector('.hero-copy h1');
const heroLead=document.querySelector('.hero-lead');
let heroIndex=0,heroTimer;
function showHero(index){heroIndex=(index+heroSlides.length)%heroSlides.length;heroSlides.forEach((slide,i)=>slide.classList.toggle('active',i===heroIndex));const slide=heroSlides[heroIndex];if(heroKicker)heroKicker.lastChild.textContent=` ${slide.dataset.kicker}`;if(heroTitle)heroTitle.textContent=slide.dataset.title;if(heroLead)heroLead.textContent=slide.dataset.lead;if(heroCopy){heroCopy.classList.remove('is-changing');void heroCopy.offsetWidth;heroCopy.classList.add('is-changing')}if(heroCurrent)heroCurrent.textContent=String(heroIndex+1).padStart(2,'0');if(heroProgress)heroProgress.style.width=`${((heroIndex+1)/heroSlides.length)*100}%`}
function startHero(){if(!reduceMotion){clearInterval(heroTimer);heroTimer=setInterval(()=>showHero(heroIndex+1),5500)}}
document.querySelector('.hero-next')?.addEventListener('click',()=>{showHero(heroIndex+1);startHero()});
document.querySelector('.hero-prev')?.addEventListener('click',()=>{showHero(heroIndex-1);startHero()});
hero?.addEventListener('mouseenter',()=>clearInterval(heroTimer));hero?.addEventListener('mouseleave',startHero);startHero();

// Count-up statistics
const counters=[...document.querySelectorAll('.counter')];
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count),suffix=el.dataset.suffix||'';if(reduceMotion){el.textContent=target.toLocaleString()+suffix;counterObserver.unobserve(el);return}const start=performance.now(),duration=1500;const tick=now=>{const p=Math.min((now-start)/duration,1),eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased).toLocaleString()+(p===1?suffix:'');if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);counterObserver.unobserve(el)}),{threshold:.45});
counters.forEach(counter=>counterObserver.observe(counter));

// Looping horizontal rails
function loopRail(track,next,prev,delay=0){if(!track)return;let busy=false;const gap=18;const step=()=>track.firstElementChild.getBoundingClientRect().width+gap;const forward=()=>{if(busy)return;busy=true;track.style.transition='transform .5s cubic-bezier(.22,.61,.36,1)';track.style.transform=`translateX(-${step()}px)`;setTimeout(()=>{track.append(track.firstElementChild);track.style.transition='none';track.style.transform='translateX(0)';busy=false},520)};const back=()=>{if(busy)return;busy=true;track.prepend(track.lastElementChild);track.style.transition='none';track.style.transform=`translateX(-${step()}px)`;requestAnimationFrame(()=>requestAnimationFrame(()=>{track.style.transition='transform .5s cubic-bezier(.22,.61,.36,1)';track.style.transform='translateX(0)'}));setTimeout(()=>busy=false,520)};next?.addEventListener('click',forward);prev?.addEventListener('click',back);let timer;if(delay&&!reduceMotion){const begin=()=>timer=setInterval(forward,delay);begin();track.parentElement?.addEventListener('mouseenter',()=>clearInterval(timer));track.parentElement?.addEventListener('mouseleave',()=>{clearInterval(timer);begin()})}}
loopRail(document.querySelector('.product-track'),document.querySelector('.product-carousel .carousel-next'),document.querySelector('.product-carousel .carousel-prev'));
loopRail(document.querySelector('.industry-grid'),document.querySelector('.industry-next'),document.querySelector('.industry-prev'),4200);

// Project image gallery
const projectShots=[...document.querySelectorAll('.project-shot')],projectDots=[...document.querySelectorAll('.project-dots button')];let projectIndex=0,projectTimer;
function showProject(i){projectIndex=(i+projectShots.length)%projectShots.length;projectShots.forEach((shot,n)=>shot.classList.toggle('active',n===projectIndex));projectDots.forEach((dot,n)=>dot.classList.toggle('active',n===projectIndex))}
projectDots.forEach((dot,i)=>dot.addEventListener('click',()=>{showProject(i);restartProject()}));
function restartProject(){clearInterval(projectTimer);if(!reduceMotion)projectTimer=setInterval(()=>showProject(projectIndex+1),4500)}

// Featured project story with thumbnail navigation
const projectThumbs=[...document.querySelectorAll('.project-thumb')];
const projectClient=document.querySelector('.project-client');
const projectSummary=document.querySelector('.project-summary');
const projectCount=document.querySelector('.project-count');
let projectStoryIndex=0,projectStoryTimer;
function showProjectStory(index){
  projectStoryIndex=(index+projectThumbs.length)%projectThumbs.length;
  const thumb=projectThumbs[projectStoryIndex];
  projectThumbs.forEach((item,i)=>item.classList.toggle('active',i===projectStoryIndex));
  showProject(Number(thumb.dataset.index));
  if(projectClient)projectClient.textContent=thumb.dataset.client;
  if(projectSummary)projectSummary.textContent=thumb.dataset.summary;
  if(projectCount)projectCount.textContent=`${String(projectStoryIndex+1).padStart(2,'0')} / ${String(projectThumbs.length).padStart(2,'0')}`;
}
function restartProjectStories(){clearInterval(projectStoryTimer);if(!reduceMotion)projectStoryTimer=setInterval(()=>showProjectStory(projectStoryIndex+1),5200)}
projectThumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>{showProjectStory(i);restartProjectStories()}));
restartProjectStories();

if(!reduceMotion){
  const heroSlidesWrap=document.querySelector('.hero-slides');
  window.addEventListener('scroll',()=>{if(window.scrollY<760&&heroSlidesWrap)heroSlidesWrap.style.transform=`translateY(${window.scrollY*.035}px)`},{passive:true});
}
