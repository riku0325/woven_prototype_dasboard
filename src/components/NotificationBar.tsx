import React from 'react';

export default function NotificationBar() {
  return (
    <div className="bg-white p-4 rounded shadow text-sm">
      <div className="font-bold">AIからのお知らせ</div>
      <ul className="list-disc list-inside mt-2">
        <li>現在の消費電力1位のLA-6837は8回目の1位です</li>
      </ul>
    </div>
  );
}
