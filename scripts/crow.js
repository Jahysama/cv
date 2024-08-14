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

        let currentFrame = 0;
        let isAlive = true;
        let animationInterval;
        const crowElement = document.getElementById('crow');

        function animateCrow() {
            crowElement.textContent = crowFrames[currentFrame];
            currentFrame = (currentFrame + 1) % crowFrames.length;
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
                }
            }, 200);
        }

        crowElement.addEventListener('click', () => {
            if (isAlive) {
                isAlive = false;
                animateDeath();
            }
        });

        animationInterval = setInterval(animateCrow, 200);


