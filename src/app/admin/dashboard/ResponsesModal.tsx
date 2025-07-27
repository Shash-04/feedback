import { X, Calendar, User, AlertCircle, Maximize2, Minimize2, Download, BluetoothSearching } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponseData {
  "Response ID": string;
  "Submitted At": string;
  [key: string]: string; // For dynamic question columns
}

interface ResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  formTitle: string;
}

export default function ResponsesModal({ isOpen, onClose, formId, formTitle }: ResponsesModalProps) {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(true);
  useEffect(() => {
    if (isOpen && formId) {
      fetchResponses();
    }

    // Handle ESC key for closing modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Handle F11 key for fullscreen toggle
    const handleF11Key = (event: KeyboardEvent) => {
      if (event.key === 'F11' && isOpen) {
        event.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('keydown', handleF11Key);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('keydown', handleF11Key);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, formId, isFullscreen]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching responses for form:', formId);

      const response = await fetch(`/api/forms/${formId}/responses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        // Try to get error details
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          console.error('API Error Details:', errorData);
        } catch {
          // If JSON parsing fails, get text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
          console.error('API Error Text:', errorText);
        }
        throw new Error(errorMessage);
      }

      const csvText = await response.text();
      console.log('CSV Response received, length:', csvText.length);
      console.log('CSV Preview:', csvText.substring(0, 500));

      if (!csvText || csvText.trim() === '') {
        console.log('Empty CSV response');
        setResponses([]);
        setColumns(['Response ID', 'Submitted At']);
        return;
      }

      const parsedData = parseCSV(csvText);
      console.log('Parsed data:', parsedData.length, 'records');

      setResponses(parsedData);

      // Extract column headers
      if (parsedData.length > 0) {
        const cols = Object.keys(parsedData[0]);
        console.log('Columns found:', cols);
        setColumns(cols);
      } else {
        setColumns(['Response ID', 'Submitted At']);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load responses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText: string): ResponseData[] => {
    try {
      const lines = csvText.trim().split('\n');
      console.log('CSV lines:', lines.length);

      if (lines.length < 2) {
        console.log('Not enough CSV lines');
        return [];
      }

      // Parse headers
      const headerLine = lines[0];
      console.log('Header line:', headerLine);
      const headers = parseCSVLine(headerLine);
      console.log('Parsed headers:', headers);

      const data: ResponseData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = parseCSVLine(line);
        const row: ResponseData = {} as ResponseData;

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        data.push(row);
      }

      console.log('Parsed CSV data:', data.length, 'records');
      return data;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw new Error('Failed to parse CSV data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadCSV = () => {
    if (responses.length === 0) return;

    // Create CSV content
    const headers = columns.join(',');
    const csvContent = responses.map(response => {
      return columns.map(column => {
        const value = response[column] || '';
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    }).join('\n');

    const fullCSV = headers + '\n' + csvContent;

    // Create and download file
    const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `form_${formId}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className={`mt-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isFullscreen ? 'z-[9999]' : 'z-50'} ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-gray-900 flex flex-col transition-all duration-300 ${isFullscreen
        ? 'w-full h-full max-w-none max-h-none m-0 rounded-none'
        : 'w-full max-w-6xl h-[90vh] rounded-xl'
        }`}>
        {/* Header - Fixed */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-700 bg-gray-900 rounded-t-lg">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Form Responses</h2>
            <p className="text-gray-300 text-sm mt-1">{formTitle}</p>
            <p className="text-gray-500 text-xs mt-1">Form ID: {formId}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {responses.length > 0 && (
              <button
                onClick={downloadCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                title="Download CSV"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Download CSV</span>
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white transition-colors p-2 rounded-full"
              title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors p-2 rounded-full"
              title="Close (ESC)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading responses...</p>
                <p className="text-gray-500 text-sm mt-2">Form ID: {formId}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center max-w-md">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="text-red-400 mb-2 font-medium">Error loading responses</p>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-2">Error details:</p>
                  <p className="text-xs text-red-300 font-mono break-all">{error}</p>
                  <p className="text-xs text-gray-500 mt-2">Form ID: {formId}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={fetchResponses}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm mr-2"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      console.log('Manual debug info:');
                      console.log('Form ID:', formId);
                      console.log('API URL:', `/api/forms/${formId}/responses`);
                      alert('Check browser console for debug info');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
                  >
                    Debug Info
                  </button>
                </div>
              </div>
            </div>
          ) : responses.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-400">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-lg mb-2">No responses yet</p>
                <p className="text-sm">This form hasn't received any responses.</p>
                <p className="text-xs text-gray-500 mt-2">Form ID: {formId}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto border border-gray-800 rounded-lg m-4">
              <div className="min-w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800 sticky top-0 z-10">
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700 last:border-r-0 whitespace-nowrap ${isFullscreen ? 'min-w-[200px]' : 'min-w-[150px]'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {column === "Response ID" && <User className="w-4 h-4" />}
                            {column === "Submitted At" && <Calendar className="w-4 h-4" />}
                            <span className="truncate" title={column}>{column}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {responses.map((response, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-800 transition-colors"
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className={`px-4 py-3 text-sm text-gray-300 border-r border-gray-800 last:border-r-0 align-top ${isFullscreen ? 'min-w-[200px]' : 'min-w-[150px]'
                              }`}
                          >
                            <div className={`break-words ${isFullscreen ? 'max-w-md' : 'max-w-xs'}`} title={String(response[column] || '-')}>
                              {column === "Submitted At" ? (
                                <span className="text-gray-400 whitespace-nowrap">
                                  {formatDate(response[column])}
                                </span>
                              ) : column === "Response ID" ? (
                                <span className="font-mono text-purple-400 whitespace-nowrap">
                                  {response[column]}
                                </span>
                              ) : (
                                <span className="leading-relaxed">
                                  {response[column] || '-'}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}