(function(){
var d=document.documentElement,phone=matchMedia('(max-width:760px)').matches;
var hero=document.getElementById('hero'),held=document.getElementById('held');
hero.poster=phone?hero.dataset.pm:hero.dataset.pd;hero.src=phone?hero.dataset.m:hero.dataset.d;
var PAYOFF=5.2+0.25; /* check cut at 5.20s in both edits; word lands 0.25s after [B: rule] */
var shown=false;function tick(){if(!shown&&hero.currentTime>=PAYOFF){held.classList.add('on');shown=true}if(!shown)requestAnimationFrame(tick)}
requestAnimationFrame(tick);
var p=hero.play();if(p&&p.catch)p.catch(function(){});
/* split reveal-words into words */
document.querySelectorAll('.reveal-words').forEach(function(el){
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{var s=document.createElement('span');s.className='rw';s.textContent=t;f.appendChild(s)}});n.replaceChild(f,c)}
    else if(c.nodeType===1)walk(c)})})(el)});
var paused=false,lenis=null;
if(window.Lenis){lenis=new Lenis({duration:1.1,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))}}); /* glide, ~870ms notch [M] */
  function raf(t){if(!paused)lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf)}
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);if(lenis)lenis.on('scroll',ScrollTrigger.update);
  document.querySelectorAll('.reveal-words').forEach(function(el){var w=el.querySelectorAll('.rw');
    ScrollTrigger.create({trigger:el,start:'top 85%',end:'bottom 45%',onUpdate:function(s){var n=Math.ceil(s.progress*w.length*1.15);for(var i=0;i<w.length;i++)w[i].classList.toggle('on',i<n)},onLeave:function(){w.forEach(function(x){x.classList.add('on')})}})});
}else{d.classList.remove('m')}
window.__ok=1;
var bar=document.querySelector('.bar');new IntersectionObserver(function(e){bar.classList.toggle('off',e[0].isIntersecting)},{threshold:.15}).observe(document.getElementById('ask'));
if(window.gsap&&window.ScrollTrigger){document.querySelectorAll('.ph img').forEach(function(im){gsap.fromTo(im,{yPercent:-8},{yPercent:0,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}})})}
/* mid-page films only play on screen */
var room=document.getElementById('room');room.dataset.src=phone?room.dataset.m:room.dataset.d;room.poster=phone?room.dataset.pm:room.dataset.pd;
var vids=[].slice.call(document.querySelectorAll('video[data-src]'));
var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;if(!paused){var q=v.play();if(q&&q.catch)q.catch(function(){})}}else v.pause()})},{rootMargin:'100px'});
vids.forEach(function(v){io.observe(v)});
/* fail-safe: everything visible by the bottom / after 12s */
function all(){document.querySelectorAll('.rw').forEach(function(x){x.classList.add('on')});held.classList.add('on');shown=true}
addEventListener('scroll',function(){if(innerHeight+scrollY>=document.body.scrollHeight-40)all()},{passive:true});
setTimeout(function(){if(!shown&&hero.paused){held.classList.add('on');shown=true}},8000);
/* pause */
var btn=document.getElementById('pause');
btn.addEventListener('click',function(){paused=!paused;btn.textContent=paused?'Play':'Pause';btn.setAttribute('aria-pressed',paused);
  var vs=[hero].concat(vids);if(paused){vs.forEach(function(v){v.pause()});all();if(window.gsap)gsap.globalTimeline.pause();if(lenis)lenis.stop();d.classList.add('paused')}
  else{hero.play();if(window.gsap)gsap.globalTimeline.resume();if(lenis)lenis.start();d.classList.remove('paused');io.disconnect();vids.forEach(function(v){io.observe(v)})}});
/* back to top: eased in-out ~1.8s cubic-bezier(.7,0,.3,1) [M sutera] */
function bez(t){var a=.7,b=.3;function x(u){return 3*a*u*(1-u)*(1-u)+3*b*u*u*(1-u)+u*u*u}function y(u){return 3*0*u*(1-u)*(1-u)+3*1*u*u*(1-u)+u*u*u}var lo=0,hi=1;for(var i=0;i<30;i++){var m=(lo+hi)/2;if(x(m)<t)lo=m;else hi=m}return y((lo+hi)/2)}
document.getElementById('totop').addEventListener('click',function(){if(lenis&&!paused){lenis.scrollTo(0,{duration:1.8,easing:bez})}else{var s=scrollY,t0=performance.now();(function st(n){var k=Math.min(1,(n-t0)/1800);scrollTo(0,s*(1-bez(k)));if(k<1)requestAnimationFrame(st)})(t0)}});
})();
