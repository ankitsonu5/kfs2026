"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Plus,
  X,
  ChevronRight,
  Filter,
  Search,
  ArrowLeft,
  Minus,
} from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/redesign/Footer";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category");
  const flagFilter = searchParams.get("flag");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [miniCart, setMiniCart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };
    fetchData();

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          const guestCart = JSON.parse(
            localStorage.getItem("guestCart") || '{"items":[]}',
          );
          const qtyMap = {};
          guestCart.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
          });
          setCartItems(qtyMap);
          return;
        }
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cart`,
          {
            headers: { Authorization: token },
          },
        );
        if (res.data && res.data.items) {
          const qtyMap = {};
          res.data.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
          });
          setCartItems(qtyMap);
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, []);

  const getFilteredProducts = () => {
    let filtered = products;

    if (categoryFilter) {
      const category = categories.find(
        (c) => c.name.toLowerCase() === categoryFilter.toLowerCase(),
      );
      if (category) {
        filtered = filtered.filter((p) => p.category.includes(category._id));
      } else {
        return [];
      }
    }

    if (flagFilter) {
      filtered = filtered.filter((p) => p[flagFilter] === true);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryFilter) return categoryFilter;
    if (flagFilter) {
      const titles = {
        isDealsOfDay: "Deals of the Day",
        isTopSellingProducts: "Top Selling Products",
        isRice: "Rice & Grains",
        isAttaAndFlour: "Atta & Flour",
        isDryFruites: "Dry Fruits",
        isDalAndPulses: "Dal & Pulses",
        isMasala: "Masala",
        isNamkeenAndSnacks: "Snacks & Namkeen",
      };
      return titles[flagFilter] || "All Products";
    }
    return "All Products";
  };

  const openMiniCart = (product) => {
    setMiniCart({
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "",
      },
      qty: 1,
    });
  };

  const confirmMiniCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Add to Cart logic
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === miniCart.product._id,
        );
        if (index > -1) {
          guestCart.items[index].quantity += miniCart.qty;
        } else {
          guestCart.items.push({
            productId: miniCart.product._id,
            title: miniCart.product.title,
            price: miniCart.product.price,
            image: miniCart.product.image,
            quantity: miniCart.qty,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems((prev) => ({
          ...prev,
          [miniCart.product._id]:
            (prev[miniCart.product._id] || 0) + miniCart.qty,
        }));
        setMiniCart(null);
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
        { productId: miniCart.product._id, quantity: miniCart.qty },
        { headers: { Authorization: token } },
      );
      setCartItems((prev) => ({
        ...prev,
        [miniCart.product._id]:
          (prev[miniCart.product._id] || 0) + miniCart.qty,
      }));
      setMiniCart(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartCount={Object.values(cartItems).reduce((a, b) => a + b, 0)} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span
            className="hover:text-green-600 cursor-pointer"
            onClick={() => router.push("/")}>
            Home
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-green-600">{getPageTitle()}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters (Placeholder) */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-green-600" />
                Categories
              </h3>
              <ul className="space-y-2">
                <li
                  className={`text-sm cursor-pointer hover:text-green-600 transition-colors ${!categoryFilter && !flagFilter ? "text-green-600 font-bold" : "text-gray-600"}`}
                  onClick={() => router.push("/shop")}>
                  All Categories
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className={`text-sm cursor-pointer hover:text-green-600 transition-colors ${categoryFilter === cat.name ? "text-green-600 font-bold" : "text-gray-600"}`}
                    onClick={() => router.push(`/shop?category=${cat.name}`)}>
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {getPageTitle()}
              </h1>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} items found
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group relative">
                    <div
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="h-52 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden cursor-pointer">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:8080/uploads/${product.images[0]}`}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    <h3
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="font-semibold text-gray-800 mb-1 hover:text-green-600 cursor-pointer truncate">
                      {product.title}
                    </h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-lg text-gray-900">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => openMiniCart(product)}
                        className={`p-2 rounded-lg transition-colors ${
                          cartItems[product._id]
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                        }`}>
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  No products found for this filter.
                </p>
                <button
                  onClick={() => router.push("/shop")}
                  className="mt-4 text-green-600 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mini Cart Popup */}
      {miniCart && (
        <>
          <div
            onClick={() => setMiniCart(null)}
            className="fixed inset-0 bg-black/30 z-50"
          />
          <div className="fixed top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="font-bold text-sm">Add to Cart</span>
              </div>
              <button
                onClick={() => setMiniCart(null)}
                className="text-white hover:text-green-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  {miniCart.product.image ? (
                    <img
                      src={`http://localhost:8080/uploads/${miniCart.product.image}`}
                      alt={miniCart.product.title}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">
                    {miniCart.product.title}
                  </h4>
                  <p className="text-green-600 font-bold">
                    ₹{miniCart.product.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setMiniCart((p) => ({
                        ...p,
                        qty: Math.max(1, p.qty - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg text-gray-800 w-8 text-center">
                    {miniCart.qty}
                  </span>
                  <button
                    onClick={() =>
                      setMiniCart((p) => ({ ...p, qty: p.qty + 1 }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-bold text-lg text-gray-800">
                  ₹{miniCart.product.price * miniCart.qty}
                </span>
              </div>
              <button
                onClick={confirmMiniCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-200">
                Confirm & Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
