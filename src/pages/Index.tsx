
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kami Scribe
          </h1>
          <p className="text-gray-600">
            Annotate and collaborate on PDF documents with powerful tools
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/pdf" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">
              <Upload className="w-5 h-5 mr-2" />
              Start Annotating PDFs
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            Upload a PDF document to begin annotating with highlights, text notes, and drawings
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-600 text-sm">✏️</span>
            </div>
            <h3 className="font-medium text-gray-900">Highlight</h3>
            <p className="text-xs text-gray-500">Mark important sections</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 text-sm">📝</span>
            </div>
            <h3 className="font-medium text-gray-900">Annotate</h3>
            <p className="text-xs text-gray-500">Add text notes and drawings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
