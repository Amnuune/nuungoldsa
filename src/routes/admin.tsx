import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminCheckSession,
  adminLogin,
  adminLogout,
  adminListOrders,
  adminListProducts,
  adminMarkPaid,
  adminToggleProduct,
} from "@/lib/admin.functions";
import { LogOut, Check } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Nuun Bots" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const checkSession = useServerFn(adminCheckSession);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => checkSession(),
  });

  if (isLoading) return <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">Loading…</div>;
  return data?.authenticated ? <Dashboard onLogout={() => refetch()} /> : <LoginForm onSuccess={() => refetch()} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(adminLogin);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await login({ data: { password: pwd } });
      if (!res.ok) setError(res.error);
      else onSuccess();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-24">
      <h1 className="font-display text-3xl text-center">Admin <span className="text-gradient-gold">login</span></h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-card/60 p-6">
        <input
          type="password"
          required
          autoFocus
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-md border border-input bg-input/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <div className="text-sm text-destructive">{error}</div>}
        <button disabled={busy} className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-medium text-primary-foreground shadow-gold disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const qc = useQueryClient();
  const listOrders = useServerFn(adminListOrders);
  const listProducts = useServerFn(adminListProducts);
  const markPaid = useServerFn(adminMarkPaid);
  const toggleProduct = useServerFn(adminToggleProduct);
  const logout = useServerFn(adminLogout);

  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: () => listOrders() });
  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => listProducts() });

  const markMut = useMutation({
    mutationFn: (orderId: string) => markPaid({ data: { orderId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
  const toggleMut = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => toggleProduct({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Admin <span className="text-gradient-gold">dashboard</span></h1>
        <button
          onClick={async () => { await logout(); onLogout(); }}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-card"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <h2 className="mt-10 font-display text-xl mb-4">Recent orders</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.data && "orders" in orders.data && orders.data.orders.length > 0 ? (
              orders.data.orders.map((o: any) => (
                <tr key={o.id} className="border-t border-border/60">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">{o.products?.name ?? "—"}</td>
                  <td className="px-4 py-3">${Number(o.amount).toFixed(2)} {o.currency}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      o.status === "paid" ? "bg-success/20 text-success" :
                      o.status === "pending" ? "bg-muted text-muted-foreground" :
                      "bg-destructive/20 text-destructive"
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.status === "pending" && (
                      <button
                        onClick={() => markMut.mutate(o.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-gold px-3 py-1.5 text-xs text-primary hover:bg-gradient-gold hover:text-primary-foreground"
                      >
                        <Check size={12} /> Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-xl mb-4">Products</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.data && "products" in products.data && products.data.products.map((p: any) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                <td className="px-4 py-3">${Number(p.price_usd).toFixed(2)}</td>
                <td className="px-4 py-3">{p.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleMut.mutate({ id: p.id, active: !p.active })}
                    className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-card"
                  >
                    {p.active ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Tip: edit product details (descriptions, prices, delivery URLs) directly from the Cloud database tab.
      </p>
    </section>
  );
}
