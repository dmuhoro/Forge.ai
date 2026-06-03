import type { ParsedFile } from './fileParser';

const MAIN_JSX = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;

const INDEX_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

export const TEMPLATES: Record<string, ParsedFile[]> = {
  blank: [
    {
      path: 'src/App.jsx',
      content: `export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hello, World</h1>
        <p className="text-gray-500 text-lg">
          Describe what you want to build in the chat and Forge will build it.
        </p>
      </div>
    </div>
  );
}`,
    },
    { path: 'src/main.jsx', content: MAIN_JSX },
    { path: 'index.css', content: INDEX_CSS },
  ],

  landing: [
    {
      path: 'src/App.jsx',
      content: `import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning fast', desc: 'Built for speed from the ground up.' },
  { icon: Shield, title: 'Secure by default', desc: 'Enterprise-grade security out of the box.' },
  { icon: Globe, title: 'Global reach', desc: 'Deploy anywhere in seconds.' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-xl text-gray-900">Brand</span>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
            Get started
          </button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-8">
        <div className="py-32 text-center">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
            The better way<br />to build products
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
            Ship faster, scale effortlessly, and delight your customers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 flex items-center gap-2">
              Start for free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50">
              See demo
            </button>
          </div>
        </div>
        <div id="features" className="py-24 grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2025 Brand. All rights reserved.
      </footer>
    </div>
  );
}`,
    },
    { path: 'src/main.jsx', content: MAIN_JSX },
    { path: 'index.css', content: INDEX_CSS },
  ],

  dashboard: [
    {
      path: 'src/App.jsx',
      content: `import { BarChart2, Users, TrendingUp, DollarSign, Home, Settings, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 4900 },
  { month: 'Apr', revenue: 7200 },
  { month: 'May', revenue: 6800 },
  { month: 'Jun', revenue: 9100 },
];

const metrics = [
  { icon: DollarSign, label: 'Revenue', value: '$48,295', change: '+12.5%', positive: true },
  { icon: Users, label: 'Users', value: '2,841', change: '+8.2%', positive: true },
  { icon: TrendingUp, label: 'Conversion', value: '3.24%', change: '-0.4%', positive: false },
  { icon: BarChart2, label: 'Sessions', value: '18,402', change: '+24.1%', positive: true },
];

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-lg">Dashboard</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[{ icon: Home, label: 'Overview' }, { icon: BarChart2, label: 'Analytics' }, { icon: Users, label: 'Users' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="font-semibold text-gray-900">Overview</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Bell className="w-5 h-5 text-gray-500" /></button>
        </header>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map(({ icon: Icon, label, value, change, positive }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className={\`text-xs mt-1 \${positive ? 'text-green-600' : 'text-red-500'}\`}>{change} vs last month</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}`,
    },
    { path: 'src/main.jsx', content: MAIN_JSX },
    { path: 'index.css', content: INDEX_CSS },
  ],

  saas: [
    {
      path: 'src/App.jsx',
      content: `import { useState } from 'react';
import { Settings, LogOut, CreditCard, Users, Bell, ChevronRight, Check } from 'lucide-react';

const plans = [
  { name: 'Starter', price: '$9', features: ['5 projects', '10GB storage', 'Basic analytics'] },
  { name: 'Pro', price: '$29', features: ['Unlimited projects', '100GB storage', 'Advanced analytics', 'Priority support'], popular: true },
  { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Custom integrations', 'SLA guarantee', 'Dedicated manager'] },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-gray-900">SaaSApp</span>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Bell className="w-5 h-5 text-gray-500" /></button>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">J</div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {['overview', 'settings', 'billing'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={\`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all \${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>{t}</button>
          ))}
        </div>
        {tab === 'overview' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, John</h1>
            <div className="grid md:grid-cols-3 gap-4">
              {[{ icon: Users, label: 'Team members', value: '8' }, { icon: CreditCard, label: 'Current plan', value: 'Pro' }, { icon: Settings, label: 'Integrations', value: '4' }].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">{label}</p><p className="font-bold text-gray-900 text-xl">{value}</p></div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-blue-600" /></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {['Profile', 'Notifications', 'Security', 'API Keys'].map((item) => (
              <div key={item} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer">
                <span className="text-sm font-medium text-gray-900">{item}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
        {tab === 'billing' && (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(({ name, price, features, popular }) => (
              <div key={name} className={\`bg-white rounded-xl border p-6 relative \${popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}\`}>
                {popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Popular</span>}
                <h3 className="font-bold text-gray-900">{name}</h3>
                <p className="text-3xl font-bold text-gray-900 my-3">{price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <ul className="space-y-2 mb-6">
                  {features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 shrink-0" />{f}</li>)}
                </ul>
                <button className={\`w-full py-2 rounded-lg text-sm font-medium \${popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}\`}>Choose plan</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`,
    },
    { path: 'src/main.jsx', content: MAIN_JSX },
    { path: 'index.css', content: INDEX_CSS },
  ],
};
