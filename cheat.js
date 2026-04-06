window.cheat = {
    intervalId: null,
    speed: 5,
    isRunning: false,

    findButton: function() {
        const elements = document.querySelectorAll('div, button');
        return Array.from(elements).find(el => 
            el.textContent.trim() === 'Adventure' && 
            el.offsetParent !== null
        );
    },

    injectUI: function(container) {
        if (document.getElementById('cheat-controls')) return;

        const controls = document.createElement('div');
        controls.id = 'cheat-controls';
        controls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            position: absolute;
            left: -160px; 
            top: 50%;
            transform: translateY(-50%);
            background: #232428;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #2ecc71;
            z-index: 9999;
        `;

        const input = document.createElement('input');
        input.type = 'number';
        input.value = this.speed;
        input.title = "Milliseconds between clicks (lower = faster)";
        input.style.cssText = "width: 45px; background: #1e1f22; color: white; border: 1px solid #4e5058; border-radius: 4px; padding: 2px; font-size: 12px;";
        
        input.oninput = (e) => { 
            this.speed = Math.max(1, parseInt(e.target.value) || 1); 
            if (this.isRunning) {
                console.log(`Live updating speed to: ${this.speed}ms`);
                this.start(this.speed, true); 
            }
        };

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'cheat-toggle-btn';
        toggleBtn.innerText = this.isRunning ? 'STOP' : 'START';
        toggleBtn.style.cssText = `
            background: ${this.isRunning ? '#ed4245' : '#2ecc71'};
            color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-weight: bold; font-size: 10px;
        `;
        
        toggleBtn.onclick = () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start(this.speed);
            }
            this.updateButtonUI();
        };

        controls.appendChild(input);
        controls.appendChild(toggleBtn);
        container.style.position = 'relative';
        container.appendChild(controls);
    },

    updateButtonUI: function() {
        const btn = document.getElementById('cheat-toggle-btn');
        if (!btn) return;
        btn.innerText = this.isRunning ? 'STOP' : 'START';
        btn.style.backgroundColor = this.isRunning ? '#ed4245' : '#2ecc71';
    },

    applyVisuals: function(btn) {
        const container = btn.closest('.activityButton__8af73') || btn.parentElement;
        this.injectUI(container);
        
        const bg = container.querySelector('.background__65fca') || btn;
        bg.style.backgroundColor = this.isRunning ? '#2ecc71' : ''; 

        let label = container.querySelector('.cheat-label');
        if (this.isRunning) {
            if (!label) {
                label = document.createElement('div');
                label.className = 'cheat-label';
                label.innerText = 'CHEATING';
                label.style.cssText = "color: #2ecc71; font-weight: bold; font-size: 12px; position: absolute; width: 100%; top: -20px; text-align: center; letter-spacing: 2px; pointer-events: none;";
                container.prepend(label);
            }
        } else {
            label?.remove();
        }
    },

    start: function(speed, isLiveUpdate = false) {
        if (this.intervalId) clearInterval(this.intervalId);
        
        this.isRunning = true;
        if (!isLiveUpdate) this.updateButtonUI();

        this.intervalId = setInterval(() => {
            const btn = this.findButton();
            if (btn) {
                this.applyVisuals(btn);
                const clickable = btn.closest('[role="button"]') || btn;
                const key = Object.keys(clickable).find(k => k.startsWith('__reactProps'));
                clickable[key]?.onClick?.({ 
                    preventDefault: () => {}, 
                    stopPropagation: () => {}, 
                    target: clickable, 
                    isTrusted: true 
                });
            }
        }, speed);
    },

    stop: function() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isRunning = false;
        this.updateButtonUI();
        const btn = this.findButton();
        if (btn) this.applyVisuals(btn);
    }
};

setInterval(() => {
    const btn = window.cheat.findButton();
    if (btn) window.cheat.applyVisuals(btn);
}, 1000);
