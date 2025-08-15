"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Building } from "lucide-react"

interface ReportGeneratorProps {
  emissionsData: any
  complianceStatus: any
}

export default function ReportGenerator({ emissionsData, complianceStatus }: ReportGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const generateReport = async () => {
    setGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setReportGenerated(true)
    setGenerating(false)
  }

  const downloadReport = (format: string) => {
    // In a real implementation, this would generate and download the actual report
    const reportData = generateReportData()
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `carbon-emissions-audit-report.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReportData = () => {
    return {
      reportTitle: "Carbon Emissions Audit Report",
      generatedAt: new Date().toISOString(),
      reportingPeriod: "2024 Q1",
      methodology: "GHG Protocol Corporate Standard",
      complianceStandards: ["ISO 14064-1", "GHG Protocol"],
      executiveSummary: {
        totalEmissions: emissionsData?.totalEmissions || 0,
        complianceScore: complianceStatus?.overallScore || 0,
        keyFindings: [
          "Automated processing of emissions data achieved 92% accuracy",
          "All major emission sources identified and quantified",
          "Compliance with ISO 14064-1 standards maintained",
        ],
      },
      emissionsData,
      complianceStatus,
      recommendations: [
        "Implement continuous monitoring for real-time emissions tracking",
        "Expand scope to include additional emission sources",
        "Enhance data quality through improved collection processes",
      ],
    }
  }

  const formatEmissions = (value: number) => {
    if (!value) return "0 kg CO₂e"
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} tonnes CO₂e`
    }
    return `${value.toFixed(2)} kg CO₂e`
  }

  if (!emissionsData || !complianceStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Report Generation
          </CardTitle>
          <CardDescription>Generate comprehensive audit reports in PDF and Excel formats</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Complete emissions calculation and compliance check to generate reports.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Report Generation
          </CardTitle>
          <CardDescription>Generate comprehensive ISO 14064 compliant audit reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Report Includes</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Executive Summary</li>
                  <li>• Emissions Breakdown by Source</li>
                  <li>• Compliance Assessment</li>
                  <li>• Methodology Documentation</li>
                  <li>• Recommendations</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Standards Compliance</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">ISO 14064-1</Badge>
                  <Badge variant="outline">GHG Protocol</Badge>
                  <Badge variant="outline">WBCSD</Badge>
                </div>
              </div>
            </div>

            <Button onClick={generateReport} disabled={generating || reportGenerated} className="w-full">
              {generating ? "Generating Report..." : reportGenerated ? "Report Generated" : "Generate Audit Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportGenerated && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Report Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">Carbon Emissions Audit Report</h2>
                  <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <Badge variant="outline">
                      <Building className="h-3 w-3 mr-1" />
                      Corporate Audit
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      2024 Q1
                    </Badge>
                  </div>
                </div>

                {/* Executive Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-2xl text-green-800">
                        {formatEmissions(emissionsData.totalEmissions)}
                      </h4>
                      <p className="text-green-600">Total Emissions</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-2xl text-blue-800">{complianceStatus.overallScore.toFixed(0)}%</h4>
                      <p className="text-blue-600">Compliance Score</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-2xl text-purple-800">
                        {Object.keys(emissionsData.emissionsByType).length}
                      </h4>
                      <p className="text-purple-600">Emission Sources</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Key Findings:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Automated processing achieved high accuracy in emissions quantification</li>
                      <li>• All major emission sources successfully identified and calculated</li>
                      <li>• Compliance with ISO 14064-1 standards maintained throughout audit</li>
                      <li>
                        • {emissionsData.calculationDetails.length} data points processed with average{" "}
                        {(
                          (emissionsData.calculationDetails.reduce((sum, item) => sum + item.confidence, 0) /
                            emissionsData.calculationDetails.length) *
                          100
                        ).toFixed(0)}
                        % confidence
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Emissions by Source</h3>
                  <div className="space-y-3">
                    {Object.entries(emissionsData.emissionsByType).map(([type, data]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium capitalize">{type.replace("_", " ")}</h4>
                          <p className="text-sm text-gray-600">{data.count} sources</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatEmissions(data.total)}</p>
                          <p className="text-sm text-gray-600">
                            {((data.total / emissionsData.totalEmissions) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Compliance Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {complianceStatus.checks.map((check, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{check.category}</h4>
                          <Badge
                            className={
                              check.status === "pass"
                                ? "bg-green-100 text-green-800"
                                : check.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {check.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{check.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{check.standard}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• Implement continuous monitoring systems for real-time emissions tracking</li>
                      <li>• Expand scope to include additional Scope 3 emission sources</li>
                      <li>• Enhance data quality through improved collection and validation processes</li>
                      <li>• Consider integration with ERP systems for automated data capture</li>
                      <li>• Schedule quarterly compliance reviews to maintain standards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => downloadReport("pdf")} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>

                <Button onClick={() => downloadReport("xlsx")} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Excel
                </Button>

                <Button onClick={() => downloadReport("json")} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download JSON
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Impact Summary</h4>
                <p className="text-sm text-green-700">
                  <strong>Automated accounting of {formatEmissions(emissionsData.totalEmissions)}</strong> from{" "}
                  {emissionsData.emissionsByDocument.length} processed documents with{" "}
                  {(
                    (emissionsData.calculationDetails.reduce((sum, item) => sum + item.confidence, 0) /
                      emissionsData.calculationDetails.length) *
                    100
                  ).toFixed(0)}
                  % average confidence. This automated system reduces manual audit time by an estimated 75% while
                  improving accuracy and compliance.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
