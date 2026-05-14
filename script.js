const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const instruction = document.getElementById('instruction');
const statusMsg = document.getElementById('status');

let userImg = new Image();
let frameImg = new Image();
frameImg.src = 'frame.png'; // तपाईँको टेम्प्लेट फाइल

let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false;
let startX, startY;

// १. फोटो अपलोड भएपछि
imageUpload.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        userImg.onload = function() {
            // सुरुमा फोटोलाई फ्रेममा अट्ने गरी अटो-साइज गर्ने
            imgScale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            imgX = (canvas.width - userImg.width * imgScale) / 2;
            imgY = (canvas.height - userImg.height * imgScale) / 2;
            
            canvas.style.display = "block";
            instruction.style.display = "block";
            downloadBtn.style.display = "block";
            statusMsg.innerText = "तपाईँको फ्रेम तयार भयो!";
            
            draw();
        }
        userImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

// २. ड्र गर्ने मुख्य फङ्सन
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // फोटो ड्र गर्ने
    ctx.drawImage(userImg, imgX, imgY, userImg.width * imgScale, userImg.height * imgScale);
    
    // माथिबाट फ्रेम ड्र गर्ने
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
}

// ३. माउस र टच कन्ट्रोल (सार्नको लागि)

// माउस थिच्दा
canvas.onmousedown = function(e) {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
};

// माउस छोड्दा
window.onmouseup = function() {
    isDragging = false;
};

// माउस चलाउँदा
canvas.onmousemove = function(e) {
    if (isDragging) {
        // क्यानभासको वास्तविक साइज र स्क्रिनमा देखिने साइजको अनुपात मिलाउने
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;

        let dx = (e.offsetX - startX) * scaleX;
        let dy = (e.offsetY - startY) * scaleY;

        imgX += dx;
        imgY += dy;

        startX = e.offsetX;
        startY = e.offsetY;
        draw();
    }
};

// मोबाइलको लागि टच कन्ट्रोल
canvas.ontouchstart = function(e) {
    isDragging = true;
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    startX = touch.clientX - rect.left;
    startY = touch.clientY - rect.top;
    e.preventDefault();
};

canvas.ontouchend = function() {
    isDragging = false;
};

canvas.ontouchmove = function(e) {
    if (isDragging) {
        let touch = e.touches[0];
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;

        let currentX = touch.clientX - rect.left;
        let currentY = touch.clientY - rect.top;

        let dx = (currentX - startX) * scaleX;
        let dy = (currentY - startY) * scaleY;

        imgX += dx;
        imgY += dy;

        startX = currentX;
        startY = currentY;
        draw();
    }
    e.preventDefault();
};

// ४. डाउनलोड
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Lions_District_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});
