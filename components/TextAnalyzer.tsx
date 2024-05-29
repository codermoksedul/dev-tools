"use client";
import { useState } from "react";
import { FaCopy, FaFileUpload } from "react-icons/fa";

const TextAnalyzer: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [letterCount, setLetterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [sentenceCount, setSentenceCount] = useState<number>(0);
  const [includeSpaces, setIncludeSpaces] = useState<boolean>(true);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);

  const countTextMetrics = (content: string) => {
    let modifiedContent = content;
    if (!includeSpaces) {
      modifiedContent = modifiedContent.replace(/\s+/g, "");
    }
    if (!includePunctuation) {
      modifiedContent = modifiedContent.replace(
        /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
        ""
      );
    }
    if (!includeNumbers) {
      modifiedContent = modifiedContent.replace(/[0-9]/g, "");
    }
    setLetterCount(modifiedContent.length);

    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);

    const sentences = content
      .split(/[.!?]/)
      .filter((sentence) => sentence.trim().length > 0);
    setSentenceCount(sentences.length);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setInputContent(content);
    countTextMetrics(content);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputContent).then(() => {
      alert("Content copied to clipboard!");
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setInputContent(fileContent);
        countTextMetrics(fileContent);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full  flex flex-col justify-center items-center p-5">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Text Analyzer</h1>
        <div className="flex flex-row justify-center items-center gap-5 mb-6">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includeSpaces}
              onChange={() => setIncludeSpaces(!includeSpaces)}
              className="mr-2 checkbox"
            />
            Include Spaces
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includePunctuation}
              onChange={() => setIncludePunctuation(!includePunctuation)}
              className="mr-2 checkbox"
            />
            Include Punctuation
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
              className="mr-2 checkbox"
            />
            Include Numbers
          </label>
        </div>
        <div className="flex flex-col items-center mb-6">
          <textarea
            value={inputContent}
            onChange={handleEditorChange}
            rows={10}
            className="w-full p-5 outline-none border border-slate-700 h-[500px] bg-slate-700/20 rounded mb-4"
            placeholder="Enter your text here..."
          />
          <div className="flex flex-row gap-4">
            <button onClick={handleCopy} className="btn_design">
              <FaCopy className="mr-2" />
              Copy
            </button>
            <label className="btn_design" htmlFor="file">
              <FaFileUpload className="mr-2" />
              Upload File
              <input
                type="file"
                id="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="text-center flex flex-row justify-center items-center gap-5">
          <h2 className="text-xl font-bold">Letter Count: {letterCount}</h2>
          <h2 className="text-xl font-bold">Word Count: {wordCount}</h2>
          <h2 className="text-xl font-bold">Sentence Count: {sentenceCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default TextAnalyzer;
