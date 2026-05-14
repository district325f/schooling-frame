const imageUpload = document.getElementById('imageUpload'),
      canvas = document.getElementById('mainCanvas'),
      ctx = canvas.getContext('2d'),
      downloadBtn = document.getElementById('downloadBtn');

let userImg = new Image(), frameImg = new Image();
let imgX = 512, imgY = 512, imgScale = 0.5; // फ्रेममा फिट हुने गरी सुरुको सेटिङ
let isDragging = false, lastX, lastY;

frameImg.src = 'frame.png';

// फ्रेम सधैं देखाउन
frameImg.onload = () => draw();

imageUpload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        userImg.src = event.target.result;
        userImg.onload = () => draw();
    };
    reader.readAsDataURL(e.target.files[0]);
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(userImg.src) ctx.drawImage(userImg, imgX, imgY, userImg.width * imgScale, userImg.height * imgScale);
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
}

// Drag & Zoom लजिक
canvas.onmousedown = (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
window.onmouseup = () => isDragging = false;
canvas.onmousemove = (e) => {
    if(!isDragging) return;
    imgX += (e.clientX - lastX); imgY += (e.clientY - lastY);
    lastX = e.clientX; lastY = e.clientY;
    draw();
};

// Mouse Wheel ले Zoom गर्ने
canvas.onwheel = (e) => {
    e.preventDefault();
    let zoomSpeed = 0.05;
    imgScale += e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    draw();
};

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = 'Lions_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
};
