import React from 'react';

export default function InfoCards() {
  return (
    <div className="flex flex-wrap gap-4">
      {/* 週間消費電力量 */}
      <div className="bg-white p-4 rounded shadow w-48">
        <div className="text-sm text-gray-500">週間 消費電力量</div>
        <div className="text-2xl font-bold">478 kWh</div>
        <div className="text-sm text-green-600">前週比: -59 kWh</div>
      </div>

      {/* 週間 CO2排出量 */}
      <div className="bg-white p-4 rounded shadow w-48">
        <div className="text-sm text-gray-500">週間 CO2排出量</div>
        <div className="text-2xl font-bold">88 kg-CO2</div>
        <div className="text-sm text-green-600">前週比: -72 kg-CO2</div>
      </div>

      {/* 週間 電力料金 */}
      <div className="bg-white p-4 rounded shadow w-48">
        <div className="text-sm text-gray-500">週間 電力料金</div>
        <div className="text-2xl font-bold">¥634,983</div>
        <div className="text-sm text-green-600">前週比: +23,118</div>
      </div>
    </div>
  );
}
