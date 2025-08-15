"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Calculator, CheckCircle } from "lucide-react"
import DocumentProcessor from "@/components/document-processor"
import DataExtraction from "@/components/data-extraction"
import EmissionsCalculator from "@/components/emissions-calculator"
import ComplianceDashboard from "@/components/compliance-dashboard"
import ReportGenerator from "@/components/report-generator"

export default function CarbonEmissionsAuditor() {
  const [activeTab, setActiveTab] = useState("upload")
  const [processedDocuments, setProcessedDocuments] = useState([])
  const [extractedData, setExtractedData] = useState([])
  const [emissionsData, setEmissionsData] = useState(null)
  const [complianceStatus, setComplianceStatus] = useState(null)

  const handleDocumentsProcessed = (documents) => {
    setProcessedDocuments(documents)
    setActiveTab("extraction")
  }

  const handleDataExtracted = (data) => {
    setExtractedData(data)
    setActiveTab("calculation")
  }

  const handleEmissionsCalculated = (data) => {
    setEmissionsData(data)
    setActiveTab("compliance")
  }

  const handleComplianceChecked = (status) => {
    setComplianceStatus(status)
    setActiveTab("reporting")
  }

  const tabs = [
    { id: "upload", label: "Upload", component: DocumentProcessor },
    { id: "extraction", label: "Extraction", component: DataExtraction },
    { id: "calculation", label: "Calculation", component: EmissionsCalculator },
    { id: "compliance", label: "Compliance", component: ComplianceDashboard },
    { id: "reporting", label: "Reporting", component: ReportGenerator },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "upload":
        return <DocumentProcessor onDocumentsProcessed={handleDocumentsProcessed} />
      case "extraction":
        return <DataExtraction documents={processedDocuments} onDataExtracted={handleDataExtracted} />
      case "calculation":
        return <EmissionsCalculator extractedData={extractedData} onEmissionsCalculated={handleEmissionsCalculated} />
      case "compliance":
        return <ComplianceDashboard emissionsData={emissionsData} onComplianceChecked={handleComplianceChecked} />
      case "reporting":
        return <ReportGenerator emissionsData={emissionsData} complianceStatus={complianceStatus} />
      default:
        return <DocumentProcessor onDocumentsProcessed={handleDocumentsProcessed} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">CASIE AI</h1>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Carbon Auditing System for Industrial Emissions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Automated GHG accounting using NLP and OCR to process invoices, extract emissions data, and generate ISO
            14064 compliant audit reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Document Processing</h3>
              <p className="text-sm text-gray-600">OCR & Digitization</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Data Extraction</h3>
              <p className="text-sm text-gray-600">BERT-based NLP</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calculator className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold">Emissions Calculation</h3>
              <p className="text-sm text-gray-600">GHG Protocol Standards</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Compliance Check</h3>
              <p className="text-sm text-gray-600">ISO 14064 Validation</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="min-w-[120px]"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
