import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import * as React from "react";
import { config } from "./configLabels";

interface Job {
  id: string;
  Job: string;
  Recruiter: string;
  date: string;
  status: string;
}

const JobManager: React.FC = () => {
  const [Jobs, setJobs] = useState<Job[]>([]);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [JobText, setJobText] = useState("");
  const [RecruiterText, setRecruiterText] = useState("");
  const [dateText, setDateText] = useState("");
  const [statusText, setStatusText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [editJob]);

  useEffect(() => {
    // Load saved Jobs from Local Storage on component mount
    const savedJobs = localStorage.getItem("JobList");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  useEffect(() => {
    // Save Jobs to Local Storage whenever Jobs are updated
    localStorage.setItem("JobList", JSON.stringify(Jobs));
  }, [Jobs]);

  const handleAddJob = (event: React.FormEvent) => {
    event.preventDefault();
    const newJob: Job = {
      id: uuid(),
      Job: JobText,
      Recruiter: RecruiterText,
      date: dateText,
      status: statusText,
    };
    setJobs([...Jobs, newJob]);
    setJobText("");
    setRecruiterText("");
    setDateText("");
    setStatusText("");
  };

  const handleUpdateJob = (event: React.FormEvent) => {
    event.preventDefault();
    if (editJob) {
      const updatedJobs = Jobs.map((Job) =>
        Job.id === editJob.id
          ? {
              ...Job,
              Job: JobText,
              Recruiter: RecruiterText,
              date: dateText,
              status: statusText,
            }
          : Job
      );
      setJobs(updatedJobs);
      setEditJob(null);
      setJobText("");
      setRecruiterText("");
      setDateText("");
      setStatusText("");
    }
  };

  const handleEditJob = (Job: Job) => {
    setEditJob(Job);
    setJobText(Job.Job);
    setRecruiterText(Job.Recruiter);
    setDateText(Job.date);
    setStatusText(Job.status);
  };

  const handleDeleteJob = (id: string) => {
    const updatedJobs = Jobs.filter((Job) => Job.id !== id);
    setJobs(updatedJobs);
  };

  const handleSaveJobs = () => {
    const JobsData = JSON.stringify(Jobs);
    const blob = new Blob([JobsData], { type: "application/json" });

    // Create a temporary link element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.target = "_blank";

    // Prompt the user to save the file
    const filename = prompt("Enter the filename:", "JobList.json");
    if (filename) {
      a.download = filename;
      a.click();
    }

    // Clean up
    URL.revokeObjectURL(a.href);
  };

  const handleImportJobs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const importedJobs = JSON.parse(reader.result as string);
        setJobs(importedJobs);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full custom-width border-4 border-green-500">
        <h1 className="mb-4 text-xl text-black">{config.title}</h1>
        <form
          onSubmit={editJob === null ? handleAddJob : handleUpdateJob}
          className="mb-4"
        >
          <input
            type="text"
            ref={inputRef}
            className={`border p-2 w-full ${
              editJob === null ? "text-black" : "text-gray-400"
            }`}
            value={JobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder={config.input1Label}
          />
          <input
            type="text"
            className={`border p-2 w-full ${
              editJob === null ? "text-black" : "text-gray-400"
            }`}
            value={RecruiterText}
            onChange={(e) => setRecruiterText(e.target.value)}
            placeholder={config.input2Label}
          />
          <input
            type="text"
            className={`border p-2 w-full ${
              editJob === null ? "text-black" : "text-gray-400"
            }`}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            placeholder={config.input3Label}
          />
          <input
            type="date"
            className={`border p-2 w-full ${
              editJob === null ? "text-black" : "text-gray-400"
            }`}
            value={dateText}
            onChange={(e) => setDateText(e.target.value)}
          />

          <button
            type="submit"
            className={`mt-2 bg-blue-500 ${
              editJob === null ? "text-white" : "text-gray-400"
            } py-2 px-4 rounded w-full`}
          >
            {editJob === null
              ? config.addButtonLabel
              : config.updateButtonLabel}
          </button>
        </form>
        <div className="grid grid-cols-5 gap-2 text-black">
          <div className="font-bold">{config.input1Label}</div>
          <div className="font-bold">{config.input2Label}</div>
          <div className="font-bold">Date</div>
          <div className="font-bold">{config.input3Label}</div>
          <div className="font-bold">Actions</div>

          {Jobs.map((Job, index) => (
            <React.Fragment key={Job.id}>
              <div
                className={`p-2 ${index !== Jobs.length - 1 ? "border-b" : ""}`}
              >
                <span className="font-bold"> {Job.Job}</span>
              </div>
              <div
                className={`p-2 ${index !== Jobs.length - 1 ? "border-b" : ""}`}
              >
                {Job.Recruiter}
              </div>
              <div
                className={`p-2 ${index !== Jobs.length - 1 ? "border-b" : ""}`}
              >
                {Job.date}
              </div>
              <div
                className={`p-2 ${index !== Jobs.length - 1 ? "border-b" : ""}`}
              >
                {Job.status}
              </div>
              <div>
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEditJob(Job)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteJob(Job.id)}
                >
                  Delete
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleSaveJobs}
            className="bg-blue-500 text-white py-2 px-4 rounded w-24 h-14 flex items-center justify-center text-center"
          >
            {config.saveButtonLabel}
          </button>
          <label
            htmlFor="import-Jobs"
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer w-24 h-14 flex items-center justify-center text-center"
          >
            {config.importButtonLabel}
          </label>
          <input
            id="import-Jobs"
            type="file"
            accept=".json"
            onChange={handleImportJobs}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default JobManager;
