// src/components/DocumentUpload.tsx

import { useState, useCallback } from 'react';
import {
  Upload, FileText, Settings, FolderOpen, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

type Category = 'resumes' | 'machine-details' | 'other-info';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadFile {
  id: string;
  file: File;
  category: Category;
  status: UploadStatus;
  progress: number;
  error?: string;
}

const categories = [
  { id: 'resumes' as const, label: 'Resumes', icon: FileText },
  { id: 'machine-details' as const, label: 'Machine Details', icon: Settings },
  { id: 'other-info' as const, label: 'Other Info', icon: FolderOpen }
];

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface DocumentUploadProps {
  category?: Category;
}

export default function DocumentUpload({ category }: DocumentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<Category>(category || 'other-info');
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [defaultCategory]);

  const handleFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      category: defaultCategory,
      status: 'idle',
      progress: 0
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const updateFileCategory = (fileId: string, category: Category) => {
    setUploadFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, category } : file
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const uploadSingleFile = async (fileId: string) => {
    const fileToUpload = uploadFiles.find(f => f.id === fileId);
    if (!fileToUpload) return;

    setUploadFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      // Step 1: Get signed URL
      const response = await fetch(`${API_URL}/get-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileToUpload.file.name,
          category: fileToUpload.category,
          contentType: fileToUpload.file.type
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Failed to get upload URL');
      }

      const { uploadUrl } = await response.json();

      // Step 2: Upload file directly to GCS
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fileToUpload.file.type },
        body: fileToUpload.file
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      setUploadFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'success', progress: 100 } : f
      ));

      toast({
        title: "Upload successful!",
        description: `"${fileToUpload.file.name}" has been uploaded.`,
      });

    } catch (error: any) {
      setUploadFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'error', error: error.message || 'Upload failed' } : f
      ));
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Something went wrong',
      });
    }
  };

  const uploadAllFiles = () => {
    uploadFiles
      .filter(file => file.status === 'idle')
      .forEach(file => uploadSingleFile(file.id));
  };

  const getStatusIcon = (status: UploadStatus) => {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getCategoryIcon = (categoryId: Category) => {
    return categories.find(c => c.id === categoryId)?.icon || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">Upload Settings</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Default Category:</label>
          <Select
            value={defaultCategory}
            onValueChange={(value: Category) => setDefaultCategory(value)}
            disabled={!!category}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => {
                const Icon = c.icon;
                return (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {c.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Upload Area */}
      <Card
        className={`p-8 border-2 border-dashed transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary/10 shadow-card-hover'
            : 'border-border bg-gradient-card hover:bg-card-hover'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          />
          <Button asChild className="shadow-button">
            <label htmlFor="file-upload" className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>
      </Card>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upload Queue ({uploadFiles.length})</h3>
            <div className="flex gap-2">
              <Button
                onClick={uploadAllFiles}
                disabled={uploadFiles.every(f => f.status !== 'idle')}
                className="shadow-button"
              >
                Upload All
              </Button>
              <Button
                variant="outline"
                onClick={() => setUploadFiles([])}
                className="shadow-button"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {uploadFiles.map(fileItem => {
              const CategoryIcon = getCategoryIcon(fileItem.category);
              return (
                <div key={fileItem.id} className="p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{fileItem.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={fileItem.category}
                        onValueChange={(value: Category) => updateFileCategory(fileItem.id, value)}
                        disabled={fileItem.status === 'uploading'}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(c => {
                            const Icon = c.icon;
                            return (
                              <SelectItem key={c.id} value={c.id}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {c.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Badge variant={fileItem.status === 'success' ? 'default' : 'secondary'}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {categories.find(c => c.id === fileItem.category)?.label}
                      </Badge>

                      {fileItem.status === 'idle' && (
                        <Button
                          size="sm"
                          onClick={() => uploadSingleFile(fileItem.id)}
                          className="shadow-button"
                        >
                          Upload
                        </Button>
                      )}

                      {getStatusIcon(fileItem.status)}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileItem.id)}
                        disabled={fileItem.status === 'uploading'}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {fileItem.status === 'uploading' && (
                    <Progress value={fileItem.progress} className="mt-2" />
                  )}

                  {fileItem.error && (
                    <p className="text-sm text-red-500 mt-2">{fileItem.error}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
