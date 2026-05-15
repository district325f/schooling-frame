const frameImg = new Image();
frameImg.src = 'frame.png'; // यहाँ तपाइँको फ्रेम फाइलको नाम राख्नुहोस्

// दुवै फ्रेमका लागि डाटा स्ट्रक्चर
const frameData = {
    1: { canvas: document.getElementById('canvas1'), ctx: document.getElementById('canvas1').getContext('2d'), userImg: new Image(), x: 512, y: 512, scale: 0.5, dragging: false, lastX: 0, lastY: 0, initialDist: null },
    2: { canvas: document.getElementById('canvas2'), ctx: document.getElementById('canvas2').getContext('2d'), userImg: new Image(), x: 512, y: 512, scale: 0.5, dragging: false, lastX: 0, lastY: 0, initialDist: null }
};

frameImg.onload = () => { draw(1); draw(2); };

function draw(id) {
    const f = frameData[id];
    f.ctx.clearRect(0, 0, f.canvas.width, f.canvas.height);
    if(f.userImg.src) {
        f.ctx.drawImage(f.userImg, f.x, f.y, f.userImg.width * f.scale, f.userImg.height * f.scale);
    }
    f.ctx.drawImage(frameImg, 0, 0, f.canvas.width, f.canvas.height);
}

// फोटो अपलोड ह्यान्डलर
document.querySelectorAll('.img-input').forEach(input => {
    input.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const f = frameData[id];
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                f.userImg = new Image();
                f.userImg.onload = () => {
                    f.scale = Math.max(f.canvas.width / f.userImg.width, f.canvas.height / f.userImg.height) * 0.8;
                    f.x = (f.canvas.width - f.userImg.width * f.scale) / 2;
                    f.y = (f.canvas.height - f.userImg.height * f.scale) / 2;
                    document.querySelector(`.remove-btn[data-id="${id}"]`).style.display = 'inline-block';
                    draw(id);
                };
                f.userImg.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
});

// फोटो हटाउने ह्यान्डलर
document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = (e) => {
        const id = e.target.dataset.id;
        const f = frameData[id];
        f.userImg = new Image();
        document.querySelector(`.img-input[data-id="${id}"]`).value = "";
        e.target.style.display = 'none';
        draw(id);
    };
});

// माउस र टच इभेन्टहरू (दुवै क्यानभासका लागि)
[1, 2].forEach(id => {
    const f = frameData[id];
    const canvas = f.canvas;

    canvas.onmousedown = (e) => { f.dragging = true; f.lastX = e.clientX; f.lastY = e.clientY; };
    window.addEventListener('mouseup', () => f.dragging = false);
    canvas.onmousemove = (e) => {
        if(!f.dragging || !f.userImg.src) return;
        f.x += (e.clientX - f.lastX) * (canvas.width / canvas.clientWidth);
        f.y += (e.clientY - f.lastY) * (canvas.height / canvas.clientHeight);
        f.lastX = e.clientX; f.lastY = e.clientY;
        draw(id);
    };

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) { f.dragging = true; f.lastX = e.touches[0].clientX; f.lastY = e.touches[0].clientY; }
        else if (e.touches.length === 2) { f.initialDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (!f.userImg.src) return;
        if (e.touches.length === 2) {
            e.preventDefault(); 
            const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            if (f.initialDist) { f.scale *= (dist / f.initialDist); f.initialDist = dist; draw(id); }
        } else if (e.touches.length === 1 && f.dragging) {
            const dx = e.touches[0].clientX - f.lastX;
            const dy = e.touches[0].clientY - f.lastY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                f.x += dx * (canvas.width / canvas.clientWidth);
                f.y += dy * (canvas.height / canvas.clientHeight);
                f.lastX = e.touches[0].clientX; f.lastY = e.touches[0].clientY; draw(id);
            }
        }
    }, { passive: false });
});

// डाउनलोड बटन ह्यान्डलर
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.onclick = (e) => {
        const id = e.target.dataset.id;
        const canvas = frameData[id].canvas;
        const link = document.createElement('a');
        link.download = `Lions_Frame_Day_${id}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    };
});
