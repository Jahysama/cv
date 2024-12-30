function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

if (!isMobileDevice()) {
  const crowFrames = [
    `
      ___     
     (o,o)    
     (   )    
    -"-"-"-   
    `,
    `
      ___     
     (-,-)    
     (   )    
    -"-"-"-   
    `,
    `
      ___     
     (o,o)    
     (   )    
    -"-"---   
    `,
    `
      ___     
     (o,o)    
     (   )    
    ---"-"-   
    `,
    `
       __     
      (o,o)   
     >(   )   
    --"-"-"-  
    `,
    `
     __       
    (o,o)     
   <(   )<    
    -"-"-"-   
    `,
    `
      ___     
     (o,o)    
     (   )v   
    -"-"-"-   
    `,
    `
      ___     
     (o,-)    
     (   )    
    -"-"-"-   
    `,
    `
      ___     
     (-,o)    
     (   )    
    -"-"-"-   
    `,
    `
      ___     
     (o,o)    
     (   )    
    -"-"-"-   
    `
  ];

  const deathFrames = [
    `
      ___     
     (x,x)    
     (   )    
    -"-"-"-   
    `,
    `
      ___    
   ( x , x )   
    (     )   
    -"---"-   
    `,
    `
    ___ ___   
  ( x  ,  x )  
   (       )  
    -"---"-   
    `,
    `
    ___ ___  
 ( x   ,   x ) 
  (         ) 
    -"---"-   
    `,
    `
      ..  ;
    :      .
  :  : :  .
    -"---"-   
    `,
    `



    -"-"-"-   
    `
  ];

  function getTombstoneArt(deathDate) {
    return `
     .-.
    (RIP)
    |===|
    |${deathDate.padEnd(4)}|
    |===|
    |===|
    ^^^^^
    `;
  }

  let currentFrame = 0;
  let isAlive = !localStorage.getItem('crowIsDead');
  let animationInterval;
  const crowElement = document.getElementById('crow');

  function animateCrow() {
    crowElement.textContent = crowFrames[currentFrame];
    currentFrame = (currentFrame + 1) % crowFrames.length;
  }

  function showTombstone() {
    const deathDate = localStorage.getItem('crowDeathDate') || 'Unknown';
    crowElement.textContent = getTombstoneArt(deathDate);
  }

  function animateDeath() {
    let deathFrame = 0;
    clearInterval(animationInterval);

    const deathInterval = setInterval(() => {
      if (deathFrame < deathFrames.length) {
        crowElement.textContent = deathFrames[deathFrame];
        deathFrame++;
      } else {
        clearInterval(deathInterval);
        showTombstone();
      }
    }, 200);
  }

  crowElement.addEventListener('click', () => {
    if (isAlive) {
      isAlive = false;
      const deathDate = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      localStorage.setItem('crowIsDead', 'true');
      localStorage.setItem('crowDeathDate', deathDate);
      animateDeath();
    }
  });

  // Initial state
  if (isAlive) {
    animationInterval = setInterval(animateCrow, 200);
  } else {
    showTombstone();
  }

} else {
  // For mobile devices, remove the crow element entirely
  const crowElement = document.getElementById('crow');
  if (crowElement) {
    crowElement.remove();
  }
}
