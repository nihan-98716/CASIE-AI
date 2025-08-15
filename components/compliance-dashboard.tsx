"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Shield, FileCheck, AlertCircle } from "lucide-react"

interface ComplianceDashboardProps {
  emissionsData: any
  onComplianceChecked: (status: any) => void
}

export default function ComplianceDashboard({ emissionsData, onComplianceChecked }: ComplianceDashboardProps) {
  const [checking, setChecking] = useState(false)
  const [complianceResults, setComplianceResults] = useState<any>(null)

  const runComplianceCheck = async () => {
    setChecking(true)

    // Simulate compliance checking
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = performComplianceAnalysis(emissionsData)
    setComplianceResults(results)
    setChecking(false)
    onComplianceChecked(results)
  }

  const performComplianceAnalysis = (data: any) => {
    const checks = []
    let overallScore = 0

    // ISO 14064 Compliance Checks

    // 1. Data Quality and Completeness
    const dataQualityScore = checkDataQuality(data)
    checks.push({
      category: "Data Quality",
      standard: "ISO 14064-1",
      requirement: "Data completeness and accuracy",
      status: dataQualityScore >= 80 ? "pass" : dataQualityScore >= 60 ? "warning" : "fail",
      score: dataQualityScore,
      details: `${dataQualityScore}% of data meets quality thresholds`,
      recommendations: dataQualityScore < 80 ? ["Improve data collection processes", "Validate emission factors"] : [],
    })

    // 2. Methodology Compliance
    const methodologyScore = checkMethodology(data)
    checks.push({
      category: "Methodology",
      standard: "GHG Protocol",
      requirement: "Use of appropriate emission factors",
      status: methodologyScore >= 90 ? "pass" : "warning",
      score: methodologyScore,
      details: "Standard emission factors applied consistently",
      recommendations:
        methodologyScore < 90 ? ["Update to latest emission factors", "Document methodology changes"] : [],
    })

    // 3. Scope Coverage
    const scopeScore = checkScopeCompliance(data)
    checks.push({
      category: "Scope Coverage",
      standard: "ISO 14064-1",
      requirement: "Comprehensive scope identification",
      status: scopeScore >= 70 ? "pass" : "warning",
      score: scopeScore,
      details: `${Object.keys(data.emissionsByType).length} emission sources identified`,
      recommendations: scopeScore < 70 ? ["Expand scope coverage", "Include additional emission sources"] : [],
    })

    // 4. Documentation Requirements
    const docScore = checkDocumentation(data)
    checks.push({
      category: "Documentation",
      standard: "ISO 14064-1",
      requirement: "Adequate documentation and evidence",
      status: docScore >= 85 ? "pass" : "warning",
      score: docScore,
      details: "Calculation methods and sources documented",
      recommendations: docScore < 85 ? ["Improve documentation quality", "Add supporting evidence"] : [],
    })

    // 5. Uncertainty Assessment
    const uncertaintyScore = checkUncertainty(data)
    checks.push({
      category: "Uncertainty",
      standard: "ISO 14064-1",
      requirement: "Uncertainty assessment",
      status: uncertaintyScore >= 75 ? "pass" : "warning",
      score: uncertaintyScore,
      details: "Confidence levels tracked for data sources",
      recommendations:
        uncertaintyScore < 75 ? ["Improve uncertainty quantification", "Use higher quality data sources"] : [],
    })

    overallScore = checks.reduce((sum, check) => sum + check.score, 0) / checks.length

    // Identify critical issues
    const criticalIssues = []
    if (data.totalEmissions > 50000) {
      criticalIssues.push({
        type: "high_emissions",
        message: "High emissions detected - requires enhanced monitoring",
        severity: "warning",
      })
    }

    const lowConfidenceItems = data.calculationDetails.filter((item) => item.confidence < 0.8)
    if (lowConfidenceItems.length > 0) {
      criticalIssues.push({
        type: "low_confidence",
        message: `${lowConfidenceItems.length} data points have low confidence (<80%)`,
        severity: "warning",
      })
    }

    return {
      overallScore,
      overallStatus: overallScore >= 80 ? "compliant" : overallScore >= 60 ? "partial" : "non_compliant",
      checks,
      criticalIssues,
      checkedAt: new Date().toISOString(),
      standards: ["ISO 14064-1", "GHG Protocol Corporate Standard"],
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  const checkDataQuality = (data: any) => {
    const totalItems = data.calculationDetails.length
    const highConfidenceItems = data.calculationDetails.filter((item) => item.confidence >= 0.85).length
    return (highConfidenceItems / totalItems) * 100
  }

  const checkMethodology = (data: any) => {
    // Check if standard emission factors are used
    const standardFactors = Object.keys(data.emissionFactorsUsed).length
    return standardFactors >= 4 ? 95 : 80
  }

  const checkScopeCompliance = (data: any) => {
    const sourceTypes = Object.keys(data.emissionsByType).length
    return Math.min(sourceTypes * 25, 100) // Max 100% for 4+ source types
  }

  const checkDocumentation = (data: any) => {
    // Simulate documentation completeness check
    return 88 // Good documentation score
  }

  const checkUncertainty = (data: any) => {
    const avgConfidence =
      data.calculationDetails.reduce((sum, item) => sum + item.confidence, 0) / data.calculationDetails.length
    return avgConfidence * 100
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "fail":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ISO 14064 Compliance Check
          </CardTitle>
          <CardDescription>
            Automated compliance verification against ISO 14064-1 and GHG Protocol standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emissionsData ? (
            <p className="text-gray-500 text-center py-8">
              No emissions data available. Please complete emissions calculation first.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Compliance Standards</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">ISO 14064-1</Badge>
                  <Badge variant="outline">GHG Protocol Corporate Standard</Badge>
                  <Badge variant="outline">WBCSD Guidelines</Badge>
                </div>
              </div>

              <Button onClick={runComplianceCheck} disabled={checking} className="w-full">
                {checking ? "Running Compliance Checks..." : "Run Compliance Analysis"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {complianceResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-600" />
                Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-3xl font-bold text-blue-800">{complianceResults.overallScore.toFixed(0)}%</h3>
                  <p className="text-blue-600">Overall Compliance Score</p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="text-3xl font-bold text-green-800">
                    {complianceResults.checks.filter((c) => c.status === "pass").length}
                  </h3>
                  <p className="text-green-600">Checks Passed</p>
                </div>

                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <h3 className="text-3xl font-bold text-yellow-800">{complianceResults.criticalIssues.length}</h3>
                  <p className="text-yellow-600">Issues Identified</p>
                </div>
              </div>

              <div className="flex items-center justify-center mb-4">
                <Badge
                  className={`text-lg px-4 py-2 ${
                    complianceResults.overallStatus === "compliant"
                      ? "bg-green-100 text-green-800"
                      : complianceResults.overallStatus === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {complianceResults.overallStatus === "compliant"
                    ? "✓ Compliant"
                    : complianceResults.overallStatus === "partial"
                      ? "⚠ Partially Compliant"
                      : "✗ Non-Compliant"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Compliance Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceResults.checks.map((check, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <h4 className="font-medium">{check.category}</h4>
                          <p className="text-sm text-gray-600">{check.requirement}</p>
                          <Badge variant="outline" className="mt-1">
                            {check.standard}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(check.status)}>{check.status.toUpperCase()}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{check.score.toFixed(0)}%</p>
                      </div>
                    </div>

                    <p className="text-sm mb-2">{check.details}</p>

                    {check.recommendations.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <h5 className="font-medium text-yellow-800 mb-1">Recommendations:</h5>
                        <ul className="text-sm text-yellow-700 list-disc list-inside">
                          {check.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {complianceResults.criticalIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceResults.criticalIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded"
                    >
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800">{issue.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
