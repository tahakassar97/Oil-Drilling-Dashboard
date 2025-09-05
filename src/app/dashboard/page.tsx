/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useState } from "react";

import { Button, UploadInput } from "@ui";
import { useToast } from "@hooks";
import { wellList } from "./utils";
import DrillingCharts from "./components/DrillingCharts";
import Chatbot from "./components/Chatbot";

interface Well {
  id: string;
  name: string;
  depth: number;
  status: "active" | "inactive" | "maintenance";
}

const Dashboard: FC = () => {
  const { successNotify, errorNotify } = useToast();
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        errorNotify("Upload failed");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        successNotify("File uploaded and processed successfully.");
        if (data.processedData && data.processedData.length > 0) {
          const transformedData = data.processedData.map((item: any) => ({
            depth: item.DEPTH || item.depth,
            SH: (item["%SH"] !== undefined ? item["%SH"] : item.SH) || 0,
            SS: (item["%SS"] !== undefined ? item["%SS"] : item.SS) || 0,
            LS: (item["%LS"] !== undefined ? item["%LS"] : item.LS) || 0,
            DOL: (item["%DOL"] !== undefined ? item["%DOL"] : item.DOL) || 0,
            ANH: (item["%ANH"] !== undefined ? item["%ANH"] : item.ANH) || 0,
            Coal:
              (item["%Coal"] !== undefined ? item["%Coal"] : item.Coal) || 0,
            Salt:
              (item["%Salt"] !== undefined ? item["%Salt"] : item.Salt) || 0,
            DT: item.DT || 0,
            GR: item.GR || 0,
            MINFINAL: item.MINFINAL || 1,
            UCS: item.UCS || 0,
            FA: item.FA || 0,
            RAT: item.RAT || 1,
            ROP: item.ROP || 0,
          }));
          setUploadedData(transformedData);
        }
      } else {
        errorNotify("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch {
      errorNotify("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleWellSelect = (well: Well) => {
    setSelectedWell(well);
  };

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      <header className="flex bg-white backdrop-blur-lg shadow-sm h-14 sm:h-16 fixed top-0 left-0 right-0 items-center justify-between px-3 sm:px-6 border-b border-gray-200 z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <p className="bg-orange-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold whitespace-nowrap">
              DEEPBIT
            </p>
            <h2 className="font-bold text-sm sm:text-lg lg:text-xl text-gray-800 truncate">
              Drill AI Intelligence Platform
            </h2>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 pt-14 sm:pt-16 overflow-x-hidden">
        <aside className="w-full lg:w-64 h-auto lg:h-[calc(100vh-4rem)] sm:lg:h-[calc(100vh-4rem)] border-r border-gray-200 bg-white shadow-sm flex-shrink-0">
          <div className="flex w-full items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            <h4 className="text-base sm:text-lg font-bold text-gray-800">Well List</h4>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto h-48 sm:h-64 lg:h-[calc(100vh-7rem)]">
            <ul className="px-3 sm:px-4 py-2 space-y-1 sm:space-y-2">
              {wellList.map((well, index) => (
                <li
                  key={well.name}
                  className={`flex flex-col justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedWell?.name === well.name
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-transparent"
                  }`}
                  onClick={() =>
                    handleWellSelect({
                      id: `well-${index}`,
                      name: well.name,
                      depth: well.depth,
                      status: "active",
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs sm:text-sm text-gray-800 truncate">
                      {well.name}
                    </p>
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
                        selectedWell?.name === well.name
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <small className="text-gray-500 text-xs mt-1 truncate">
                    Depth: {well.depth} ft
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 flex flex-col lg:flex-row bg-white min-w-0">
          {/* Main Content Area */}
          <section className="flex-1 h-full min-w-0">
            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 gap-3 sm:gap-0">
              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto min-w-0">
                <div className="flex items-center bg-blue-50 border-b-2 border-blue-500 px-2 sm:px-4 py-2 rounded-t-lg whitespace-nowrap">
                  <p className="text-xs sm:text-sm font-semibold text-blue-600">
                    Drilling Monitoring
                  </p>
                  <button className="ml-1 sm:ml-2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center px-2 sm:px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap">
                  <p className="text-xs sm:text-sm font-semibold">Offset Wells Map</p>
                  <button className="ml-1 sm:ml-2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center px-2 sm:px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap">
                  <p className="text-xs sm:text-sm font-semibold">Bit Summary</p>
                  <button className="ml-1 sm:ml-2 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 text-xs sm:text-sm rounded-md flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
                  size="sm"
                >
                  Filter
                </Button>

                <UploadInput
                  onFileSelect={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </UploadInput>
              </div>
            </div>

            {/* Charts Area */}
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto">
              <DrillingCharts data={uploadedData} />
            </div>
          </section>

          {/* Chatbot Sidebar */}
          <aside className="w-full lg:w-80 h-80 sm:h-96 lg:h-[calc(100vh-4rem)] border-t lg:border-t-0 lg:border-l border-gray-200 shadow-sm flex-shrink-0">
            <Chatbot
              selectedWell={selectedWell?.name}
              drillingData={uploadedData}
            />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
