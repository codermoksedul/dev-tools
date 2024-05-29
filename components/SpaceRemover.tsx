"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import {
  FaBroom,
  FaCopy,
  FaCut,
  FaDownload,
  FaLink,
  FaTimes,
} from "react-icons/fa";
import { TbBrandSass } from "react-icons/tb";

function removeSpaces(content: string): string {
  return content.replace(/\s+/g, " ").trim();
}

const SpaceRemover: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [outputContent, setOutputContent] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setInputContent(value);
      setOutputContent(removeSpaces(value));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setInputContent(fileContent);
        setOutputContent(removeSpaces(fileContent));
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent).then(() => {
      alert("Output content copied to clipboard!");
    });
  };

  const handleDownload = () => {
    const blob = new Blob([outputContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const fetchContentFromUrl = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const fetchedContent = await response.text();
        setInputContent(fetchedContent);
        setOutputContent(removeSpaces(fetchedContent));
        setPopup(false); // Close the popup after fetching URL
      } else {
        alert("Failed to fetch content from the provided URL.");
      }
    } catch (error) {
      alert("An error occurred while fetching the content.");
    }
  };

  const handleShowPopup = () => {
    setPopup(true);
    setShowUrlInput(false); // Reset URL input state
  };

  const handleShowUrlInput = () => {
    setShowUrlInput(true);
    setPopup(true); // Show popup when URL button is clicked
  };

  const handleClosePopup = () => {
    setPopup(false);
  };

  const handleCut = () => {
    setOutputContent("");
  };

  const handleClean = () => {
    setOutputContent(outputContent.trim());
  };

  return (
    <>
      <div className="w-full  flex flex-col justify-center items-center p-5">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">Space Remover</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="inputBox editorBox">
              <div className="heading p-2">
                <div className="flex flex-row justify-start items-center gap-5">
                  <label className="btn_design" htmlFor="file">
                    <TbBrandSass className="mr-2" />
                    File
                    <input
                      type="file"
                      id="file"
                      accept=".scss,.css,.html,.js,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button onClick={handleShowUrlInput} className="btn_design">
                    <FaLink className="mr-2" />
                    URL
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="text"
                  theme="vs-dark"
                  value={inputContent}
                  onChange={handleEditorChange}
                  options={{
                    wordWrap: "on",
                    minimap: { enabled: false },
                    scrollbar: {
                      verticalScrollbarSize: 5,
                      horizontalScrollbarSize: 5,
                    },
                    fontFamily: "Dm Sans, monospace",
                    fontSize: 16,
                    lineHeight: 20,
                    fontWeight: "500",
                  }}
                  className="border-t border-slate-700"
                />
              </div>
            </div>
            <div className="outPutBox editorBox">
              <div className="heading p-2">
                <div className="flex flex-row justify-end items-center gap-5">
                  <button
                    onClick={handleCopy}
                    className="btn_design"
                    disabled={!outputContent}
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={handleCut}
                    className="btn_design"
                    disabled={!outputContent}
                  >
                    <FaCut className="mr-2" />
                    Cut
                  </button>
                  <button
                    onClick={handleClean}
                    className="btn_design"
                    disabled={!outputContent}
                  >
                    <FaBroom className="mr-2" />
                    Clean
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn_design"
                    disabled={!outputContent}
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="text"
                  theme="vs-dark"
                  value={outputContent}
                  options={{
                    readOnly: true,
                    wordWrap: "on",
                    minimap: { enabled: false },
                    scrollbar: {
                      verticalScrollbarSize: 5,
                      horizontalScrollbarSize: 5,
                    },
                    fontFamily: "Dm Sans, monospace",
                    fontSize: 16,
                    lineHeight: 20,
                    fontWeight: "500",
                  }}
                  className="border-t border-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {popup && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup_content">
            <div className="flex flex-col justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {showUrlInput ? "Fetch Content from URL" : "Upload File"}
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 absolute right-3 top-3 "
              >
                <FaTimes />
              </button>
            </div>
            {showUrlInput ? (
              <div className="flex flex-col justify-center items-center gap-5 w-full">
                <input
                  type="text"
                  className="input w-full input-bordered"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Enter URL to fetch content"
                />
                <button
                  onClick={fetchContentFromUrl}
                  className="btn btn-primary"
                >
                  <FaLink className="mr-2" />
                  Fetch Content
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SpaceRemover;
