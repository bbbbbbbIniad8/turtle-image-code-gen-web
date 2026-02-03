"use client";

import { useState, DragEvent, useRef } from "react";
import {turtle_code_first, turtle_code_second, union_code} from "./turtle";
import {adjustSize, exportImageData, loadImage} from "./func"
import CustomSelect from "@/component/customSelect";
import CustomLink from "@/component/link";
import './globals.css';

export default function GifCreator() {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [createdCodeFirst, setCreatedCodeFirst] = useState("");
  const [image, setImage] = useState<HTMLImageElement>();
  const [resolution, setResolution] = useState(64);
  const [penSize, setPenSize] = useState(3);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const generateCode = async (image: HTMLImageElement | undefined, resolution: number) => {
    setResolution(resolution);
    if (!image){ return}
    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      [canvas.width, canvas.height] = adjustSize(resolution, image.naturalWidth, image.naturalHeight);
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processedData = exportImageData(imagedata.data, canvas);
      setCreatedCodeFirst(turtle_code_first(processedData));
      setLastUpdated(new Date().toLocaleTimeString('ja-JP', timeOptions))
    } catch (error) {
      console.log("GIF生成エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      processFile(target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const processFile = async(file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = await loadImage(url);
    setImage(image);
    URL.revokeObjectURL(url);
    generateCode(image, resolution);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };


  const copyToClipboard = async (text: string) => {
    try {
    await navigator.clipboard.writeText(text);
    if (ref.current){
      const orginalText = ref.current.textContent;
      ref.current.textContent = "コピーしました";

      setTimeout(() => {
        if(ref.current){
          ref.current.textContent = orginalText
        }
      }, 2000);
    }
    } catch (err) {
    console.error('コピー失敗', err);
    }
};

  return (
    <div className="text-center flex flex-col items-center">
      <h1 className="pt-10 pb-5 font-semibold w-screen text-4xl
      orange-500 text-white bg-green-500">画像出力亀さん</h1>
      <div className="py-2 border-b w-2/2 mb-5 bg-amber-200">
        INIADが提供している
        <CustomLink url="https://webterm-moocs.iniad.org/turtle.html">Turtle Graphicsをブラウザで動かせるサイト</CustomLink>
        で亀さんに画像を出力させるPythonコードを自動作成できるサイトです。
          </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center  w-4/5 sm:w-3/5">
        <div className="flex flex-col items-center w-2/2 sm:w-3/5">
          {createdCodeFirst != "" && 
          <div className="bg-green-500 font-medium text-white px-2 rounded-2xl text-sm w-2/2">画像読み込み済み</div>}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl py-10 transition-colors my-1 w-5/5
              ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
              ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >      
            <label className={`px-6 py-3 bg-indigo-600 text-white rounded-lg
            font-bold cursor-pointer 
              ${loading ? 'bg-gray-400' : 'hover:bg-indigo-700'}`}>
              画像を選択
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
                accept="image/*"
              />
            </label>
            <p className="mt-4 text-gray-500 text-sm">ここに画像をドロップしてもOK</p>
            
          </div>
        </div>

        <p className="p-5 font-bold">
          {loading ? "生成中..." : ""}
        </p>

        
        <div className="flex flex-col justify-center w-2/2 sm:w-2/5">
          <div className="flex flex-col justify-center bg-gray-200 rounded-2xl p-5 font-midium">
            <CustomSelect labelText="最大解像度" elementName="resolution" defaultVal={resolution} optionLst={[16, 32, 64, 128]}
              handleEvent={e => generateCode(image, Number(e.target.value))}/>

            <div className="text-xs pb-3">解像度を上げると画像をより精密に描画できますが、描画までの処理時間が長くなります。</div>
            <div className="flex flex-row justify-center items-center" >
              <CustomSelect labelText="描画倍率" elementName="penSize" defaultVal={penSize} optionLst={[1, 2, 3, 4, 5]}
              handleEvent={e => {setPenSize(Number(e.target.value));
                                 setLastUpdated(new Date().toLocaleTimeString('ja-JP', timeOptions));}}/>
            </div>
            <div className="text-xs pb-3">キャンバスに画像を描画するのに使用するペンサイズを指定できます。</div>
          </div>
        </div>
      </div>

      {
        createdCodeFirst != "" &&
        <div className="flex flex-col items-center justify-center bg-blue-300 rounded-2xl p-5 m-5 w-4/5 sm:w-3/5">
          <div className="text-2xl font-medium" >準備完了!!</div>
          <div className="flex flex-row">
            <div className="flex flex-col px-3 rounded-2xl">
              <div>最終更新時間: {lastUpdated}</div>
              <div>
                  最大解像度: {resolution}
              </div>
              <div>
                  描画倍率: {penSize}
              </div>
            </div>
            <div>
              <div onClick={() => copyToClipboard(union_code(createdCodeFirst, turtle_code_second(penSize)))} ref={ref} 
                  className="px-3 py-3 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer  hover:bg-indigo-700">
                    コードをコピー
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}