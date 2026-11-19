document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('vishnurnair21@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Please copy the email address shown above.';}});

const drawings={
 cryo:{file:'daedalus-cryogenic-pid.png',title:'CH₄ / LOX cryogenic fluid system',description:'Helium pressurization, cryogenic storage, isolation and regulation, instrumentation, and propellant distribution.',alt:'Daedalus CH4/LOX P&ID with helium pressurization, cryogenic propellant tanks, instrumentation, relief devices, feed and bleed lines.'},
 hyper:{file:'daedalus-hypergolic-pid.png',title:'MMH / NTO fluid system architecture',description:'Separate MMH and NTO storage and feed circuits, a helium pressurization manifold, component tags, and fill/drain interfaces.',alt:'Daedalus MMH/NTO P&ID with helium pressurization, separate fuel and oxidizer tanks, tagged valves, instrumentation and engine feed branches.'},
 bowtie:{file:'daedalus-bowtie.png',title:'Cryogenic over-pressure bow-tie analysis',description:'Threats, prevention barriers, a pressure-above-MEOP top event, mitigation barriers, consequences, escalation factors, and a failure-tolerance check.',alt:'Daedalus cryogenic over-pressure bow-tie diagram connecting threats and prevention barriers to the top event, mitigation barriers and consequences.'}
};
document.querySelectorAll('[data-drawing]').forEach(button=>button.addEventListener('click',()=>{
 const drawing=drawings[button.dataset.drawing];
 document.querySelectorAll('[data-drawing]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 const image=document.getElementById('drawing-image');image.src='assets/'+drawing.file;image.alt=drawing.alt;
 document.getElementById('drawing-title').textContent=drawing.title;
 document.getElementById('drawing-description').textContent=drawing.description;
 for(const id of ['drawing-open','drawing-fullsize'])document.getElementById(id).href='assets/'+drawing.file;
 document.getElementById('drawing-announcement').textContent=drawing.title+' selected.';
}));

// Keep the orbital map and the visible experience card in sync while reading.
const journeyCards=[...document.querySelectorAll('[data-journey-card]')];
function activateJourney(id){
 document.querySelectorAll('[data-orbit]').forEach(point=>point.classList.toggle('is-active',point.dataset.orbit===id));
 journeyCards.forEach(card=>card.classList.toggle('is-active',card.id===id));
 document.querySelectorAll('[data-orbit-link]').forEach(link=>{if(link.dataset.orbitLink===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
document.querySelectorAll('[data-orbit-link]').forEach(link=>link.addEventListener('click',()=>activateJourney(link.dataset.orbitLink)));
if('IntersectionObserver' in window){
 const visibleCards=new Map();
 const journeyObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>visibleCards.set(entry.target.id,{visible:entry.isIntersecting,top:entry.boundingClientRect.top}));
  const nearest=[...visibleCards].filter(([,item])=>item.visible).sort((a,b)=>Math.abs(a[1].top)-Math.abs(b[1].top))[0];
  if(nearest)activateJourney(nearest[0]);
 },{rootMargin:'-10% 0px -35% 0px',threshold:0});
 journeyCards.forEach(card=>journeyObserver.observe(card));
}

const photoDialog=document.getElementById('project-photo-dialog');
document.querySelectorAll('[data-photo]').forEach(link=>link.addEventListener('click',event=>{
 if(!photoDialog||typeof photoDialog.showModal!=='function')return;
 event.preventDefault();
 document.getElementById('photo-dialog-title').textContent=link.dataset.photo;
 const image=document.getElementById('photo-dialog-image');image.src=link.href;image.alt=link.querySelector('img')?.alt||link.dataset.photo;
 document.getElementById('photo-dialog-original').href=link.href;
 photoDialog.showModal();
}));
document.getElementById('photo-dialog-close')?.addEventListener('click',()=>photoDialog.close());
photoDialog?.addEventListener('click',event=>{if(event.target===photoDialog){const bounds=photoDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)photoDialog.close();}});
