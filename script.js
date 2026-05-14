const imageUpload = document.getElementById('imageUpload');
const createBtn = document.getElementById('createBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusMsg = document.getElementById('status');
const preview = document.getElementById('preview');
const fileNameDisplay = document.getElementById('fileName');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let userFile;

// १. युजरले फोटो छान्नासाथ "Create Frame" बटन देखाउने
imageUpload.addEventListener('change', function(e) {
    userFile = e.target.files[0];
    if (userFile) {
        fileNameDisplay.innerText = "Selected: " + userFile.name;
        createBtn.style.display = "block"; // बटन देखियो
        downloadBtn.style.display = "none";
        preview.style.opacity = "0.5"; // अलि धमिलो बनाउने ताकि नयाँ बन्दैछ भन्ने बुझियोस्
    }
});

// २. बटन थिचेपछि मात्र फोटो प्रोसेस गर्ने
createBtn.addEventListener('click', function() {
    if (!userFile) return;

    statusMsg.style.display = "block";
    createBtn.disabled = true;
    createBtn.innerText = "Processing...";

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImg = new Image();
        userImg.onload = function() {
            // क्यानभासमा ड्र गर्ने
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            let x = (canvas.width / 2) - (userImg.width / 2) * scale;
            let y = (canvas.height / 2) - (userImg.height / 2) * scale;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // फ्रेम थप्ने
            const frameImg = new Image();
            frameImg.src = 'frame.png'; 
            frameImg.onload = function() {
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
                
                // नतिजा देखाउने
                preview.src = canvas.toDataURL("image/png");
                preview.style.opacity = "1";
                statusMsg.style.display = "none";
                createBtn.style.display = "none";
                downloadBtn.style.display = "block";
            };
        };
        userImg.src = event.target.result;
    };
    reader.readAsDataURL(userFile);
});

// ३. डाउनलोड
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Cabinet_Schooling_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});
