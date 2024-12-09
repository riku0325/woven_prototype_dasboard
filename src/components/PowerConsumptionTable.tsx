import React from 'react';

export default function PowerConsumptionTable() {
  // サンプルデータ
  const rows = [
    { rank: 1, process: '旋削1', device: 'LA-6837', usage: 262 },
    { rank: 2, process: '旋削1', device: 'LA-6836', usage: 191 },
    { rank: 3, process: '旋削1', device: 'IH-3969', usage: 180 },
    { rank: 4, process: '塗装',   device: 'IH-3970', usage: 73 },
    { rank: 5, process: '塗装',   device: 'TS-8977', usage: 61 },
  ];

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">順位</th>
          <th className="text-left py-2">工程名</th>
          <th className="text-left py-2">設備</th>
          <th className="text-left py-2">使用kwh</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.rank} className="border-b">
            <td className="py-1">{r.rank}</td>
            <td className="py-1">{r.process}</td>
            <td className="py-1">{r.device}</td>
            <td className="py-1">{r.usage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
