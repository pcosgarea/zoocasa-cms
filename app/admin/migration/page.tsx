"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function MigrationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/migration", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const error = await response.json();
        setResult({ error: error.error || "Failed to import" });
      }
    } catch (error) {
      clearInterval(interval);
      console.error("Error uploading file:", error);
      setResult({ error: "An error occurred during upload" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading">WordPress Migration</h1>
        <p className="mt-2 text-gray-600">
          Import posts from your WordPress blog
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-heading mb-4">
          How to export from WordPress
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Log in to your WordPress admin dashboard</li>
          <li>Go to Tools → Export</li>
          <li>Select "Posts" and click "Download Export File"</li>
          <li>Upload the XML file below</li>
        </ol>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-heading mb-4">
          Upload WordPress Export File
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose XML File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {file && (
            <div className="text-sm text-gray-600 mb-4">
              Selected: <span className="font-medium">{file.name}</span>
            </div>
          )}
          <p className="text-xs text-gray-500">
            Upload a WordPress XML export file (.xml)
          </p>
        </div>

        {file && !isUploading && !result && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
            >
              Start Import
            </button>
          </div>
        )}

        {/* Progress */}
        {isUploading && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Importing posts...</span>
              <span className="text-gray-900 font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6">
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Import Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Import Successful!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    {result.imported} post(s) imported successfully
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>The import process may take several minutes for large blogs</li>
              <li>Existing posts with the same slug will be skipped</li>
              <li>Images will need to be re-uploaded manually</li>
              <li>Custom fields and metadata may not be preserved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
