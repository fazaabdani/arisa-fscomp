const header=document.getElementById('header');
const progress=document.getElementById('scrollProgress');
const navLinks=[...document.querySelectorAll('.main-nav a')];
const onScroll=()=>{header.classList.toggle('scrolled',scrollY>25);const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${h?scrollY/h*100:0}%`;let current='beranda';document.querySelectorAll('main section[id],footer[id]').forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});navLinks.forEach(a=>a.classList.toggle('active',a.hash===`#${current}`))};
addEventListener('scroll',onScroll,{passive:true});onScroll();

const menuToggle=document.getElementById('menuToggle'),mainNav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.classList.toggle('open',open);menuToggle.setAttribute('aria-expanded',open)});
navLinks.forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const date=document.getElementById('date');date.min=new Date().toISOString().slice(0,10);
const form=document.getElementById('quoteForm'),toast=document.getElementById('toast'),toastText=document.getElementById('toastText');
const originField=document.getElementById('origin'),destinationField=document.getElementById('destination'),fleetField=document.getElementById('fleet');
form.addEventListener('submit',e=>{e.preventDefault();toastText.textContent=`${originField.value} → ${destinationField.value} · ${fleetField.value}`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000)});
document.getElementById('toastClose').onclick=()=>toast.classList.remove('show');

const track=document.getElementById('galleryTrack');
document.getElementById('galleryNext').onclick=()=>track.scrollBy({left:track.clientWidth*.55,behavior:'smooth'});
document.getElementById('galleryPrev').onclick=()=>track.scrollBy({left:-track.clientWidth*.55,behavior:'smooth'});

const quotes=[...document.querySelectorAll('.testi-slider blockquote')],dots=[...document.querySelectorAll('.testi-dots button')];let slide=0,timer;
function showSlide(i){slide=i;quotes.forEach((q,n)=>q.classList.toggle('active',n===i));dots.forEach((d,n)=>d.classList.toggle('active',n===i));clearInterval(timer);timer=setInterval(()=>showSlide((slide+1)%quotes.length),5500)}
dots.forEach(d=>d.onclick=()=>showSlide(+d.dataset.slide));showSlide(0);

document.querySelector('.hero').addEventListener('pointermove',e=>{if(innerWidth<760)return;const x=(e.clientX/innerWidth-.5)*8,y=(e.clientY/innerHeight-.5)*5;document.querySelector('.hero-copy').style.transform=`translate(${x}px,${y}px)`});

// Warm ember particles: subtle motion that complements the red/gold sunset hero.
const particleCanvas=document.getElementById('heroParticles');
if(particleCanvas&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const ctx=particleCanvas.getContext('2d');
  const hero=particleCanvas.closest('.hero');
  let particles=[],width=0,height=0,dpr=1,frame=0,active=true;
  const pointer={x:0,y:0,inside:false};
  const colors=['237,28,36','255,68,46','255,157,72','255,211,145'];

  function createParticle(initial=false){
    const depth=.35+Math.random()*.9;
    return {
      x:Math.random()*width,
      y:initial?Math.random()*height:height+12,
      size:(.45+Math.random()*1.55)*depth,
      vx:(Math.random()-.5)*.14,
      vy:-(.08+Math.random()*.32)*depth,
      alpha:.12+Math.random()*.46,
      pulse:Math.random()*Math.PI*2,
      color:colors[Math.floor(Math.random()*colors.length)],
      depth
    };
  }

  function resizeParticles(){
    const rect=hero.getBoundingClientRect();
    width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(devicePixelRatio||1,2);
    particleCanvas.width=Math.round(width*dpr);particleCanvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.round(Math.min(76,Math.max(34,width/20)));
    particles=Array.from({length:count},()=>createParticle(true));
  }

  function drawParticles(){
    if(!active){frame=requestAnimationFrame(drawParticles);return}
    ctx.clearRect(0,0,width,height);
    particles.forEach((p,i)=>{
      p.pulse+=.012+p.depth*.006;
      p.x+=p.vx+(pointer.inside?(pointer.x-width/2)*.000025*p.depth:0);
      p.y+=p.vy;
      if(p.y<-15||p.x<-20||p.x>width+20)particles[i]=p=createParticle();
      const glow=p.size*(3.5+Math.sin(p.pulse));
      const a=p.alpha*(.72+Math.sin(p.pulse)*.28);
      const gradient=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,glow);
      gradient.addColorStop(0,`rgba(${p.color},${a})`);
      gradient.addColorStop(.22,`rgba(${p.color},${a*.48})`);
      gradient.addColorStop(1,`rgba(${p.color},0)`);
      ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(p.x,p.y,glow,0,Math.PI*2);ctx.fill();
    });
    frame=requestAnimationFrame(drawParticles);
  }

  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.inside=true},{passive:true});
  hero.addEventListener('pointerleave',()=>pointer.inside=false);
  new IntersectionObserver(([entry])=>active=entry.isIntersecting,{threshold:.05}).observe(hero);
  new ResizeObserver(resizeParticles).observe(hero);
  resizeParticles();drawParticles();
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}

