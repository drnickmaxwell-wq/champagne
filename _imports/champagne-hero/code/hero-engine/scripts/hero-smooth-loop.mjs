export function smoothLoop(videoEl){
  if(!videoEl) return;
  let fadeClone = videoEl.cloneNode(true);
  fadeClone.classList.add('fade-clone');
  videoEl.parentNode.appendChild(fadeClone);
  const duration = ()=> videoEl.duration || 0;
  const fadeWindow = 0.25; // seconds
  const loop = ()=>{
    if(videoEl.currentTime > duration()-fadeWindow){
      fadeClone.currentTime = 0;
      fadeClone.play();
      fadeClone.style.opacity = 1;
      setTimeout(()=>fadeClone.style.opacity = 0, fadeWindow*1000);
    }
    requestAnimationFrame(loop);
  };
  videoEl.addEventListener('play', loop);
}
