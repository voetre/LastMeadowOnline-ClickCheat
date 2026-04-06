window.cheat = {
    intervalId: null,
    
    findButton: function() {
        const elements = document.querySelectorAll('div, button');
        return Array.from(elements).find(el => 
            el.textContent.trim() === 'Adventure' && 
            el.offsetParent !== null
        );
    },
    applyVisuals: function(btn) {
        const container = btn.closest('.activityButton__8af73') || btn.parentElement;
        const bg = container.querySelector('.background__65fca') || btn;
        bg.style.backgroundColor = '#2ecc71';
        bg.style.transition = 'none';
        if (!container.querySelector('.cheat-label')) {
            const label = document.createElement('div');
            label.className = 'cheat-label';
            label.innerText = 'CHEATING';
            label.style.cssText = `
                color: #2ecc71;
                font-weight: bold;
                font-size: 12px;
                text-align: center;
                position: absolute;
                width: 100%;
                top: -20px;
                left: 0;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 1px 1px 2px black;
            `;
            container.style.position = 'relative';
            container.prepend(label);
        }
    },

    start: function(speed = 5) {
        if (this.intervalId) {
            console.warn("Already running!");
            return;
        }

        console.log("%c[AUTO-START] Adventure Mode: ACTIVATED", "color: #2ecc71; font-weight: bold;");

        this.intervalId = setInterval(() => {
            const btn = this.findButton();
            
            if (btn) {
                this.applyVisuals(btn);

                const clickable = btn.closest('[role="button"]') || btn;
                const key = Object.keys(clickable).find(k => k.startsWith('__reactProps'));
                const handler = clickable[key]?.onClick;

                if (handler) {
                    handler({
                        preventDefault: () => {},
                        stopPropagation: () => {},
                        target: clickable,
                        isTrusted: true
                    });
                }
            }
        }, speed);
    },

    stop: function() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
    
            document.querySelector('.cheat-label')?.remove();
            
            console.log("%c[STOP] Automation halted.", "color: red; font-weight: bold;");
        }
    }
};

window.cheat.start();
