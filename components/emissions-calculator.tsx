"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Leaf } from "lucide-react"

interface EmissionsCalculatorProps {
  extractedData: any[]
  onEmissionsCalculated: (data: any) => void
}

// Standard emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
  electricity: 0.45, // kg CO2e per kWh (US average)
  natural_gas: 0.0053, // kg CO2e per cubic foot
  diesel: 10.15, // kg CO2e per gallon
  gasoline: 8.89, // kg CO2e per gallon
  peak_demand: 0.45, // Same as electricity for demand-based calculations
}

export default function EmissionsCalculator({ extractedData, onEmissionsCalculated }: EmissionsCalculatorProps) {
  const [calculating, setCalculating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [emissionsResults, setEmissionsResults] = useState<any>(null)

  const calculateEmissions = async () => {
    setCalculating(true)
    setProgress(0)

    let totalEmissions = 0
    const calculationDetails = []
    const emissionsByType = {}
    const emissionsByDocument = []

    // Process each document
    for (let i = 0; i < extractedData.length; i++) {
      const docData = extractedData[i]
      let docEmissions = 0
      const docCalculations = []

      // Calculate emissions for each extracted item
      for (const item of docData.items) {
        const emissionFactor = EMISSION_FACTORS[item.type] || 0
        const emissions = item.value * emissionFactor

        docEmissions += emissions
        totalEmissions += emissions

        // Track by type
        if (!emissionsByType[item.type]) {
          emissionsByType[item.type] = { total: 0, count: 0, unit: item.unit }
        }
        emissionsByType[item.type].total += emissions
        emissionsByType[item.type].count += 1

        docCalculations.push({
          source: item.source,
          type: item.type,
          value: item.value,
          unit: item.unit,
          emissionFactor,
          emissions,
          confidence: item.confidence,
        })

        calculationDetails.push({
          document: docData.documentName,
          ...docCalculations[docCalculations.length - 1],
        })
      }

      emissionsByDocument.push({
        documentId: docData.documentId,
        documentName: docData.documentName,
        emissions: docEmissions,
        calculations: docCalculations,
      })

      setProgress(((i + 1) / extractedData.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    const results = {
      totalEmissions,
      emissionsByType,
      emissionsByDocument,
      calculationDetails,
      calculatedAt: new Date().toISOString(),
      methodology: "GHG Protocol Corporate Standard",
      emissionFactorsUsed: EMISSION_FACTORS,
    }

    setEmissionsResults(results)
    setCalculating(false)
    onEmissionsCalculated(results)
  }

  const formatEmissions = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} tonnes CO₂e`
    }
    return `${value.toFixed(2)} kg CO₂e`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "electricity":
        return "⚡"
      case "natural_gas":
        return "🔥"
      case "diesel":
        return "⛽"
      case "gasoline":
        return "🚗"
      default:
        return "🏭"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            GHG Emissions Calculation
          </CardTitle>
          <CardDescription>Computing carbon emissions using GHG Protocol standard emission factors</CardDescription>
        </CardHeader>
        <CardContent>
          {extractedData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No extracted data available. Please complete data extraction first.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Emission Factors Used</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>Electricity: 0.45 kg CO₂e/kWh</div>
                  <div>Natural Gas: 0.0053 kg CO₂e/ft³</div>
                  <div>Diesel: 10.15 kg CO₂e/gal</div>
                  <div>Gasoline: 8.89 kg CO₂e/gal</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Ready to calculate emissions from {extractedData.reduce((sum, doc) => sum + doc.items.length, 0)} data
                  points
                </span>
                <Button onClick={calculateEmissions} disabled={calculating}>
                  {calculating ? "Calculating..." : "Calculate Emissions"}
                </Button>
              </div>

              {calculating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing emissions calculations...</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {emissionsResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Emissions Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-800">
                    {formatEmissions(emissionsResults.totalEmissions)}
                  </h3>
                  <p className="text-green-600">Total Carbon Emissions</p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-800">
                    {Object.keys(emissionsResults.emissionsByType).length}
                  </h3>
                  <p className="text-blue-600">Emission Sources</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-purple-800">{emissionsResults.emissionsByDocument.length}</h3>
                  <p className="text-purple-600">Documents Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emissions by Source Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(emissionsResults.emissionsByType).map(([type, data]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(type)}</span>
                      <div>
                        <h4 className="font-medium capitalize">{type.replace("_", " ")}</h4>
                        <p className="text-sm text-gray-600">{data.count} sources</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatEmissions(data.total)}</p>
                      <p className="text-sm text-gray-600">
                        {((data.total / emissionsResults.totalEmissions) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emissionsResults.emissionsByDocument.map((doc) => (
                  <div key={doc.documentId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{doc.documentName}</h4>
                      <Badge variant="outline">{formatEmissions(doc.emissions)}</Badge>
                    </div>

                    <div className="space-y-2">
                      {doc.calculations.map((calc, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{calc.source}</p>
                              <p className="text-gray-600">
                                {calc.value.toLocaleString()} {calc.unit} × {calc.emissionFactor} kg CO₂e/{calc.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatEmissions(calc.emissions)}</p>
                              <Badge variant="secondary" className="text-xs">
                                {(calc.confidence * 100).toFixed(0)}% confidence
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
