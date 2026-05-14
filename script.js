const imageUpload = document.getElementById('imageUpload'),
      canvas = document.getElementById('mainCanvas'),
      ctx = canvas.getContext('2d'),
      downloadBtn = document.getElementById('downloadBtn'),
      instruction = document.getElementById('instruction'),
      statusMsg = document.getElementById('status');

let userImg = new Image(), frameImg = new Image();
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false, startX, startY;

// टेम्प्लेट लोड गर्ने
frameImg.src = 'frame.png'; 

frameImg.onerror = function() {
    statusMsg.innerText = "Error: 'frame.png' फाइल भेटिएन। कृपया फाइल अपलोड भएको पक्का गर्नुहोस्।";
    statusMsg.style.color = "red";
};

imageUpload.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        userImg.onload = function() {
            imgScale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            imgX = (canvas.width - userImg.width * imgScale) / 2;
            imgY = (canvas.height - userImg.height * imgScale) / 2;
            
            canvas.style.display = "block";
            instruction.style.display = "block";
            downloadBtn.style.display = "block";
            statusMsg.innerText = "तपाईँको फ्रेम तयार भयो! अब फोटो मिलाउन सक्नुहुन्छ।";
            statusMsg.style.color = "#004a99";
            
            draw();
        }
        userImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImg, imgX, imgY, userImg.width * imgScale, userImg.height * imgScale);
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
}

// अन्तरक्रिया (Interactions)
function getPos(e) {
    let rect = canvas.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    let y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: x * (canvas.width / rect.width), y: y * (canvas.height / rect.height) };
}

function start(e) {
    isDragging = true;
    let pos = getPos(e);
    startX = pos.x; startY = pos.y;
    if(e.type === 'touchstart') e.preventDefault();
}

function move(e) {
    if (!isDragging) return;
    let pos = getPos(e);
    imgX += (pos.x - startX);
    imgY += (pos.y - startY);
    startX = pos.x; startY = pos.y;
    draw();
    if(e.type === 'touchmove') e.preventDefault();
}

function stop() { isDragging = false; }

canvas.onmousedown = start; canvas.ontouchstart = start;
window.onmousemove = move; window.ontouchmove = move;
window.onmouseup = stop; window.ontouchend = stop;

downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Lions_District_325F_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});
