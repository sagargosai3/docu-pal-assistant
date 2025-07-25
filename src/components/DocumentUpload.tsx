import { useState, useCallback } from 'react';
import { Upload, FileText, Settings, FolderOpen, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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

// Add prop type
interface DocumentUploadProps {
  category?: Category;
}

export default function DocumentUpload({ category }: DocumentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<Category>(category || 'other-info');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
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
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'uploading' } : file
    ));

    // Simulate upload progress for demo
    // Replace this with your GCP upload logic
    const file = uploadFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      // TODO: Replace with actual GCP upload
      // const formData = new FormData();
      // formData.append('file', file.file);
      // formData.append('category', file.category);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });

      setUploadFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'success' } : f
      ));
    } catch (error) {
      setUploadFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f
      ));
    }
  };

  const uploadAllFiles = () => {
    uploadFiles
      .filter(file => file.status === 'idle')
      .forEach(file => uploadSingleFile(file.id));
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getCategoryIcon = (categoryId: Category) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return FileText;
    return category.icon;
  };

  return (
    <div className="space-y-6">
      {/* Default Category Selection */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold mb-4">Upload Settings</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Default Category:</label>
          <Select value={defaultCategory} onValueChange={(value: Category) => setDefaultCategory(value)} disabled={!!category}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Drag and Drop Area */}
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
                          {categories.map(category => {
                            const Icon = category.icon;
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {category.label}
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