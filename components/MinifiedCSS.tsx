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
import { TbBrandCss3 } from "react-icons/tb";

function minifyCSS(css: string): string {
  return css
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();
}

function beautifyCSS(css: string): string {
  let beautifiedCss = css.replace(/({|;)([^{}])/g, "$1\n  $2");
  beautifiedCss = beautifiedCss.replace(/}/g, "}\n");
  return beautifiedCss.trim();
}

const MinifiedCSS: React.FC = () => {
  const [cssContent, setCssContent] = useState<string>("");
  const [outputCss, setOutputCss] = useState<string>("");
  const [isMinified, setIsMinified] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCssContent(value);
      setOutputCss(isMinified ? minifyCSS(value) : beautifyCSS(value));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setCssContent(fileContent);
        setOutputCss(
          isMinified ? minifyCSS(fileContent) : beautifyCSS(fileContent)
        );
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCss).then(() => {
      alert("Minified CSS copied to clipboard!");
    });
  };

  const toggleMinifyBeautify = () => {
    setIsMinified(!isMinified);
    setOutputCss(isMinified ? beautifyCSS(cssContent) : minifyCSS(cssContent));
  };

  const handleDownload = () => {
    const blob = new Blob([outputCss], { type: "text/css" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.css";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const fetchCssFromUrl = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const fetchedCss = await response.text();
        setCssContent(fetchedCss);
        setOutputCss(
          isMinified ? minifyCSS(fetchedCss) : beautifyCSS(fetchedCss)
        );
        setPopup(false); // Close the popup after fetching URL
      } else {
        alert("Failed to fetch CSS from the provided URL.");
      }
    } catch (error) {
      alert("An error occurred while fetching the CSS.");
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
    setOutputCss("");
  };

  const handleClean = () => {
    setOutputCss(outputCss.trim());
  };

  return (
    <>
      <div className="w-full  flex flex-col justify-center items-center p-5">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            CSS Minifier & Beautifier
          </h1>
          <div className="flex justify-center my-8">
            <button
              onClick={toggleMinifyBeautify}
              className="btn btn-outline border-slate-700"
            >
              {isMinified ? (
                <>
                  <FaMagic className="mr-2" />
                  Beautify CSS
                </>
              ) : (
                <>
                  <FaCompress className="mr-2" />
                  Minify CSS
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="inputBox editorBox">
              <div className="heading p-2">
                <div className="flex flex-row justify-start items-center gap-5">
                  <label className="btn_design" htmlFor="file">
                    <TbBrandCss3 className="mr-2" />
                    File
                    <input
                      type="file"
                      id="file"
                      accept=".css"
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
                  defaultLanguage="css"
                  theme="vs-dark"
                  value={cssContent}
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
                    disabled={!outputCss}
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={handleCut}
                    className="btn_design"
                    disabled={!outputCss}
                  >
                    <FaCut className="mr-2" />
                    Cut
                  </button>
                  <button
                    onClick={handleClean}
                    className="btn_design"
                    disabled={!outputCss}
                  >
                    <FaBroom className="mr-2" />
                    Clean
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn_design"
                    disabled={!outputCss}
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="css"
                  theme="vs-dark"
                  value={outputCss}
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
                {showUrlInput ? "Fetch CSS from URL" : "Upload CSS File"}
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
                  placeholder="Enter URL to fetch CSS"
                />
                <button onClick={fetchCssFromUrl} className="btn btn-primary">
                  <FaLink className="mr-2" />
                  Fetch CSS
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MinifiedCSS;
