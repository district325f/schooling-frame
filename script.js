const imageUpload = document.getElementById('imageUpload');
const createBtn = document.getElementById('createBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusMsg = document.getElementById('status');
const preview = document.getElementById('preview');
const fileNameDisplay = document.getElementById('fileName');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

// महत्वपूर्ण: तपाईँको टेम्प्लेट फाइलको नाम यहाँ जे छ त्यही राख्नुहोला (e.g. '1000145608.png')
const framePath = 'frame.png'; 

let userFile;

imageUpload.addEventListener('change', function(e) {
    userFile = e.target.files[0];
    if (userFile) {
        fileNameDisplay.innerText = "Selected: " + userFile.name;
        createBtn.style.display = "block";
        downloadBtn.style.display = "none";
        statusMsg.style.display = "none";
    }
});

createBtn.addEventListener('click', function() {
    if (!userFile) return;

    statusMsg.innerText = "प्रक्रिया सुरु भयो, कृपया पर्खनुहोस्...";
    statusMsg.style.display = "block";
    createBtn.disabled = true;
    createBtn.innerText = "Processing...";

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImg = new Image();
        userImg.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            let x = (canvas.width / 2) - (userImg.width / 2) * scale;
            let y = (canvas.height / 2) - (userImg.height / 2) * scale;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            const frameImg = new Image();
            frameImg.src = framePath; 

            frameImg.onload = function() {
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
                preview.src = canvas.toDataURL("image/png");
                statusMsg.style.display = "none";
                createBtn.style.display = "none";
                downloadBtn.style.display = "block";
                createBtn.disabled = false;
                createBtn.innerText = "Create Frame Now";
            };

            // यदि फ्रेम लोड भएन भने एरर सन्देश दिने
            frameImg.onerror = function() {
                statusMsg.innerText = "Error: टेम्प्लेट फाइल भेटिएन । कृपया फाइलको नाम जाँच गर्नुहोस् ।";
                createBtn.disabled = false;
                createBtn.innerText = "Create Frame Now";
            };
        };
        userImg.src = event.target.result;
    };
    reader.readAsDataURL(userFile);
});

downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Lions_Frame_325F.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});
