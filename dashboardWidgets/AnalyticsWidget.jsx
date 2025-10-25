import React, { useEffect, useState, useMemo } from "react";
import { useClient } from "sanity";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ------------------- Orders Table -------------------
function OrdersTable({ orders, statusColors }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredOrders = useMemo(() => {
    return orders.filter(o => o?._id).filter(order => {
      const term = search.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(term) ||
        order.customerName?.toLowerCase().includes(term) ||
        String(order.totalPrice)?.includes(term) ||
        order.status?.toLowerCase().includes(term)
      );
    });
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Search Orders..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #555", flex: "1 1 auto", backgroundColor: "#2b2b2b", color: "#fff" }}
        />
        <div>
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} style={{ marginRight: "0.3rem" }}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} style={{ marginLeft: "0.3rem" }}>Next</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto", borderRadius: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr>
              {["Order ID", "Customer", "Total Price", "Order Date", "Status"].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid #555" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order._id}
                style={{ transition: "background 0.2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "0.6rem" }}>{order.orderNumber}</td>
                <td style={{ padding: "0.6rem" }}>{order.customerName}</td>
                <td style={{ padding: "0.6rem" }}>₹{order.totalPrice?.toLocaleString() || 0}</td>
                <td style={{ padding: "0.6rem" }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td style={{ padding: "0.6rem" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: statusColors[order.status] || "#888",
                    color: "#fff",
                    fontWeight: "600",
                    textTransform: "capitalize",
                    fontSize: "0.85rem"
                  }}>{order.status?.replace(/_/g, " ")}</span>
                </td>
              </tr>
            ))}
            {currentOrders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "1rem", textAlign: "center" }}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ------------------- Analytics Widget -------------------
