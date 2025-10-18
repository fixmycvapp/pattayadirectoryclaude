"use client";

import { motion } from "framer-motion";
import { Bus, Bike, Car, MapPin, Clock, DollarSign, AlertCircle, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function TransportTips() {
  const transportOptions = [
    {
      icon: <Bus className="w-8 h-8" />,
      title: "Baht Bus (Songthaew)",
      color: "from-blue-500 to-cyan-500",
      price: "10-20 THB",
      description: "Blue songthaews run fixed routes along Beach Road and Second Road",
      tips: [
        "Flag down anywhere along the route",
        "Press the bell to signal your stop",
        "Pay when you get off",
        "Shared ride - fare is per person",
      ],
      routes: [
        { from: "North Pattaya", to: "South Pattaya", via: "Beach Road", fare: "10 THB" },
        { from: "South Pattaya", to: "North Pattaya", via: "Second Road", fare: "10 THB" },
        { from: "Jomtien", to: "Central Pattaya", via: "Beach Road", fare: "20 THB" },
      ],
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Motorbike Taxi",
      color: "from-orange-500 to-red-500",
      price: "50-150 THB",
      description: "Quick point-to-point transport, drivers wear numbered vests",
      tips: [
        "Find them at designated stands",
        "Agree on price before getting on",
        "Always wear the provided helmet",
        "Keep bags secure in front",
      ],
      zones: [
        { area: "Walking Street", price: "50-100 THB" },
        { area: "Central Pattaya", price: "40-80 THB" },
        { area: "Jomtien Beach", price: "100-150 THB" },
      ],
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Taxi & Grab",
      color: "from-green-500 to-emerald-500",
      price: "100-400 THB",
      description: "Metered taxis and ride-hailing apps for comfortable travel",
      tips: [
        "Use Bolt or InDrive apps for best prices",
        "Metered taxis start at 50 THB",
        "Airport to Pattaya: ~1,200 THB",
        "Always confirm fare before starting",
      ],
      apps: ["Bolt", "InDrive", "Grab"],
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Parking Spots",
      color: "from-purple-500 to-pink-500",
      price: "20-50 THB/hour",
      description: "Major parking areas for cars and motorbikes",
      tips: [
        "Central Festival: Free with purchase",
        "Terminal 21: 20 THB/hour",
        "Beach Road: Street parking 20 THB",
        "Many hotels offer free parking",
      ],
      locations: [
        { name: "Central Festival Pattaya", type: "Mall", rate: "Free (3 hrs)", capacity: "2000+" },
        { name: "Terminal 21 Pattaya", type: "Mall", rate: "20 THB/hr", capacity: "1500+" },
        { name: "Beach Road Public", type: "Street", rate: "20 THB/hr", capacity: "Limited" },
      ],
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Getting Around Pattaya
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete guide to transportation options, routes, and tips for navigating Pattaya like a local
        </p>
      </motion.div>

      {/* Transport Options */}
      <div className="space-y-8">
        {transportOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className={`bg-gradient-to-r ${option.color} p-6 text-white`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{option.title}</h2>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Typical Fare</div>
                    <div className="text-2xl font-bold">{option.price}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Tips */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    Pro Tips
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {option.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Routes */}
                {option.routes && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-green-500" />
                      Popular Routes
                    </h3>
                    <div className="space-y-2">
                      {option.routes.map((route, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="font-medium">{route.from}</span>
                              <span className="mx-2 text-gray-400">→</span>
                              <span className="font-medium">{route.to}</span>
                              <span className="text-sm text-gray-500 ml-2">via {route.via}</span>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{route.fare}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zones */}
                {option.zones && (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      Common Destinations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {option.zones.map((zone, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">{zone.area}</div>
                          <div className="text-sm text-gray-600">{zone.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apps */}
                {option.apps && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Recommended Apps</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.apps.map((app, idx) => (
                        <Badge key={idx} variant="outline" className="text-base px-4 py-2">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parking Locations */}
                {option.locations && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Car className="w-5 h-5 text-purple-500" />
                      Major Parking Areas
                    </h3>
                    <div className="space-y-2">
                      {option.locations.map((location, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">{location.rate}</div>
                            <div className="text-xs text-gray-500">{location.capacity} spaces</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-500" />
            Pattaya Transport Map
          </h2>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Interactive map showing baht bus routes, taxi stands, and parking areas
            </p>
            {/* TODO: Add actual map integration */}
          </div>
        </Card>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-900">
            <AlertCircle className="w-6 h-6" />
            Safety Reminders
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-yellow-900">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2" />
              <span>Always wear a helmet on motorbikes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2" />
              <span>Agree on fares before starting your journey</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2" />
              <span>Use ride-hailing apps for transparent pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2" />
              <span>Keep valuables secure and in sight</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}