'use client'

import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, ChevronDown, FileText, Home, Settings, ArrowDownIcon, ArrowUpIcon, FolderOpen } from "lucide-react"
import { useState } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts'

// Previous data constants remain the same...
const donutData = [
  { name: "塗装", value: 4473, percentage: 12.82 },
  { name: "組材供給", value: 6980, percentage: 20.01 },
  { name: "仮組1", value: 6732, percentage: 19.30 },
  { name: "転造", value: 7543, percentage: 21.62 },
  { name: "仮組2", value: 6844, percentage: 19.62 },
  { name: "熱処理", value: 2315, percentage: 6.63 },
]

const powerUsageData = [
  { rank: 1, process: "転造", equipment: "LA-6837", usage: 1190 },
  { rank: 2, process: "塗装", equipment: "ZY-7479-2", usage: 679 },
  { rank: 3, process: "塗装", equipment: "CKA-0265", usage: 352 },
  { rank: 4, process: "残留応力", equipment: "IH-3969", usage: 76 },
  { rank: 5, process: "転造切削", equipment: "IH-3700", usage: 43 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#666666', '#999999']

const timeSeriesData = [
  { date: '2024-11-01', 塗装: 1000, 組材供給: 1200, 仮組1: 800, 転造: 1500, 仮組2: 1300, 熱処理: 500 },
  { date: '2024-11-02', 塗装: 1100, 組材供給: 1300, 仮組1: 900, 転造: 1600, 仮組2: 1400, 熱処理: 600 },
  { date: '2024-11-03', 塗装: 1200, 組材供給: 1100, 仮組1: 1000, 転造: 1400, 仮組2: 1500, 熱処理: 550 },
  { date: '2024-11-04', 塗装: 1300, 組材供給: 1400, 仮組1: 950, 転造: 1700, 仮組2: 1200, 熱処理: 700 },
  { date: '2024-11-05', 塗装: 1150, 組材供給: 1250, 仮組1: 1100, 転造: 1550, 仮組2: 1350, 熱処理: 600 },
]

const workSchedule = [
  { 
    name: "粗材供給", 
    planned: [{ start: 2, end: 5 }, { start: 11, end: 14 }, { start: 21, end: 24 }],
    actual: [{ start: 2, end: 4 }, { start: 11, end: 13 }, { start: 21, end: 23 }]
  },
  { 
    name: "旋削1", 
    planned: [{ start: 3, end: 7 }, { start: 13, end: 17 }, { start: 23, end: 27 }],
    actual: [{ start: 3, end: 6 }, { start: 13, end: 16 }, { start: 23, end: 26 }]
  },
  { 
    name: "転造", 
    planned: [{ start: 5, end: 9 }, { start: 15, end: 19 }, { start: 25, end: 29 }],
    actual: [{ start: 5, end: 8 }, { start: 15, end: 18 }, { start: 25, end: 28 }]
  },
  { 
    name: "旋削2", 
    planned: [{ start: 1, end: 6 }, { start: 11, end: 16 }, { start: 21, end: 26 }],
    actual: [{ start: 1, end: 5 }, { start: 11, end: 15 }, { start: 21, end: 25 }]
  },
  { 
    name: "熱処理", 
    planned: [{ start: 6, end: 8 }, { start: 16, end: 18 }, { start: 26, end: 28 }],
    actual: [{ start: 6, end: 7 }, { start: 16, end: 17 }, { start: 26, end: 27 }]
  },
  { 
    name: "塗装", 
    planned: [{ start: 4, end: 10 }, { start: 14, end: 20 }, { start: 24, end: 30 }],
    actual: [{ start: 4, end: 9 }, { start: 14, end: 19 }, { start: 24, end: 29 }]
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default function Component() {
  const [date, setDate] = useState<Date>(new Date(2024, 10))
  const [activeView, setActiveView] = useState<string>("全体")

  const processViews = ["組材供給", "仮組1", "転造", "仮組2", "熱処理", "塗装"]

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
            <h1 className="text-2xl font-semibold">製造ライン 6LA-GRG98 2024年11月</h1>
            
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
              
              <Button 
                variant={activeView === "照明" ? "default" : "outline"}
                onClick={() => setActiveView("照明")}
                className="min-w-[100px]"
              >
                照明
              </Button>
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
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          innerRadius={50}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                          <Label
                            value={donutData.reduce((sum, entry) => sum + entry.value, 0)}
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
                    <CardTitle>11月 消費電力量トップ5</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">順位</th>
                          <th className="text-left">工程名</th>
                          <th className="text-left">設備</th>
                          <th className="text-right">使用kwh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerUsageData.map((row) => (
                          <tr key={row.rank} className="border-t">
                            <td className="py-2">{row.rank}</td>
                            <td>{row.process}</td>
                            <td>{row.equipment}</td>
                            <td className="text-right">{row.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeSeriesData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(timeSeriesData[0]).filter(key => key !== 'date').map((key, index) => (
                        <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>作業工程表</CardTitle>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-gray-300"></div>
                      <span>予定</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-gray-600"></div>
                      <span>実績</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex border-b mb-4">
                        <div className="w-20"></div>
                        <div className="flex-1 grid grid-cols-[repeat(30,minmax(0,1fr))] text-center">
                          {Array.from({ length: 30 }, (_, i) => {
                            const day = i + 1
                            const isWeekend = [2,3,9,10,16,17,23,24,30].includes(day)
                            return (
                              <div 
                                key={i} 
                                className={`text-xs ${isWeekend ? 'text-red-500 font-medium' : ''}`}
                              >
                                {day}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {workSchedule.map((process) => (
                          <div key={process.name} className="flex items-center">
                            <span className="w-20 text-sm">{process.name}</span>
                            <div className="flex-1 space-y-1">
                              <div className="h-2 bg-gray-100 rounded relative">
                                {process.planned.map((period, index) => (
                                  <div
                                    key={`planned-${index}`}
                                    className="absolute h-full bg-gray-300"
                                    style={{
                                      left: `${(period.start - 1) / 30 * 100}%`,
                                      width: `${(period.end - period.start + 1) / 30 * 100}%`,
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="h-2 bg-gray-100 rounded relative">
                                {process.actual.map((period, index) => (
                                  <div
                                    key={`actual-${index}`}
                                    className="absolute h-full bg-gray-600"
                                    style={{
                                      left: `${(period.start - 1) / 30 * 100}%`,
                                      width: `${(period.end - period.start + 1) / 30 * 100}%`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 space-y-6">
              <Card>
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>月間 消費電力量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">43520 kwh</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前月比 -942 kwh
                    <ArrowDownIcon className="w-4 h-4 ml-1 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>月間 CO2排出量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4798 kg-CO2</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前月比 -233 kg-CO2
                    <ArrowDownIcon className="w-4 h-4 ml-1 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>月間 電力料金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">¥2,320,535</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    前月比 +¥23,118
                    <ArrowUpIcon className="w-4 h-4 ml-1 text-red-500" />
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
              <p>・現在の消費電力1位のLA-6837は8回目の1位です</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}