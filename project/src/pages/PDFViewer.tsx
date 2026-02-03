import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer as Print, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const PDFViewer = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    const fetchResourceContent = async () => {
      if (!resourceId) return;

      const contentsCollection = collection(db, 'resourceContents');
      const contentQuery = query(contentsCollection, where("slug", "==", resourceId), limit(1));
      const contentSnapshot = await getDocs(contentQuery);

      if (contentSnapshot.empty) {
        navigate('/resources');
        toast.error('Resource content not found');
        return;
      }

      const resourceData = contentSnapshot.docs[0].data();

      // Also fetch the metadata from the 'resources' collection to get the title, etc.
      const resourcesCollection = collection(db, 'resources');
      const metadataQuery = query(resourcesCollection, where("slug", "==", resourceId), limit(1));
      const metadataSnapshot = await getDocs(metadataQuery);
      
      if (!metadataSnapshot.empty) {
        const metadata = metadataSnapshot.docs[0].data();
        setResource({ ...metadata, content: resourceData.htmlContent });
      } else {
        // Fallback if metadata is not found
        setResource({ title: 'Resource', content: resourceData.htmlContent });
      }
    };

    fetchResourceContent();
  }, [resourceId, navigate]);

  const handleDownload = () => {
    toast.error('PDF download is not available for this document.');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="bg-white shadow-sm border-b border-primary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/resources')}
                className="flex items-center space-x-2 text-primary-600 hover:text-secondary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Resources</span>
              </button>
              <h1 className="font-heading font-bold text-lg text-primary-800 hidden md:block">{resource.title}</h1>
            </div>

            <div className="flex items-center space-x-2">
               <div className="hidden md:flex items-center space-x-1 bg-primary-100 rounded-lg p-1">
                  <button onClick={handleZoomOut} className="p-2 hover:bg-white rounded"><ZoomOut className="h-4 w-4" /></button>
                  <span className="px-3 text-sm font-medium">{zoomLevel}%</span>
                  <button onClick={handleZoomIn} className="p-2 hover:bg-white rounded"><ZoomIn className="h-4 w-4" /></button>
              </div>
              <button onClick={handleDownload} className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
              </button>
              <button onClick={handleShare} className="flex items-center space-x-2 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600">
                <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8">
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          <div 
            className="prose max-w-none p-8" 
            dangerouslySetInnerHTML={{ __html: resource.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