const motionAllowed=!matchMedia('(prefers-reduced-motion: reduce)').matches;
if(motionAllowed){
  // A soft page-wide spotlight follows the pointer.
  addEventListener('pointermove',e=>{
    document.documentElement.style.setProperty('--cursor-x',`${e.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y',`${e.clientY}px`);
  },{passive:true});

  // Cards gain depth and a local light reflection, without affecting touch devices.
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    const motionCards=[...document.querySelectorAll('.service-strip article,.mini-cards article,.fleet-cards article')];
    motionCards.forEach(card=>{
      card.classList.add('motion-card');
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
        card.style.setProperty('--rx',`${(0.5-py)*5}deg`);
        card.style.setProperty('--ry',`${(px-0.5)*6}deg`);
        card.style.setProperty('--mx',`${px*100}%`);
        card.style.setProperty('--my',`${py*100}%`);
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');
      });
    });
  }

  // The background moves at a slower rate than the page for cinematic depth.
  let parallaxTick=false;
  addEventListener('scroll',()=>{
    if(parallaxTick)return;parallaxTick=true;
    requestAnimationFrame(()=>{
      const hero=document.querySelector('.hero');
      if(hero){const r=hero.getBoundingClientRect();hero.style.setProperty('--hero-parallax',`${Math.max(-18,Math.min(18,-r.top*.055))}px`)}
      parallaxTick=false;
    });
  },{passive:true});

  // Count up only when the experience badge enters view.
  const counter=document.querySelector('[data-count]');
  if(counter)new IntersectionObserver(([entry],obs)=>{
    if(!entry.isIntersecting)return;obs.disconnect();
    const target=Number(counter.dataset.count),start=performance.now(),duration=1100;
    const animate=now=>{const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);counter.textContent=`${Math.round(target*ease)}+`;if(p<1)requestAnimationFrame(animate)};
    requestAnimationFrame(animate);
  },{threshold:.7}).observe(counter);

  // Auto-tour the gallery; user interaction pauses it and remains in control.
  let galleryTimer,autoPaused=false;
  const startGallery=()=>{clearInterval(galleryTimer);galleryTimer=setInterval(()=>{
    if(autoPaused||document.hidden)return;
    const card=track.querySelector('article'),step=(card?.getBoundingClientRect().width||220)+6;
    const end=track.scrollWidth-track.clientWidth-4;
    track.classList.add('is-auto-scrolling');
    track.scrollTo({left:track.scrollLeft>=end?0:track.scrollLeft+step,behavior:'smooth'});
    setTimeout(()=>track.classList.remove('is-auto-scrolling'),850);
  },3600)};
  ['pointerenter','focusin','touchstart'].forEach(event=>track.addEventListener(event,()=>autoPaused=true,{passive:true}));
  ['pointerleave','focusout'].forEach(event=>track.addEventListener(event,()=>autoPaused=false,{passive:true}));
  startGallery();
}
