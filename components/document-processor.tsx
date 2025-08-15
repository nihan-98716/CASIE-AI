"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle } from "lucide-react"

interface DocumentProcessorProps {
  onDocumentsProcessed: (documents: any[]) => void
}

export default function DocumentProcessor({ onDocumentsProcessed }: DocumentProcessorProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedDocs, setProcessedDocs] = useState<any[]>([])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    setFiles(uploadedFiles)
  }, [])

  const simulateOCRProcessing = async () => {
    setProcessing(true)
    setProgress(0)

    const mockDocuments = files.map((file, index) => ({
      id: `doc_${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      ocrText: generateMockOCRText(file.name),
      confidence: 0.85 + Math.random() * 0.1,
      processedAt: new Date().toISOString(),
    }))

    // Simulate processing time
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setProcessedDocs(mockDocuments)
    setProcessing(false)
    onDocumentsProcessed(mockDocuments)
  }

  const generateMockOCRText = (filename: string) => {
    const templates = [
      `ENERGY BILL - ${filename}
Account Number: 123456789
Billing Period: Jan 2024 - Feb 2024
Electricity Usage: 2,450 kWh
Natural Gas: 1,200 cubic feet
Total Amount: $345.67
Carbon Intensity: 0.45 kg CO2/kWh`,

      `FUEL INVOICE - ${filename}
Invoice #: INV-2024-001
Diesel Fuel: 500 gallons
Gasoline: 200 gallons
Unit Price: $3.45/gallon
Total: $2,415.00
Delivery Date: 2024-01-15`,

      `UTILITY STATEMENT - ${filename}
Service Address: 123 Industrial Ave
Electric Consumption: 15,600 kWh
Peak Demand: 45 kW
Power Factor: 0.92
Renewable Energy Credit: 5%
Monthly Charge: $1,234.56`,
    ]

    return templates[Math.floor(Math.random() * templates.length)]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload & OCR Processing
          </CardTitle>
          <CardDescription>
            Upload invoices, energy bills, and operational records for automated processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">Supports PDF, JPG, PNG, TIFF formats</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Selected Files ({files.length})</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                  </div>
                ))}

                <Button onClick={simulateOCRProcessing} disabled={processing} className="w-full mt-4">
                  {processing ? "Processing..." : "Start OCR Processing"}
                </Button>
              </div>
            )}

            {processing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing documents...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {processedDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              OCR Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedDocs.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{doc.name}</h3>
                    <Badge variant={doc.confidence > 0.9 ? "default" : "secondary"}>
                      {(doc.confidence * 100).toFixed(1)}% confidence
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-line">{doc.ocrText}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
