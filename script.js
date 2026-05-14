const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

const frameImg = new Image();
frameImg.src = 'frame.png'; // तपाईँको फ्रेम फाइलको नाम

imageUpload.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const userImg = new Image();
        userImg.onload = function() {
            // क्यानभास सफा गर्ने
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // १. युजरको फोटोलाई 'Cover' मोडमा ड्र गर्ने (अटो साइज)
            let scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            let x = (canvas.width / 2) - (userImg.width / 2) * scale;
            let y = (canvas.height / 2) - (userImg.height / 2) * scale;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // २. माथिबाट फ्रेम राख्ने
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            // प्रिभ्यु देखाउने
            preview.src = canvas.toDataURL("image/png");
            downloadBtn.style.display = "inline-block";
        }
        userImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

// डाउनलोड फङ्सन
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'Lions_Cabinet_Schooling_Frame.png';
    link.href = canvas.toDataURL("image/png", 1.0); // Full Quality
    link.click();
});
