"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Fuel, Factory, CheckCircle } from "lucide-react"

interface DataExtractionProps {
  documents: any[]
  onDataExtracted: (data: any[]) => void
}

export default function DataExtraction({ documents, onDataExtracted }: DataExtractionProps) {
  const [extracting, setExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any[]>([])

  const extractDataWithNLP = async () => {
    setExtracting(true)
    setProgress(0)

    const extracted = []

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]

      // Simulate BERT-based extraction
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(((i + 1) / documents.length) * 100)

      const extractedItems = extractEmissionsData(doc.ocrText, doc.name)
      extracted.push({
        documentId: doc.id,
        documentName: doc.name,
        items: extractedItems,
        extractedAt: new Date().toISOString(),
      })
    }

    setExtractedData(extracted)
    setExtracting(false)
    onDataExtracted(extracted)
  }

  const extractEmissionsData = (text: string, filename: string) => {
    const items = []

    // Extract electricity usage
    const electricityMatch = text.match(/(\d+,?\d*)\s*kWh/i)
    if (electricityMatch) {
      items.push({
        type: "electricity",
        value: Number.parseFloat(electricityMatch[1].replace(",", "")),
        unit: "kWh",
        confidence: 0.92,
        source: "Electricity consumption",
        icon: "zap",
      })
    }

    // Extract natural gas
    const gasMatch = text.match(/(\d+,?\d*)\s*cubic feet/i)
    if (gasMatch) {
      items.push({
        type: "natural_gas",
        value: Number.parseFloat(gasMatch[1].replace(",", "")),
        unit: "cubic feet",
        confidence: 0.88,
        source: "Natural gas usage",
        icon: "fuel",
      })
    }

    // Extract fuel consumption
    const dieselMatch = text.match(/Diesel.*?(\d+)\s*gallons/i)
    if (dieselMatch) {
      items.push({
        type: "diesel",
        value: Number.parseFloat(dieselMatch[1]),
        unit: "gallons",
        confidence: 0.95,
        source: "Diesel fuel consumption",
        icon: "fuel",
      })
    }

    const gasolineMatch = text.match(/Gasoline.*?(\d+)\s*gallons/i)
    if (gasolineMatch) {
      items.push({
        type: "gasoline",
        value: Number.parseFloat(gasolineMatch[1]),
        unit: "gallons",
        confidence: 0.93,
        source: "Gasoline consumption",
        icon: "fuel",
      })
    }

    // Extract peak demand
    const demandMatch = text.match(/(\d+)\s*kW/i)
    if (demandMatch) {
      items.push({
        type: "peak_demand",
        value: Number.parseFloat(demandMatch[1]),
        unit: "kW",
        confidence: 0.85,
        source: "Peak electricity demand",
        icon: "zap",
      })
    }

    return items
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "zap":
        return <Zap className="h-4 w-4" />
      case "fuel":
        return <Fuel className="h-4 w-4" />
      case "factory":
        return <Factory className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "electricity":
        return "bg-yellow-100 text-yellow-800"
      case "natural_gas":
        return "bg-blue-100 text-blue-800"
      case "diesel":
        return "bg-red-100 text-red-800"
      case "gasoline":
        return "bg-orange-100 text-orange-800"
      case "peak_demand":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            NLP Data Extraction
          </CardTitle>
          <CardDescription>
            Using BERT-based models to extract emissions-related data from processed documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No documents available for extraction. Please upload and process documents first.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{documents.length} documents ready for extraction</span>
                <Button onClick={extractDataWithNLP} disabled={extracting}>
                  {extracting ? "Extracting..." : "Start NLP Extraction"}
                </Button>
              </div>

              {extracting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing with BERT model...</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {extractedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Extracted Emissions Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {extractedData.map((docData) => (
                <div key={docData.documentId} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">{docData.documentName}</h3>

                  {docData.items.length === 0 ? (
                    <p className="text-gray-500 text-sm">No emissions data found in this document</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {docData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            {getIcon(item.icon)}
                            <div>
                              <p className="font-medium text-sm">{item.source}</p>
                              <p className="text-xs text-gray-600">
                                {item.value.toLocaleString()} {item.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(item.type)}>{item.type.replace("_", " ")}</Badge>
                            <Badge variant="outline">{(item.confidence * 100).toFixed(0)}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Extraction Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-green-600">Total Items</p>
                    <p className="font-bold text-green-800">
                      {extractedData.reduce((sum, doc) => sum + doc.items.length, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-600">Avg Confidence</p>
                    <p className="font-bold text-green-800">
                      {(
                        (extractedData.reduce(
                          (sum, doc) => sum + doc.items.reduce((itemSum, item) => itemSum + item.confidence, 0),
                          0,
                        ) /
                          extractedData.reduce((sum, doc) => sum + doc.items.length, 0)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-green-600">Documents</p>
                    <p className="font-bold text-green-800">{extractedData.length}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Ready for Calc</p>
                    <p className="font-bold text-green-800">✓</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
