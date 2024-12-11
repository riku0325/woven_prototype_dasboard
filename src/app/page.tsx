/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, Label, Pie, PieChart } from 'recharts'
import { Calendar } from "@/components/ui/calendar"
import { Bell, ChevronDown, FileText, Home, Settings, FolderOpen, ArrowDownIcon, ArrowUpIcon } from "lucide-react"

// 提示されたマッピング表に基づくデータ
const mappingData: Record<string, { 負荷名称: string; 製造工程名: string }> = {
  "M工場 0043 B23-2|#06": { 負荷名称: "照明", 製造工程名: "共通" },
  "M工場 0043 B23-2|#02": { 負荷名称: "ZY-7477", 製造工程名: "粗材供給" },
  "M工場 0043 B23-2|#14": { 負荷名称: "CKA-0265", 製造工程名: "旋削1" },
  "M工場 0043 B23-2|#08": { 負荷名称: "LA-6836", 製造工程名: "旋削1" },
  "M工場 0043 B23-2|#09": { 負荷名称: "CKA-0266", 製造工程名: "旋削1" },
  "M工場 0043 B23-2|#12": { 負荷名称: "LA-6837", 製造工程名: "旋削1" },
  "M工場 0043 B23-2|#04": { 負荷名称: "CK-7630", 製造工程名: "旋削1" },
  "M工場 0043 B23-2|#01+#07": { 負荷名称: "MM-1064", 製造工程名: "転造" },
  "M工場 0043 B23-2|#03": { 負荷名称: "LA-5780", 製造工程名: "旋削2" },
  "M工場 0043 B23-2|#13": { 負荷名称: "LA-6362", 製造工程名: "旋削2" },
  "M工場 0043 B23-2|#15": { 負荷名称: "IH-3969", 製造工程名: "熱処理" },
  "M工場 0043 B23-2|#05": { 負荷名称: "IH-3700", 製造工程名: "熱処理" },
  "M工場 0045 B23-1|#01~#16の和": { 負荷名称: "ZED-2835?", 製造工程名: "熱処理" },
  "M工場 0041 B23-1|#01~#16の和": { 負荷名称: "KIH-3963?", 製造工程名: "熱処理" },
  "M工場 0043 B23-2|#10": { 負荷名称: "TS-3098", 製造工程名: "熱処理" },
  "M工場 0043 B23-2|#16": { 負荷名称: "ZY-7479-2", 製造工程名: "塗装" },
  "M工場 0043 B23-2|#11": { 負荷名称: "TS-8977", 製造工程名: "塗装" },
  "M工場 0040 B23-5|#01~#16の和": { 負荷名称: "ZY-7401", 製造工程名: "塗装" },
  // 必要に応じて追加可能
}

// カラム名解析関数
// カラム例:
// "M工場_0043_B23-2_#14" -> Name: "M工場 0043 B23-2", LabelID: "#14"
// "Group3_AI分析中#01" -> Name: "Group3 AI分析中", LabelID: "#01"
// 
// 手順:
// 1. '#'を含む最後の位置を探してLabelIDを抽出
// 2. それ以前をNameとして、'_'を半角スペースに
function parseColumnName(colName: string): { 負荷名称?: string; 製造工程名?: string; raw: string } {
  const hashIndex = colName.lastIndexOf('#')
  if (hashIndex === -1) {
    // '#'がない場合はマッピング不可、rawを返す
    return { raw: colName }
  }

  const labelID = colName.slice(hashIndex)  // "#XX"部分
  const namePart = colName.slice(0, hashIndex)
  
  // namePart中の'_'をスペースに
  const name = namePart.replace(/_/g, ' ').trim()

  const key = `M工場 0043 B23-2|${labelID}`
  console.log(key)
  console.log(name)
  console.log(mappingData)
  if (mappingData[key]) {
    return { ...mappingData[key], raw: colName }
  } else {
    return { raw: colName } // マッピングなしの場合はそのまま
  }
}

function getFormattedDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function getDateRangeArray(start: Date, end: Date): Date[] {
  const arr = []
  const current = new Date(start)
  while (current <= end) {
    arr.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return arr
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central">
      <tspan x={x} y={y-10} fontSize="12">{name}</tspan>
      <tspan x={x} y={y+10} fontSize="12">{value}</tspan>
    </text>
  )
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#666666', '#999999','#8dd1e1','#a4de6c','#d0ed57','#ffc0cb']

export default function Component() {
  const [selectedRange, setSelectedRange] = useState<{from?: Date; to?: Date}>({})
  const [csvData, setCsvData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [activeView, setActiveView] = useState<string>("全体")

  useEffect(() => {
    if (!selectedRange.from || !selectedRange.to) {
      setCsvData([])
      setColumns([])
      return
    }

    const dateArray = getDateRangeArray(selectedRange.from, selectedRange.to)

    async function fetchData() {
      // 例として、M工場_0040 B23-5_1分ごとの有効電力_YYYYMMDD.csvを参照
      // 実際にはselectedRangeから対応するファイルをfetchしてください
      const dailyDataPromises = dateArray.map(date => {
        const dateStr = getFormattedDate(date)
        const fileName = `M工場_0040 B23-5_1分ごとの有効電力_${dateStr}.csv`
        const filePath = `/data/${fileName}`

        return fetch(filePath)
        // @ts-ignore
          .then(response => {
            if (!response.ok) {
              return { date: `${date.getMonth() + 1}/${date.getDate()}` }
            }
            return response.text()
          })
          .then(text => {
            if (typeof text === 'string') {
              return new Promise((resolve) => {
                Papa.parse(text, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (result) => {
                    const fields = result.meta.fields
                    // @ts-ignore
                    const dataColumns = fields.filter(f => f !== "時間" && f !== "")

                    if (columns.length === 0 && dataColumns.length > 0) {
                      setColumns(dataColumns)
                    }

                    const sums: {[key: string]: number} = {}
                    dataColumns.forEach(c => sums[c] = 0)

                    result.data.forEach((row: any) => {
                      dataColumns.forEach(c => {
                        const val = parseFloat(row[c]) || 0
                        sums[c] += val
                      })
                    })

                    resolve({
                      date: `${date.getMonth() + 1}/${date.getDate()}`,
                      ...sums
                    })
                  }
                })
              })
            } else {
              return {
                date: `${date.getMonth() + 1}/${date.getDate()}`
              }
            }
          }).catch(() => {
            return { date: `${date.getMonth() + 1}/${date.getDate()}` }
          })
      })

      const dailyData = await Promise.all(dailyDataPromises)
      setCsvData(dailyData as any[])
    }

    fetchData()

  }, [selectedRange])

  const processViews = ["組材供給", "旋削1", "転造", "旋削2", "熱処理", "塗装", "照明"]

  const { totalByColumn, totalAll } = useMemo(() => {
    let totalAll = 0
    const totalByColumn: {[key:string]: number} = {}
    columns.forEach(col => totalByColumn[col] = 0)

    csvData.forEach(day => {
      columns.forEach(col => {
        const val = day[col] || 0
        totalByColumn[col] += val
        totalAll += val
      })
    })

    return { totalByColumn, totalAll }
  }, [csvData, columns])

  const donutChartDataWithCol = useMemo(() => {
    if (totalAll === 0) return []
    return columns.map(col => {
      const { 負荷名称, 製造工程名 } = parseColumnName(col)
      return {
        col,
        負荷名称,
        製造工程名,
        value: totalByColumn[col],
      }
    })
  }, [totalByColumn, totalAll, columns])

  const donutChartData = useMemo(() => {
    return donutChartDataWithCol.map(item => {
      const displayName = (item.負荷名称 && item.製造工程名) ? `${item.負荷名称}(${item.製造工程名})` : item.col
      return {
        name: displayName,
        value: item.value,
      }
    })
  }, [donutChartDataWithCol])

  // トップ5表: 工程名(=製造工程名)と設備(=負荷名称)
  const top5Data = useMemo(() => {
    if (donutChartDataWithCol.length === 0) return []
    const sorted = [...donutChartDataWithCol].sort((a,b) => b.value - a.value).slice(0,10)
    return sorted.map((item, index) => ({
      rank: index+1,
      process: item.製造工程名 || "不明工程",
      equipment: item.負荷名称 || item.col,
      usage: Math.round(item.value)
    }))
  }, [donutChartDataWithCol])

  const monthlyConsumption = Math.round(totalAll)
  const monthlyCO2 = Math.round(totalAll * 0.5)
  const monthlyCost = Math.round(totalAll * 20)

  const prevMonthDiffConsumption = -59 
  const prevMonthDiffCO2 = -72
  const prevMonthDiffCost = 23118
  const isConsumptionDown = prevMonthDiffConsumption < 0
  const isCO2Down = prevMonthDiffCO2 < 0
  const isCostUp = prevMonthDiffCost > 0

  const rangeTitle = (selectedRange.from && selectedRange.to)
    ? `${selectedRange.from.getMonth()+1}/${selectedRange.from.getDate()}〜${selectedRange.to.getMonth()+1}/${selectedRange.to.getDate()}`
    : ""

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-gray-100 border-r">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">見える化</h2>
          <nav className="space-y-4">
            <div className="space-y-2">
              <a href="#" className="flex items-center space-x-2 p-2 rounded-lg bg-white">
                <FileText className="w-5 h-5" />
                <span>新規作成</span>
              </a>
            </div>

            <div className="space-y-2">
              <div className="font-medium">製造ライン</div>
              <div>
                <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white">
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5" />
                    <span>製造ライン</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="ml-6 mt-2 space-y-1">
                  <a href="#" className="block p-2 rounded-lg bg-blue-100 text-blue-800">FDS No.01</a>
                  <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.02</a>
                  <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.03</a>
                  <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.04</a>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium">シミュレーター</div>
              <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white">
                <FileText className="w-5 h-5" />
                <span>新規作成</span>
              </a>
              <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white">
                <FolderOpen className="w-5 h-5" />
                <span>フォルダ一覧</span>
              </a>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="font-medium mb-2">そのほか</div>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white">
            <Settings className="w-5 h-5" />
            <span>設定情報管理</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
              製造ライン FDS No.01 {rangeTitle}
            </h1>
            
            <div className="flex space-x-2 items-center" style={{ width: "65%" }}>
              <Button 
                variant={activeView === "全体" ? "default" : "outline"}
                onClick={() => setActiveView("全体")}
                className="min-w-[100px]"
              >
                全体
              </Button>
              
              <div className="flex-1 bg-white rounded-lg border">
                <div className="flex divide-x">
                  {processViews.map(view => (
                    <button
                      key={view}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors
                        ${activeView === view ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                        first:rounded-l-lg last:rounded-r-lg`}
                      onClick={() => setActiveView(view)}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <div className="grid grid-cols-2 gap-6">
                <Card className="col-span-1">
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={donutChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          innerRadius={50}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {donutChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                          <Label
                            value={donutChartData.reduce((sum, entry) => sum + entry.value, 0)}
                            position="center"
                            fill="#333333"
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              fontFamily: 'Arial',
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>{rangeTitle ? `${rangeTitle} 使用電力量トップ10` : "使用電力量トップ10"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">順位</th>
                          <th className="text-left">工程名</th>
                          <th className="text-left">設備</th>
                          <th className="text-right">使用kWh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top5Data.map((row) => (
                          <tr key={row.rank} className="border-t">
                            <td className="py-2">{row.rank}</td>
                            <td>{row.process}</td>    {/* 工程名 */}
                            <td>{row.equipment}</td>  {/* 設備 */}
                            <td className="text-right">{row.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>範囲指定日 電力消費状況 (日合計)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={csvData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          // @ts-ignore
                          const { 製造工程名 } = parseColumnName(name)
                          const displayName = 製造工程名 || name
                          return [value, displayName]
                        }}
                      />
                      <Legend formatter={(value) => {
                        const { 製造工程名 } = parseColumnName(value)
                        return 製造工程名 || value
                      }} />
                      {columns.map((col, idx) => {
                        const { 製造工程名 } = parseColumnName(col)
                        const displayName = 製造工程名 || col
                        return (
                          <Bar
                            key={col}
                            dataKey={col}
                            name={displayName}
                            fill={COLORS[idx % COLORS.length]} 
                            stackId="a"
                          />
                        )
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 space-y-6">
              <Card>
                <CardContent className="p-0">
                  <Calendar
                    mode="range"
                    // @ts-ignore
                    selected={selectedRange}
                    onSelect={(range) => {
                      // @ts-ignore
                      setSelectedRange(range)
                    }}
                    className="w-full"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>週間 消費電力量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyConsumption} kwh</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前週比 {prevMonthDiffConsumption} kwh
                    {isConsumptionDown ? 
                      <ArrowDownIcon className="w-4 h-4 ml-1 text-green-500" />
                    : 
                      <ArrowUpIcon className="w-4 h-4 ml-1 text-red-500" />
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>週間 CO2排出量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyCO2} kg-CO2</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前週比 {prevMonthDiffCO2} kg-CO2
                    {isCO2Down ?
                      <ArrowDownIcon className="w-4 h-4 ml-1 text-green-500" />
                    :
                      <ArrowUpIcon className="w-4 h-4 ml-1 text-red-500" />
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>週間 電力料金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">¥{monthlyCost.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前週比 +¥{prevMonthDiffCost.toLocaleString()}
                    {isCostUp ? 
                      <ArrowUpIcon className="w-4 h-4 ml-1 text-red-500" />
                    :
                      <ArrowDownIcon className="w-4 h-4 ml-1 text-green-500" />
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Bell className="w-5 h-5" />
              <CardTitle>AIからのお知らせ</CardTitle>
            </CardHeader>
            <CardContent>
              {csvData.length > 0 && columns.length > 0 ? (
                (() => {
                  let maxVal = -Infinity
                  let maxCol = ""
                  csvData.forEach(day => {
                    columns.forEach(c => {
                      const v = day[c] || 0
                      if (v > maxVal) {
                        maxVal = v
                        maxCol = c
                      }
                    })
                  })
                  const { 負荷名称, 製造工程名 } = parseColumnName(maxCol)
                  const maxProcess = 製造工程名 || "不明工程"
                  const maxEquipment = 負荷名称 || maxCol
                  return <p>・選択範囲内で最も消費電力が多かったのは【工程名: {maxProcess}, 設備: {maxEquipment}】です</p>
                })()
              ) : (
                <p>・データがありません</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
