const imageUpload = document.getElementById('imageUpload'),
      canvas = document.getElementById('mainCanvas'),
      ctx = canvas.getContext('2d'),
      downloadBtn = document.getElementById('downloadBtn');

let userImg = new Image(), frameImg = new Image();
let imgX = 512, imgY = 512, imgScale = 0.5;
let isDragging = false, lastX, lastY;
let initialPinchDistance = null;

frameImg.src = 'frame.png';
frameImg.onload = () => draw();

imageUpload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        userImg.src = event.target.result;
        userImg.onload = () => {
            imgScale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height) * 0.8;
            imgX = (canvas.width - userImg.width * imgScale) / 2;
            imgY = (canvas.height - userImg.height * imgScale) / 2;
            draw();
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(userImg.src) {
        ctx.drawImage(userImg, imgX, imgY, userImg.width * imgScale, userImg.height * imgScale);
    }
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
}

// माउस इभेन्ट्स
canvas.onmousedown = (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
window.onmouseup = () => isDragging = false;
canvas.onmousemove = (e) => {
    if(!isDragging) return;
    imgX += (e.clientX - lastX) * (canvas.width / canvas.clientWidth);
    imgY += (e.clientY - lastY) * (canvas.height / canvas.clientHeight);
    lastX = e.clientX; lastY = e.clientY;
    draw();
};
canvas.onwheel = (e) => { e.preventDefault(); imgScale += e.deltaY > 0 ? -0.03 : 0.03; draw(); };

// टच इभेन्ट्स
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }
    else if (e.touches.length === 2) { initialPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault(); 
        const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (initialPinchDistance) { imgScale *= (currentDistance / initialPinchDistance); initialPinchDistance = currentDistance; draw(); }
    } else if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            imgX += dx * (canvas.width / canvas.clientWidth);
            imgY += dy * (canvas.height / canvas.clientHeight);
            lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; draw();
        }
    }
}, { passive: false });

canvas.addEventListener('touchend', () => { isDragging = false; initialPinchDistance = null; });

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'Lions_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
};
