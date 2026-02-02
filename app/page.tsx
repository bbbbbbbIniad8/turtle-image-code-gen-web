"use client";

import { useState, DragEvent } from "react";
import {turtle_code_first, turtle_code_second, union_code} from "./turtle";
import {copyToClipboard, adjustSize, exportImageData, loadImage} from "./func"
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

  return (
    <div className="text-center flex flex-col items-center">
      <h1 className="p-10 font-semibold w-screen text-3xl
      orange-500 text-white bg-orange-500">画像出力亀</h1>
      <div className="py-3">
        <CustomLink url="https://webterm-moocs.iniad.org/turtle.html">このサイト</CustomLink>
        で亀さんに画像を出力してもらうPythonコードを自動作成できるサイトです。
          </div>

      <div>ステップ1: 画像の選択</div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl py-10 transition-colors w-1/2 my-1
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

      <p className="p-5 font-bold">
        {loading ? "生成中..." : ""}
      </p>

      <div>ステップ2: 解像度、キャンパスへの描画サイズ(1pxごとのペンの太さ)を設定</div>
      <div className="w-1/2 flex flex-row justify-center">
        <CustomSelect labelText="最大解像度" elementName="resolution" defaultVal={resolution} optionLst={[16, 32, 64, 128]}
          handleEvent={e => generateCode(image, Number(e.target.value))}/>

        <div className="flex flex-row justify-center items-center" >
          <CustomSelect labelText="キャンバスへの描画サイズ" elementName="penSize" defaultVal={penSize} optionLst={[1, 2, 3, 4, 5]}
          handleEvent={e => setPenSize(Number(e.target.value))}/>
        </div>
      </div>

      {
        createdCodeFirst != "" &&
        <div className="flex flex-col items-center">
          <div>作成が完了しました。
              <CustomLink url="https://webterm-moocs.iniad.org/turtle.html">サイト</CustomLink>にアクセスして、コードをコピペしてRUNボタンを押してください。</div>
          <div>
          <div onClick={() => copyToClipboard(union_code(createdCodeFirst, turtle_code_second(penSize)))}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer  hover:bg-indigo-700 w-50">
                コードをコピー</div>
          </div>
        </div>
      }
    </div>
  );
}