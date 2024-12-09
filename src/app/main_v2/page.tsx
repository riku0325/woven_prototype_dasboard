'use client'

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ChartDonut from '@/components/ChartDonut';
import ChartStackedBar from '@/components/ChartStackedBar';
import PowerConsumptionTable from '@/components/PowerConsumptionTable';
import InfoCards from '@/components/InfoCards';
import NotificationBar from '@/components/NotificationBar';

export default function Page() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-bold mb-4">製造ライン　FDS No.01　11/18～11/24</h1>
        
        <div className="flex flex-wrap gap-6">
          {/* 左側：ドーナツチャート */}
          <div className="w-full lg:w-1/2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">全体</h2>
            <ChartDonut />
          </div>

          {/* 右側：使用電力トップ10テーブル */}
          <div className="w-full lg:w-1/2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">11/18~11/24 使用電力トップ10</h2>
            <PowerConsumptionTable />
          </div>
        </div>
        
        {/* 積み上げバーグラフ */}
        <div className="mt-6 bg-white p-4 rounded shadow">
          <ChartStackedBar />
        </div>
        
        {/* 右サイドの各種情報カード群（モバイル時は下に表示） */}
        <div className="mt-6 flex flex-wrap gap-4">
          <InfoCards />
        </div>

        {/* 下部通知 */}
        <div className="mt-6">
          <NotificationBar />
        </div>
      </div>
    </div>
  );
}