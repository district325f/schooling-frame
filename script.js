const imageUpload = document.getElementById('imageUpload');
const createBtn = document.getElementById('createBtn');
const statusMsg = document.getElementById('statusMsg');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile;

// १. फोटो सेलेक्ट भएपछि "Create" बटन देखाउने
imageUpload.addEventListener('change', function(e) {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        createBtn.style.display = "block";
        downloadBtn.style.display = "none"; // पुरानो डाउनलोड बटन लुकाउने
    }
});

// २. बटन थिचेपछि फ्रेम बनाउने मुख्य प्रक्रिया
createBtn.addEventListener('click', function() {
    if (!selectedFile) return;

    // बटन डिसेबल गर्ने र लोडिङ म्यासेज देखाउने
    createBtn.disabled = true;
    createBtn.innerText = "Processing...";
    statusMsg.style.display = "block";

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImg = new Image();
        userImg.onload = function() {
            // क्यानभास सफा गर्ने
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // एचडी क्वालिटी सेटिङ
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // युजरको फोटोको साइज मिलाउने (Aspect Ratio नमिल्ने गरी नकाटियोस् भनेर)
            let scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            let x = (canvas.width / 2) - (userImg.width / 2) * scale;
            let y = (canvas.height / 2) - (userImg.height / 2) * scale;

            // पहिले युजरको फोटो ड्र गर्ने
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // अब माथिबाट फ्रेम राख्ने
            const frameImg = new Image();
            frameImg.src = 'frame.png'; // तपाईँको टेम्प्लेटको नाम
            
            frameImg.onload = function() {
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

                // अन्तिम नतिजा प्रिभ्युमा देखाउने
                const finalImage = canvas.toDataURL("image/png", 1.0);
                preview.src = finalImage;
                
                // लोडिङ म्यासेज हटाउने र डाउनलोड बटन देखाउने
                statusMsg.style.display = "none";
                createBtn.style.display = "none";
                createBtn.disabled = false;
                createBtn.innerText = "Create Frame";
                downloadBtn.style.display = "block";
            };
        };
        userImg.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
});

// ३. डाउनलोड गर्ने फङ्सन
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Lions_Cabinet_Schooling_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});
