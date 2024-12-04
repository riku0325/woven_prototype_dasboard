'use client'

'use client'

import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, FileText, ArrowUpIcon, FolderOpen, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

// Time series data for the line chart
const timeSeriesData = Array.from({ length: 49 }, (_, i) => {
  const hour = Math.floor(i / 2) + 3
  const minute = (i % 2) * 30
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  return {
    time,
    'CKA-0265': Math.random() * 60 + 20,
    'LA-6836': Math.random() * 60 + 20,
    'CKA-0266': Math.random() * 60 + 20,
    'LA-6837': Math.random() * 60 + 20,
    'CK-7630': Math.random() * 60 + 20,
  }
})

// Bar chart data for AI analysis
const analysisData = Array.from({ length: 13 }, (_, i) => ({
  day: i + 18,
  current: Math.random() * 150 + 50,
  previous: Math.random() * 150 + 50,
}))

// Work schedule data
const workSchedule = [
  {
    shift: "1班",
    schedule: [
      { start: "6:00", end: "8:00" },
      { start: "10:00", end: "12:00" },
      { start: "14:00", end: "16:00" },
      { start: "18:00", end: "20:00" },
    ]
  },
  {
    shift: "2班",
    schedule: [
      { start: "16:00", end: "18:00" },
      { start: "20:00", end: "22:00" },
      { start: "0:00", end: "2:00" },
      { start: "4:00", end: "6:00" },
    ]
  }
]

export default function Component() {
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, boolean>>({
    'CKA-0265': true,
    'LA-6836': true,
    'CKA-0266': true,
    'LA-6837': true,
    'CK-7630': true,
  })
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 10, 18),
    to: addDays(new Date(2024, 10, 18), 6)
  })

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
              <div className="ml-2 space-y-1">
                <a href="#" className="block p-2 rounded-lg bg-blue-100 text-blue-800">FDS No.01</a>
                <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.02</a>
                <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.03</a>
                <a href="#" className="block p-2 rounded-lg hover:bg-white">FDS No.04</a>
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
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">製造ライン FDS No.01 11/18～11/24</h1>

              <div className="flex flex-col space-y-4">
                <Tabs defaultValue="仮組1" className="w-full">
                  <TabsList className="grid grid-cols-8 h-10">
                    <TabsTrigger value="全体">全体</TabsTrigger>
                    <TabsTrigger value="組材供給">組材供給</TabsTrigger>
                    <TabsTrigger value="仮組1">仮組1</TabsTrigger>
                    <TabsTrigger value="転造">転造</TabsTrigger>
                    <TabsTrigger value="仮組2">仮組2</TabsTrigger>
                    <TabsTrigger value="熱処理">熱処理</TabsTrigger>
                    <TabsTrigger value="塗装">塗装</TabsTrigger>
                    <TabsTrigger value="照明">照明</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex space-x-2">
                  {Object.keys(selectedEquipment).map((equipment) => (
                    <Button
                      key={equipment}
                      variant={selectedEquipment[equipment] ? "default" : "outline"}
                      onClick={() => setSelectedEquipment(prev => ({ ...prev, [equipment]: !prev[equipment] }))}
                      className="min-w-[100px]"
                    >
                      {equipment}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Card className="w-[300px]">
              <CardContent className="p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  defaultMonth={new Date(2024, 10)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <Card>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(timeSeriesData[0])
                        .filter(key => key !== 'time' && selectedEquipment[key])
                        .map((key, index) => (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            dot={false}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>作業工程表</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {workSchedule.map((shift) => (
                      <div key={shift.shift} className="flex items-center">
                        <span className="w-20 text-sm">{shift.shift}</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded relative">
                          {shift.schedule.map((period, index) => (
                            <div
                              key={index}
                              className="absolute h-full bg-gray-400"
                              style={{
                                left: `${(parseInt(period.start.split(':')[0]) - 3) / 24 * 100}%`,
                                width: `${2 / 24 * 100}%`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 space-y-4">
              <Card className="p-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-sm font-medium">週間 消費電力量</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">478 kwh</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    前週比 +59 kwh
                    <ArrowUpIcon className="w-3 h-3 ml-1 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-sm font-medium">週間 CO2排出量</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">88 kg-CO2</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    前週比 +72 kg-CO2
                    <ArrowUpIcon className="w-3 h-3 ml-1 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-sm font-medium">週間 電力料金</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">¥634,983</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    前週比 +¥23,118
                    <ArrowUpIcon className="w-3 h-3 ml-1 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <CardTitle>AIからのお知らせ</CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>・CKA-0265は水曜日と木曜日に電力消費量が高くなる予想です</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AIによる今後の分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" name="今週" fill="#8884d8" />
                  <Bar dataKey="previous" name="前月同期" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}