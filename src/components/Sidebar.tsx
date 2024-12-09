import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-300 flex-shrink-0 p-4">
      <nav className="space-y-4">
        <div className="font-bold">見る化</div>
        <ul className="space-y-2 ml-4 text-sm">
          <li className="text-blue-600 font-semibold">製造ライン</li>
          <li>FDS No.01</li>
          <li>FDS No.02</li>
          <li>FDS No.03</li>
          <li>FDS No.04</li>
        </ul>
        <div className="font-bold mt-4">シミュレーター</div>
        <ul className="space-y-2 ml-4 text-sm">
          <li>新規作成</li>
          <li>フォルダー一覧</li>
        </ul>
        <div className="font-bold mt-4">その他</div>
        <ul className="space-y-2 ml-4 text-sm">
          <li>登録情報管理</li>
        </ul>
      </nav>
    </aside>
  );
}
