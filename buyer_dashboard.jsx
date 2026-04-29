import React, { useState, useEffect } from 'react';
import { MapPin, Star, TrendingUp, MessageCircle, CheckCircle } from 'lucide-react';

export default function FarmBridgeBuyerDashboard() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ crop: 'all', grade: 'all', state: 'all' });
  const [selectedListing, setSelectedListing] = useState(null);

  // Mock data - in production, fetch from backend
  const mockListings = [
    {
      id: 1,
      farmer_name: "Rajesh Kumar",
      village: "Sonkhet",
      state: "Maharashtra",
      crop: "tomato",
      quantity: "50 kg",
      grade: "A",
      score: 92,
      price_per_kg: 16,
      msp: 5.50,
      mandi: 15,
      image: "🍅",
      days_ago: 2,
      rating: 4.8,
      reviews: 12,
      description: "Fresh, bright red tomatoes. Picked this morning. Perfect for restaurants.",
      phone: "+91-9876543210"
    },
    {
      id: 2,
      farmer_name: "Priya Singh",
      village: "Banasthali",
      state: "Rajasthan",
      crop: "potato",
      quantity: "100 kg",
      grade: "B",
      score: 78,
      price_per_kg: 8,
      msp: 2.50,
      mandi: 8,
      image: "🥔",
      days_ago: 1,
      rating: 4.6,
      reviews: 8,
      description: "Good quality potatoes. Suitable for retail chains.",
      phone: "+91-9876543211"
    },
    {
      id: 3,
      farmer_name: "Harjeet Patel",
      village: "Sehore",
      state: "Madhya Pradesh",
      crop: "onion",
      quantity: "200 kg",
      grade: "A",
      score: 88,
      price_per_kg: 12,
      msp: 2.20,
      mandi: 12,
      image: "🧅",
      days_ago: 3,
      rating: 4.9,
      reviews: 25,
      description: "Golden onions. High yield. Bulk discount available.",
      phone: "+91-9876543212"
    }
  ];

  useEffect(() => {
    setListings(mockListings);
  }, []);

  const filteredListings = listings.filter(listing => {
    return (filters.crop === 'all' || listing.crop === filters.crop) &&
           (filters.grade === 'all' || listing.grade === filters.grade) &&
           (filters.state === 'all' || listing.state === filters.state);
  });

  const GradeColor = (grade) => {
    const colors = { A: 'bg-green-100 text-green-800', B: 'bg-yellow-100 text-yellow-800', C: 'bg-orange-100 text-orange-800' };
    return colors[grade] || 'bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6">
        <h1 className="text-3xl font-bold">🌾 FarmBridge Buyer Dashboard</h1>
        <p className="text-emerald-100 mt-2">Direct from farmers. Zero middleman. Fair prices.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-white border-b">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">240+</div>
          <div className="text-gray-600 text-sm">Active Farmers</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">₹15-20</div>
          <div className="text-gray-600 text-sm">Avg Price/kg</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">2-4 hrs</div>
          <div className="text-gray-600 text-sm">Delivery Time</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border-b sticky top-0 z-10">
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.crop}
            onChange={(e) => setFilters({ ...filters, crop: e.target.value })}
            className="border rounded-lg p-2 text-sm"
          >
            <option value="all">All Crops</option>
            <option value="tomato">Tomato 🍅</option>
            <option value="potato">Potato 🥔</option>
            <option value="onion">Onion 🧅</option>
            <option value="wheat">Wheat 🌾</option>
          </select>

          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="border rounded-lg p-2 text-sm"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A (Premium)</option>
            <option value="B">Grade B (Good)</option>
            <option value="C">Grade C (Fair)</option>
          </select>

          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="border rounded-lg p-2 text-sm"
          >
            <option value="all">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            onClick={() => setSelectedListing(listing)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
          >
            {/* Listing Card */}
            <div className="p-4">
              {/* Crop Image & Grade */}
              <div className="flex justify-between items-start mb-3">
                <div className="text-5xl">{listing.image}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${GradeColor(listing.grade)}`}>
                  Grade {listing.grade}
                </div>
              </div>

              {/* Farmer Info */}
              <h3 className="text-lg font-bold text-gray-800">{listing.farmer_name}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {listing.village}, {listing.state}
              </div>

              {/* Crop & Quantity */}
              <div className="mt-3 bg-emerald-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Available:</div>
                <div className="text-xl font-bold text-emerald-700">{listing.quantity} {listing.crop}</div>
              </div>

              {/* Price Info */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-gray-600">Your Price</div>
                  <div className="font-bold text-lg">₹{listing.price_per_kg}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600">Market Price</div>
                  <div className="font-bold line-through text-sm">₹{listing.mandi}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-bold text-sm">{listing.rating}</span>
                  <span className="text-gray-500 text-xs ml-1">({listing.reviews} reviews)</span>
                </div>
                <div className="text-gray-500 text-xs">{listing.days_ago}d ago</div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setSelectedListing(listing)}
                className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                View & Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 text-gray-500 text-2xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedListing.farmer_name}</h2>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedListing.village}, {selectedListing.state}
                  </div>
                </div>
                <div className="text-6xl">{selectedListing.image}</div>
              </div>

              {/* Listing Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm">Quality Grade</div>
                  <div className={`text-2xl font-bold mt-1 ${GradeColor(selectedListing.grade).split(' ')[1]}`}>
                    Grade {selectedListing.grade}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Score: {selectedListing.score}/100</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm">Available Quantity</div>
                  <div className="text-2xl font-bold mt-1 text-blue-700">{selectedListing.quantity}</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm">FarmBridge Price</div>
                  <div className="text-2xl font-bold mt-1 text-green-700">₹{selectedListing.price_per_kg}/kg</div>
                  <div className="text-xs text-gray-600 mt-1">You save ₹{(selectedListing.mandi - selectedListing.price_per_kg).toFixed(2)}/kg vs retail</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm">MSP Reference</div>
                  <div className="text-sm font-bold mt-1 text-purple-700">MSP: ₹{selectedListing.msp}</div>
                  <div className="text-sm font-bold text-purple-700">Mandi: ₹{selectedListing.mandi}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700">{selectedListing.description}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                  <span className="font-bold text-lg">{selectedListing.rating} / 5.0</span>
                  <span className="text-gray-600 text-sm ml-2">({selectedListing.reviews} buyer reviews)</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified seller with consistent deliveries
                </div>
              </div>

              {/* Contact Section */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-800 mb-4">Next Steps</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/91${selectedListing.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                  <button className="flex items-center justify-center bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                    📞 Call Farmer
                  </button>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    💡 Tip: Negotiate bulk discounts. Most farmers offer 5-10% off for 500kg+ orders.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
