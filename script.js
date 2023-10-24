const apiKey = "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";
const maxImages = 8;
const generateInfo = document.getElementById("generate");
const imageGrid = document.getElementById("image-grid");
const loading = document.getElementById("loading");

async function generateImages(input) {
    generateInfo.disabled = true;
    imageGrid.innerHTML = "";
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        width: 512,
                        height: 768,
                    },
                }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        imageGrid.appendChild(img);
    }

    loading.style.display = "none";
    generateInfo.disabled = false;
}

generateInfo.addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}
