import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="bg-indigo-900 text-white py-24 text-center px-6 shadow-inner">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Courier Management System
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-indigo-100 leading-relaxed">
          The next generation of logistics. A smart, reliable, and efficient platform 
          engineered to streamline shipment booking, real-time tracking, and automated cost logic.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-10">
        <div className="group rounded-2xl overflow-hidden shadow-xl bg-white transition-transform duration-300 hover:-translate-y-2">
          <div className="h-64 flex items-center justify-center bg-gray-100 p-4">
            <img
              src="/i3.png"
              alt="Courier Delivery"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Optimized routing for rapid doorstep delivery.</p>
          </div>
        </div>

        <div className="group rounded-2xl overflow-hidden shadow-xl bg-white transition-transform duration-300 hover:-translate-y-2">
          <div className="h-64 flex items-center justify-center bg-gray-100 p-4">
            <img
              src="/i1.png"
              alt="Shipment Tracking"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Smart Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor your parcel's journey at every milestone.</p>
          </div>
        </div>

        <div className="group rounded-2xl overflow-hidden shadow-xl bg-white transition-transform duration-300 hover:-translate-y-2">
          <div className="h-64 flex items-center justify-center bg-gray-100 p-4">
            <img
              src="/i2.png"
              alt="Warehouse Management"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Safe Handling</h3>
            <p className="text-gray-600 text-sm">Secure warehouse protocols for every shipment.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-indigo-600">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900">System Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our platform bridges the gap between manual logistics and digital precision. 
              By centralizing operations, we empower customers to book with confidence and 
              admins to manage with absolute control.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We focus on reducing friction in the delivery lifecycle. From automatic 
              cost calculation based on weight to role-specific dashboards, every 
              interaction is designed for speed and clarity.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-indigo-900 pl-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">Automated Costing</span>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">Admin Control</span>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">Staff Portals</span>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">Secure Database</span>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">React Frontend</span>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                <span className="font-semibold text-indigo-900">Django Backend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}