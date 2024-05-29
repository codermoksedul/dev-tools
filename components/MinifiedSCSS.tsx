"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import {
  FaBroom,
  FaCompress,
  FaCopy,
  FaCut,
  FaDownload,
  FaLink,
  FaMagic,
  FaTimes,
} from "react-icons/fa";
import { TbBrandSass } from "react-icons/tb";

function minifySCSS(scss: string): string {
  return scss
    .replace(/\s+/g, " ")
    .replace(/\s*([{};:,])\s*/g, "$1")
    .trim();
}

function beautifySCSS(scss: string): string {
  const beautifiedScss = scss
    .replace(/({|;)([^{};])/g, "$1\n  $2")
    .replace(/}/g, "}\n")
    .trim();
  return beautifiedScss;
}

const MinifiedSCSS: React.FC = () => {
  const [scssContent, setScssContent] = useState<string>("");
  const [outputScss, setOutputScss] = useState<string>("");
  const [isMinified, setIsMinified] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScssContent(value);
      setOutputScss(isMinified ? minifySCSS(value) : beautifySCSS(value));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setScssContent(fileContent);
        setOutputScss(
          isMinified ? minifySCSS(fileContent) : beautifySCSS(fileContent)
        );
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputScss).then(() => {
      alert("Minified SCSS copied to clipboard!");
    });
  };

  const toggleMinifyBeautify = () => {
    setIsMinified(!isMinified);
    setOutputScss(
      isMinified ? beautifySCSS(scssContent) : minifySCSS(scssContent)
    );
  };

  const handleDownload = () => {
    const blob = new Blob([outputScss], { type: "text/x-scss" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.scss";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const fetchScssFromUrl = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const fetchedScss = await response.text();
        setScssContent(fetchedScss);
        setOutputScss(
          isMinified ? minifySCSS(fetchedScss) : beautifySCSS(fetchedScss)
        );
        setPopup(false); // Close the popup after fetching URL
      } else {
        alert("Failed to fetch SCSS from the provided URL.");
      }
    } catch (error) {
      alert("An error occurred while fetching the SCSS.");
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
    setOutputScss("");
  };

  const handleClean = () => {
    setOutputScss(outputScss.trim());
  };

  return (
    <>
      <div className="w-full  flex flex-col justify-center items-center p-5">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            SCSS Minifier & Beautifier
          </h1>
          <div className="flex justify-center my-8">
            <button
              onClick={toggleMinifyBeautify}
              className="btn btn-outline border-slate-700"
            >
              {isMinified ? (
                <>
                  <FaMagic className="mr-2" />
                  Beautify SCSS
                </>
              ) : (
                <>
                  <FaCompress className="mr-2" />
                  Minify SCSS
                </>
              )}
            </button>
          </div>
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
                      accept=".scss"
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
                  defaultLanguage="scss"
                  theme="vs-dark"
                  value={scssContent}
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
                    disabled={!outputScss}
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={handleCut}
                    className="btn_design"
                    disabled={!outputScss}
                  >
                    <FaCut className="mr-2" />
                    Cut
                  </button>
                  <button
                    onClick={handleClean}
                    className="btn_design"
                    disabled={!outputScss}
                  >
                    <FaBroom className="mr-2" />
                    Clean
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn_design"
                    disabled={!outputScss}
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="scss"
                  theme="vs-dark"
                  value={outputScss}
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
                {showUrlInput ? "Fetch SCSS from URL" : "Upload SCSS File"}
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
                  placeholder="Enter URL to fetch SCSS"
                />
                <button onClick={fetchScssFromUrl} className="btn btn-primary">
                  <FaLink className="mr-2" />
                  Fetch SCSS
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MinifiedSCSS;
