"use client";

import { useState } from "react";
import type { USER_BY_EMAIL_QUERYResult } from "@/sanity/types/sanity.types";

interface AccountPageProps {
  user: NonNullable<USER_BY_EMAIL_QUERYResult>;
}

type TabType = "profile" | "orders" | "addresses";

export default function AccountPage({ user }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div>
      <h1 className="uppercase text-4xl font-extrabold mb-8">Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        {/* Tab Navigation Sidebar */}
        <nav aria-label="Account sections">
          <ul className="space-y-2 list-none" role="tablist">
            <li role="presentation">
              <button
                role="tab"
                aria-selected={activeTab === "profile"}
                aria-controls="profile-panel"
                id="profile-tab"
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 border transition-colors ${
                  activeTab === "profile"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-gray-50"
                }`}
              >
                Profile
              </button>
            </li>
            <li role="presentation">
              <button
                role="tab"
                aria-selected={activeTab === "orders"}
                aria-controls="orders-panel"
                id="orders-tab"
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-3 border transition-colors ${
                  activeTab === "orders"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-gray-50"
                }`}
              >
                Orders
              </button>
            </li>
            <li role="presentation">
              <button
                role="tab"
                aria-selected={activeTab === "addresses"}
                aria-controls="addresses-panel"
                id="addresses-tab"
                onClick={() => setActiveTab("addresses")}
                className={`w-full text-left px-4 py-3 border transition-colors ${
                  activeTab === "addresses"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-gray-50"
                }`}
              >
                Addresses
              </button>
            </li>
          </ul>
        </nav>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && (
            <section
              role="tabpanel"
              id="profile-panel"
              aria-labelledby="profile-tab"
              tabIndex={0}
            >
              <h2 className="text-2xl font-bold uppercase mb-6">Profile</h2>
              <div className="border p-6">
                <p>Profile content - Coming soon</p>
                <p className="text-sm text-gray-600 mt-4">
                  User: {user.firstName} {user.lastName}
                </p>
              </div>
            </section>
          )}

          {activeTab === "orders" && (
            <section
              role="tabpanel"
              id="orders-panel"
              aria-labelledby="orders-tab"
              tabIndex={0}
            >
              <h2 className="text-2xl font-bold uppercase mb-6">Orders</h2>
              <div className="border p-6">
                <p>Orders content - Coming soon</p>
              </div>
            </section>
          )}

          {activeTab === "addresses" && (
            <section
              role="tabpanel"
              id="addresses-panel"
              aria-labelledby="addresses-tab"
              tabIndex={0}
            >
              <h2 className="text-2xl font-bold uppercase mb-6">Addresses</h2>
              <div className="border p-6">
                <p>Addresses content - Coming soon</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
