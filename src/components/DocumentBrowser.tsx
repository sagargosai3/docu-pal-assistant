import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Settings, FolderOpen, Download, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

type Category = 'all' | 'resumes' | 'machine-details' | 'other-info';

interface Document {
  id: string;
  name: string;
  category: Category;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  type: string;
  url?: string;
}

// Mock data - replace with your GCP data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Resume_Jane_Doe.pdf',
    category: 'resumes',
    size: 2.4,
    uploadDate: '2024-01-15',
    uploadedBy: 'HR Manager',
    type: 'pdf'
  },
  {
    id: '2',
    name: 'Hydraulic_Press_Manual.pdf',
    category: 'machine-details',
    size: 15.8,
    uploadDate: '2024-01-14',
    uploadedBy: 'Technical Team',
    type: 'pdf'
  },
  {
    id: '3',
    name: 'Safety_Guidelines.docx',
    category: 'machine-details',
    size: 3.2,
    uploadDate: '2024-01-13',
    uploadedBy: 'Safety Officer',
    type: 'docx'
  },
  {
    id: '4',
    name: 'Project_Alpha_Specs.txt',
    category: 'other-info',
    size: 0.8,
    uploadDate: '2024-01-12',
    uploadedBy: 'Project Manager',
    type: 'txt'
  },
  {
    id: '5',
    name: 'Resume_John_Smith.pdf',
    category: 'resumes',
    size: 1.9,
    uploadDate: '2024-01-11',
    uploadedBy: 'HR Manager',
    type: 'pdf'
  }
];

const categories = [
  { id: 'all' as const, label: 'All Documents', icon: FolderOpen },
  { id: 'resumes' as const, label: 'Resumes', icon: FileText },
  { id: 'machine-details' as const, label: 'Machine Details', icon: Settings },
  { id: 'other-info' as const, label: 'Other Info', icon: FolderOpen }
];

// Add prop type
interface DocumentBrowserProps {
  category?: Category;
}

export default function DocumentBrowser({ category }: DocumentBrowserProps) {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(category || 'all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, sortBy, sortOrder]);

  const getCategoryIcon = (categoryId: Category) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || FileText;
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'txt': return '📄';
      default: return '📄';
    }
  };

  const handleDownload = (doc: Document) => {
    // TODO: Implement GCP download
    console.log('Download document:', doc.name);
  };

  const handleEdit = (doc: Document) => {
    // TODO: Implement edit functionality
    console.log('Edit document:', doc.name);
  };

  const handleDelete = (doc: Document) => {
    // TODO: Implement GCP delete
    console.log('Delete document:', doc.name);
  };

  const handleView = (doc: Document) => {
    // TODO: Implement document viewer
    console.log('View document:', doc.name);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents or uploaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select value={selectedCategory} onValueChange={(value: Category) => setSelectedCategory(value)} disabled={!!category}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
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

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as 'name' | 'date' | 'size');
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="size-desc">Largest First</SelectItem>
                <SelectItem value="size-asc">Smallest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredAndSortedDocuments.length} document{filteredAndSortedDocuments.length !== 1 ? 's' : ''} found
          </span>
          <span>
            Total size: {filteredAndSortedDocuments.reduce((sum, doc) => sum + doc.size, 0).toFixed(1)} MB
          </span>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredAndSortedDocuments.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-card shadow-card">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms or filters.' : 'Upload some documents to get started.'}
            </p>
          </Card>
        ) : (
          filteredAndSortedDocuments.map(doc => {
            const CategoryIcon = getCategoryIcon(doc.category);
            
            return (
              <Card key={doc.id} className="p-4 bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-2xl">{getFileIcon(doc.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{doc.name}</h3>
                        <Badge variant="secondary" className="flex-shrink-0">
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {categories.find(c => c.id === doc.category)?.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(doc.uploadDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.uploadedBy}
                        </span>
                        <span>{doc.size.toFixed(1)} MB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(doc)}
                      className="hover:bg-secondary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-secondary">
                          <span className="sr-only">More options</span>
                          <span className="text-lg">⋯</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Info
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(doc)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}