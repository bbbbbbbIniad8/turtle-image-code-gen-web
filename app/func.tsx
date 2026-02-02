const copyToClipboard = async (text: string) => {
try {
await navigator.clipboard.writeText(text);
} catch (err) {
console.error('コピー失敗', err);
}
};

const adjustSize = (maxSize: number, width: number, height: number): [number, number] => {
const ratio = Math.min(maxSize / width, maxSize / height);
return [
    Math.round(width * ratio),
    Math.round(height * ratio)
];
}

const rgbToHex = (r: number, g: number, b: number): string => {
const toHex = (c: number) => c.toString(16).padStart(2, '0');
return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const exportImageData = (data: ImageDataArray, canvas: HTMLCanvasElement) =>{
const result = []
for (let i = 0; i < data.length; i += 4) {
    
    result.push(`"${rgbToHex(data[i], data[i+1], data[i+2])}"`);
    };

result.push(`[${[canvas.width, canvas.height]}]`);
return `[${result}]`

}

function loadImage(src: string): Promise<HTMLImageElement> {
return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    
});
}

export {copyToClipboard, adjustSize, exportImageData, loadImage}