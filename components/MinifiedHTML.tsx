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

function minifyHTML(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

function beautifyHTML(html: string): string {
  const beautifiedHtml = html
    .replace(/>\s*</g, ">\n<")
    .replace(/\s{2,}/g, " ")
    .replace(/<([^>]+)>/g, (match, p1) => `<${p1.trim()}>`)
    .replace(/\n\s+/g, "\n")
    .trim();
  return beautifiedHtml;
}

const MinifiedHTML: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [outputHtml, setOutputHtml] = useState<string>("");
  const [isMinified, setIsMinified] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setHtmlContent(value);
      setOutputHtml(isMinified ? minifyHTML(value) : beautifyHTML(value));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setHtmlContent(fileContent);
        setOutputHtml(
          isMinified ? minifyHTML(fileContent) : beautifyHTML(fileContent)
        );
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputHtml).then(() => {
      alert("Minified HTML copied to clipboard!");
    });
  };

  const toggleMinifyBeautify = () => {
    setIsMinified(!isMinified);
    setOutputHtml(
      isMinified ? beautifyHTML(htmlContent) : minifyHTML(htmlContent)
    );
  };

  const handleDownload = () => {
    const blob = new Blob([outputHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.html";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const fetchHtmlFromUrl = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const fetchedHtml = await response.text();
        setHtmlContent(fetchedHtml);
        setOutputHtml(
          isMinified ? minifyHTML(fetchedHtml) : beautifyHTML(fetchedHtml)
        );
        setPopup(false); // Close the popup after fetching URL
      } else {
        alert("Failed to fetch HTML from the provided URL.");
      }
    } catch (error) {
      alert("An error occurred while fetching the HTML.");
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
    setOutputHtml("");
  };

  const handleClean = () => {
    setOutputHtml(outputHtml.trim());
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-center items-center p-5">
        <div className="w-full max-w-[1400px] mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">
            HTML Minifier & Beautifier
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="inputBox">
              <div className="heading py-3">
                <div className="flex flex-row justify-start items-center gap-5">
                  <label
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center cursor-pointer"
                    htmlFor="file"
                  >
                    <FaLink className="mr-2" />
                    File
                    <input
                      type="file"
                      id="file"
                      accept=".html"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleShowUrlInput}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center"
                  >
                    <FaLink className="mr-2" />
                    URL
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={htmlContent}
                  onChange={handleEditorChange}
                  options={{ wordWrap: "on", minimap: { enabled: false } }}
                  className="border rounded"
                />
              </div>
            </div>
            <div className="outPutBox">
              <div className="heading py-3">
                <div className="flex flex-row justify-end items-center gap-5">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    disabled={!outputHtml}
                  >
                    <FaCopy className="mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    disabled={!outputHtml}
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleCut}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
                    disabled={!outputHtml}
                  >
                    <FaCut className="mr-2" />
                    Cut
                  </button>
                  <button
                    onClick={handleClean}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                    disabled={!outputHtml}
                  >
                    <FaBroom className="mr-2" />
                    Clean
                  </button>
                </div>
              </div>
              <div className="">
                <Editor
                  height="500px"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={outputHtml}
                  options={{
                    readOnly: true,
                    wordWrap: "on",
                    minimap: { enabled: false },
                  }}
                  className="border rounded bg-slate-700"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <button
              onClick={toggleMinifyBeautify}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              {isMinified ? "Beautify HTML" : "Minify HTML"}
            </button>
          </div>
        </div>
      </div>
      {popup && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {showUrlInput ? "Fetch HTML from URL" : "Upload HTML File"}
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>
            {showUrlInput ? (
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded mr-2"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Enter URL to fetch HTML"
                />
                <button
                  onClick={fetchHtmlFromUrl}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center"
                >
                  <FaLink className="mr-2" />
                  Fetch HTML
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MinifiedHTML;
