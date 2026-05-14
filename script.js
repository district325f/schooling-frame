const imageUpload = document.getElementById('imageUpload'),
      canvas = document.getElementById('mainCanvas'),
      ctx = canvas.getContext('2d'),
      downloadBtn = document.getElementById('downloadBtn');

let userImg = new Image(), frameImg = new Image();
let imgX = 512, imgY = 512, imgScale = 0.5;
let isDragging = false, lastX, lastY;
let initialPinchDistance = null; // मोबाइल जुमको लागि

frameImg.src = 'frame.png';
frameImg.onload = () => draw();

imageUpload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        userImg.src = event.target.result;
        userImg.onload = () => {
            // सुरुमा फोटोलाई बिचमा र ठिक्क साइजमा राख्ने
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

// १. माउस इभेन्ट्स (डेस्कटपका लागि)
canvas.onmousedown = (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
window.onmouseup = () => isDragging = false;
canvas.onmousemove = (e) => {
    if(!isDragging) return;
    imgX += (e.clientX - lastX) * (canvas.width / canvas.clientWidth);
    imgY += (e.clientY - lastY) * (canvas.height / canvas.clientHeight);
    lastX = e.clientX; lastY = e.clientY;
    draw();
};
canvas.onwheel = (e) => {
    e.preventDefault();
    imgScale += e.deltaY > 0 ? -0.03 : 0.03;
    draw();
};

// २. टच इभेन्ट्स (मोबाइलका लागि - Drag र Pinch Zoom)
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // दुई औंला बीचको दुरी नाप्ने
        initialPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
        // मोबाइलमा फोटो सार्ने
        imgX += (e.touches[0].clientX - lastX) * (canvas.width / canvas.clientWidth);
        imgY += (e.touches[0].clientY - lastY) * (canvas.height / canvas.clientHeight);
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // मोबाइलमा दुई औंलाले जुम गर्ने
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        if (initialPinchDistance) {
            const zoomFactor = currentDistance / initialPinchDistance;
            imgScale *= zoomFactor;
            initialPinchDistance = currentDistance;
        }
    }
    draw();
}, { passive: false });

canvas.addEventListener('touchend', () => {
    isDragging = false;
    initialPinchDistance = null;
});

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'Lions_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
};
