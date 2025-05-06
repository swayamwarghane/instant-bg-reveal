
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eraser } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const API_KEY = 'prF6qi7kzgKCoaUqBxRA2Zrg';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image under 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setIsUploaded(true);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!originalImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setProcessedImage(resultUrl);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error processing image",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col isolate overflow-hidden">
      {/* Background grid pattern */}
      <div className="grid-pattern fixed inset-0 z-[-1] opacity-20" />
      
      {/* Gradient accent */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-700/20 blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 py-12 flex flex-col items-center z-10 h-full flex-grow">
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 text-transparent bg-clip-text animate-gradient">
            Professional Background Remover
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your image and get instant background removal with our AI-powered tool
          </p>
        </header>

        {/* Upload area */}
        <div 
          onClick={() => document.getElementById('file-input')?.click()}
          className="w-full max-w-3xl mb-8 border border-border/40 hover:border-primary/40 bg-card/30 backdrop-blur-md rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 animate-float"
        >
          <input
            type="file"
            id="file-input"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="font-medium text-lg text-foreground">Drop your image here, or click to browse</p>
          <p className="text-sm text-muted-foreground mt-2">PNG, JPG, JPEG up to 10MB</p>
        </div>

        {/* Preview cards */}
        {(isUploaded || isLoading || processedImage) && (
          <div className="w-full max-w-5xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Original image card */}
            <Card className={`overflow-hidden border-border/40 hover:border-indigo-500/40 bg-card/30 backdrop-blur-md transition-all duration-300 ${isLoading ? 'pulse-loading' : ''}`}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Original Image</h3>
                {originalImage && (
                  <div className="relative bg-black/30 rounded-lg h-[300px] flex items-center justify-center overflow-hidden">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </Card>
            
            {/* Processed image card */}
            <Card className={`overflow-hidden border-border/40 hover:border-purple-500/40 bg-card/30 backdrop-blur-md transition-all duration-300 ${isLoading ? 'pulse-loading' : ''}`}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Processed Result</h3>
                <div className="relative bg-black/30 rounded-lg h-[300px] flex items-center justify-center overflow-hidden">
                  {isLoading && (
                    <div className="loading-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                  )}
                  {processedImage && !isLoading && (
                    <img 
                      src={processedImage} 
                      alt="Result" 
                      className="max-w-full max-h-full object-contain animate-fade-in"
                    />
                  )}
                  {!processedImage && !isLoading && (
                    <p className="text-muted-foreground text-sm">Ready to process your image</p>
                  )}
                </div>
                
                {processedImage && (
                  <div className="mt-5 flex justify-center">
                    <a 
                      href={processedImage} 
                      download="background-removed.png"
                      className="animate-pulse-slow"
                    >
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Result
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* New stylish process button */}
        <button
          onClick={processImage}
          disabled={isLoading || !originalImage}
          className={`relative group overflow-hidden mt-8 flex items-center justify-center gap-3 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 px-8 py-4 rounded-xl font-semibold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${isLoading ? '' : 'hover:scale-105'} animate-pop-in`}
          style={{ minWidth: '240px' }}
        >
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute -inset-full top-0 block w-1/2 h-full z-5 transform -skew-x-20 bg-gradient-to-r from-transparent to-white/30 opacity-40 group-hover:animate-shine"></span>
          
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
              <span className="text-base">Processing...</span>
            </div>
          ) : (
            <>
              <Eraser className="w-5 h-5" />
              <span className="text-base tracking-wide">REMOVE BACKGROUND</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Index;
