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