export default {
  name: "analytics-widget",
  component: function AnalyticsWidget() {
    const client = useClient({ apiVersion: "2025-01-01" });
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("all");

    // Fetch Data (with draft filtering)
    useEffect(() => {
      Promise.all([
        client.fetch(`*[_type=="order" && !(_id in path("drafts.**"))]{
          _id, orderNumber, customerName, totalPrice, orderDate, status, products[]{product->{_id,name,stock,price,colors}, quantity}
        }`),
        client.fetch(`*[_type=="product" && !(_id in path("drafts.**"))]{
          _id, name, stock, price, colors
        }`)
      ])
        .then(([orderData, productData]) => {
          const uniqueProductsMap = new Map();
          productData.forEach(p => {
            if (!uniqueProductsMap.has(p._id)) uniqueProductsMap.set(p._id, p);
          });
          setOrders(orderData);
          setProducts(Array.from(uniqueProductsMap.values()));
        });
    }, [client]);

    // ---------- Filtering by Time ----------
    const now = new Date();
    const isSameDay = date => new Date(date).toDateString() === now.toDateString();
    const isSameWeek = date => {
      const d = new Date(date);
      const oneJan = new Date(d.getFullYear(), 0, 1);
      const dWeek = Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
      const nWeek = Math.ceil(((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
      return dWeek === nWeek && d.getFullYear() === now.getFullYear();
    };
    const isSameMonth = date => new Date(date).getMonth() === now.getMonth() && new Date(date).getFullYear() === now.getFullYear();
    const isSameYear = date => new Date(date).getFullYear() === now.getFullYear();

    const filteredOrders = useMemo(() => {
      switch (filter) {
        case "today": return orders.filter(o => o?._id && isSameDay(o.orderDate));
        case "week": return orders.filter(o => o?._id && isSameWeek(o.orderDate));
        case "month": return orders.filter(o => o?._id && isSameMonth(o.orderDate));
        case "year": return orders.filter(o => o?._id && isSameYear(o.orderDate));
        default: return orders.filter(o => o?._id);
      }
    }, [orders, filter]);

    // ---------- KPI Calculations ----------
    const totalOrders = filteredOrders.length;
    const totalSales = filteredOrders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

    // Low stock products
    const lowStockProducts = products.filter(p => {
      if (Array.isArray(p.colors) && p.colors.length > 0) {
        const totalStock = p.colors.reduce((sum, c) => sum + (c.stock ?? 0), 0);
        return totalStock <= 5;
      }
      return p.stock !== undefined && p.stock <= 5;
    });

    // ---------- Top Products ----------
    const productSalesMap = {};
    filteredOrders.forEach(o => {
      o.products?.forEach(p => {
        if (!p?.product?._id) return;
        const id = p.product._id;
        if (!productSalesMap[id]) productSalesMap[id] = { name: p.product.name, quantity: 0 };
        productSalesMap[id].quantity += p.quantity;
      });
    });
    const topProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // ---------- Status Distribution ----------
    const statusColors = {
      pending: "#f6c90e",
      processing: "#4dabf7",
      paid: "#40c057",
      order_confirmed: "#845ef7",
      packing: "#f08a5d",
      shipped: "#1e6091",
      out_for_delivery: "#ff6b6b",
      delivered: "#198754",
      cancelled: "#dc3545"
    };
    const statusDistribution = Object.entries(
      filteredOrders.reduce((acc, o) => {
        if (!o?.status) return acc;
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, value]) => ({ status, value }));

    // ---------- UI ----------
    return (
      <div style={{ padding: "1rem", fontFamily: "sans-serif", backgroundColor: "#1e1e1e", color: "#fff" }}>
        {/* Filters */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "6px", backgroundColor: "#2b2b2b", color: "#fff", border: "1px solid #555" }}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {[
            { title: "Total Orders", value: totalOrders },
            { title: "Total Sales", value: `₹${totalSales.toLocaleString()}` },
            { title: "Low Stock Products", value: lowStockProducts.length }
          ].map((kpi, i) => (
            <div key={i} style={{
              flex: "1 1 150px",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: "#2b2b2b",
              color: "#fff",
              boxShadow: "0 3px 10px rgba(0,0,0,0.3)"
            }}>
              <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>{kpi.title}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ flex: "1 1 400px", padding: "1rem", borderRadius: "10px", backgroundColor: "#2b2b2b", boxShadow: "0 3px 10px rgba(0,0,0,0.3)" }}>
            <h4 style={{ color: "#fff" }}>Top Products Sold</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="quantity" fill="#4dabf7" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 300px", padding: "1rem", borderRadius: "10px", backgroundColor: "#2b2b2b", boxShadow: "0 3px 10px rgba(0,0,0,0.3)" }}>
            <h4 style={{ color: "#fff" }}>Order Status Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="status"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={index} fill={statusColors[entry.status] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))} statusColors={statusColors} />

        {/* Low Stock Table */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: "10px",
            backgroundColor: "#2b2b2b",
            boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
          }}
        >
          <h4 style={{ color: "#fff" }}>Low Stock Products (≤5)</h4>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
            >
              <thead>
                <tr>
                  {["Product", "Stock", "Price"].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: "left",
                        padding: "0.6rem",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => {
                  const totalStock =
                    Array.isArray(p.colors) && p.colors.length > 0
                      ? p.colors.reduce((sum, c) => sum + (c.stock ?? 0), 0)
                      : p.stock ?? 0;

                  return (
                    <tr key={p._id}>
                      <td style={{ padding: "0.6rem" }}>{p.name}</td>
                      <td style={{ padding: "0.6rem" }}>
                        {Array.isArray(p.colors) && p.colors.length > 0
                          ? p.colors
                              .map(
                                (c) =>
                                  `${c.colorName ?? "No Name"}: ${c.stock ?? 0}`
                              )
                              .join(", ")
                          : totalStock}
                      </td>
                      <td style={{ padding: "0.6rem" }}>
                        ₹{p.price?.toLocaleString("en-IN") ?? 0}
                      </td>
                    </tr>
                  );
                })}
                {lowStockProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: "1rem", textAlign: "center" }}>
                      No low stock products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};
