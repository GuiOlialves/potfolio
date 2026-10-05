const viewport = document.querySelector('#viewport');
const world = document.querySelector('#world');
const character = document.querySelector('#character');
const stations = [...document.querySelectorAll('.station')];
const hint = document.querySelector('#hint');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sprites = {up:'costa',down:'frente',left:'esquerda',right:'direita'};
const keys = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
const held = new Set();
const dwellDuration = 2000;
let charging = null, chargeStarted = null, opened = false, suspended = false;
const borders = new Map();
stations.forEach(station => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 230 140');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('dwell-border');
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  Object.entries({x:2,y:2,width:226,height:136,rx:8,pathLength:100}).forEach(([key,value]) => rect.setAttribute(key,value));
  svg.append(rect);
  station.append(svg);
  borders.set(station,rect);
});
function cancelCharge() {
  if (charging) {
    charging.classList.remove('charging');
    borders.get(charging).style.strokeDashoffset = '100';
  }
  charging = null;
  chargeStarted = null;
}
function updateCharge(time, moving) {
  // Use the character's feet to determine which card she is standing on.
  const target = stations.find(station => Math.abs(x+24-Number(station.dataset.x)) < station.offsetWidth/2 && Math.abs(y+44-Number(station.dataset.y)) < station.offsetHeight/2);
  if (moving || suspended || opened || !target) {
    if (charging) { cancelCharge(); updateHint(); }
    return;
  }
  if (target !== charging) {
    cancelCharge();
    charging = target;
    chargeStarted = time;
    charging.classList.add('charging');
    hint.textContent = `${charging.querySelector('strong').textContent} — Abrindo em 2 segundos. Mova a personagem para cancelar.`;
  }
  const progress = Math.min(1,(time-chargeStarted)/dwellDuration);
  borders.get(charging).style.strokeDashoffset = String(100*(1-progress));
  if (progress === 1) {
    opened = true;
    held.clear();
    const destination = charging;
    cancelCharge();
    destination.click();
  }
}
function updateHint() {
  hint.textContent = nearest ? `${nearest.querySelector('strong').textContent} — ${nearest.dataset.description} Enter para abrir ou pare sobre o card por 2 segundos.` : 'Siga a trilha e pare sobre um card para abrir. Saia para cancelar.';
}
let x=470,y=270,direction='down',frame=0,lastFrame=0,lastTime=0,animation=null,nearest=null;
Object.values(sprites).forEach(name=>{for(let i=1;i<=4;i++){const image=new Image();image.src=`Sprites/${name}${i}.png`;}});
function render(){
  character.style.transform=`translate(${x}px,${y}px)`;
  character.style.backgroundImage=`url('Sprites/${sprites[direction]}${reducedMotion.matches?1:frame+1}.png')`;
  viewport.scrollLeft=Math.max(0,Math.min(world.clientWidth-viewport.clientWidth,x+24-viewport.clientWidth/2));
  viewport.scrollTop=Math.max(0,Math.min(world.clientHeight-viewport.clientHeight,y+24-viewport.clientHeight/2));
  const candidate=stations.map(station=>({station,distance:Math.hypot(x+24-Number(station.dataset.x),y+24-Number(station.dataset.y))})).sort((a,b)=>a.distance-b.distance)[0];
  const next=candidate.distance<155?candidate.station:null;
  if(next!==nearest){nearest=next;stations.forEach(station=>station.classList.toggle('active',station===nearest));if(!charging)updateHint();}
}
function tick(time){
  const delta=Math.min((time-lastTime)/1000,.04);lastTime=time;
  let dx=(held.has('right')?1:0)-(held.has('left')?1:0),dy=(held.has('down')?1:0)-(held.has('up')?1:0);
  if(dx||dy){const length=Math.hypot(dx,dy);x=Math.max(0,Math.min(912,x+dx/length*190*delta));y=Math.max(0,Math.min(532,y+dy/length*190*delta));direction=dy<0?'up':dy>0?'down':dx<0?'left':'right';if(time-lastFrame>130){frame=(frame+1)%4;lastFrame=time;}render();}
  updateCharge(time, Boolean(dx || dy));
  if((held.size || charging) && !suspended && !opened)animation=requestAnimationFrame(tick);else{animation=null;frame=0;render();}
}
function start(){suspended=false;opened=false;if(animation===null){lastTime=performance.now();animation=requestAnimationFrame(tick);}}
function stop(){held.clear();suspended=true;cancelCharge();updateHint();if(animation!==null){cancelAnimationFrame(animation);animation=null;}frame=0;render();}
window.addEventListener('keydown',event=>{if(event.target.closest('input,textarea,select,button,a'))return;const move=keys[event.key]||keys[event.key.toLowerCase()];if(move){event.preventDefault();held.add(move);start();}else if(event.key==='Enter'&&nearest){event.preventDefault();nearest.click();}});
window.addEventListener('keyup',event=>{const move=keys[event.key]||keys[event.key.toLowerCase()];if(move)held.delete(move);});
window.addEventListener('blur',stop);
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',()=>{opened=false;stop();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
document.querySelectorAll('[data-direction]').forEach(button=>{button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture(event.pointerId);held.add(button.dataset.direction);start();});['pointerup','pointercancel','lostpointercapture'].forEach(name=>button.addEventListener(name,()=>held.delete(button.dataset.direction)));button.addEventListener('click',event=>{if(event.detail===0){direction=button.dataset.direction;x=Math.max(0,Math.min(912,x+(direction==='right'?30:direction==='left'?-30:0)));y=Math.max(0,Math.min(532,y+(direction==='down'?30:direction==='up'?-30:0)));cancelCharge();render();start();}});});
document.querySelector('#reset').addEventListener('click',()=>{stop();x=470;y=270;direction='down';frame=0;render();viewport.focus();});
window.addEventListener('resize',render);reducedMotion.addEventListener('change',render);render();
