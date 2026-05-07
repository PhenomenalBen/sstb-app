"use client"

import { useState } from "react"

type Transaction = {
  id: number
  person_type: string
  direction: string
  amount: any
  description: string
  payment_date: Date
  payment_method: string
  receipt_id: string | null
  notes: string | null
  student: { id: number; full_name: string } | null
  volunteer: { id: number; full_name: string } | null
}

type Balance = {
  id: number
  person_type: string
  total_expected: any
  total_paid: any
  balance_due: any
  student: { id: number; full_name: string } | null
  volunteer: { id: number; full_name: string } | null
}

type Person = { id: number; full_name: string }

const emptyTx = {
  person_type: "student",
  person_id: "",
  direction: "in",
  amount: "",
  description: "",
  payment_method: "cash",
  receipt_id: "",
  notes: "",
}

export default function FinanceClient({
  transactions,
  balances,
  students,
  volunteers,
}: {
  transactions: Transaction[]
  balances: Balance[]
  students: Person[]
  volunteers: Person[]
}) {
  const [tab, setTab] = useState<"transactions" | "balances">("transactions")
  const [txList, setTxList] = useState(transactions)
  const [balanceList, setBalanceList] = useState(balances)
  const [showAddTx, setShowAddTx] = useState(false)
  const [txForm, setTxForm] = useState(emptyTx)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Summary stats
  const totalIn = txList
    .filter((t) => t.direction === "in")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalOut = txList
    .filter((t) => t.direction === "out")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalDue = balanceList.reduce(
    (sum, b) => sum + Number(b.balance_due), 0
  )

  const handleAddTx = async () => {
    setError("")
    if (!txForm.person_id || !txForm.amount || !txForm.description) {
      setError("Person, amount and description are required.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...txForm,
          person_id: parseInt(txForm.person_id),
          amount: parseFloat(txForm.amount),
        }),
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setTxList((prev) => [data.transaction, ...prev])
      setShowAddTx(false)
      setTxForm(emptyTx)
    } catch {
      setError("Something went wrong.")
    }
    setLoading(false)
  }

  const personName = (tx: Transaction) =>
    tx.student?.full_name || tx.volunteer?.full_name || "Unknown"

  const people =
    txForm.person_type === "student" ? students : volunteers

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-500 text-sm mt-1">
            Transactions and balance overview.
          </p>
        </div>
        {tab === "transactions" && (
          <button
            onClick={() => setShowAddTx(true)}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:-translate-y-0.5 transition-all"
            style={{ backgroundColor: "#dc2626" }}
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Received", value: `$${totalIn.toFixed(2)}`, icon: "💚", color: "#16a34a", bg: "#dcfce7" },
          { label: "Total Spent", value: `$${totalOut.toFixed(2)}`, icon: "🔴", color: "#dc2626", bg: "#fee2e2" },
          { label: "Total Balance Due", value: `$${totalDue.toFixed(2)}`, icon: "⏳", color: "#92400e", bg: "#fef3c7" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border-2 border-gray-100 p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: s.bg }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["transactions", "balances"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all"
            style={
              tab === t
                ? { backgroundColor: "#dc2626", color: "#fff" }
                : { backgroundColor: "#f3f4f6", color: "#374151" }
            }
          >
            {t === "transactions"
              ? `💳 Transactions (${txList.length})`
              : `💰 Balances (${balanceList.length})`}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {tab === "transactions" && (
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          {txList.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No transactions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#1a1a2e" }}>
                    {["Person", "Direction", "Amount", "Description", "Method", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {txList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-800">
                          {personName(tx)}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {tx.person_type}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={
                            tx.direction === "in"
                              ? { backgroundColor: "#dcfce7", color: "#166534" }
                              : { backgroundColor: "#fee2e2", color: "#991b1b" }
                          }
                        >
                          {tx.direction === "in" ? "↑ In" : "↓ Out"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold"
                        style={{ color: tx.direction === "in" ? "#16a34a" : "#dc2626" }}
                      >
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-gray-600 max-w-48 truncate">
                        {tx.description}
                      </td>
                      <td className="px-5 py-3 text-gray-500 capitalize">
                        {tx.payment_method}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(tx.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Balances Table */}
      {tab === "balances" && (
        <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
          {balanceList.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No balances yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a1a2e" }}>
                  {["Person", "Type", "Expected", "Paid", "Balance Due", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {balanceList.map((b) => {
                  const name = b.student?.full_name || b.volunteer?.full_name || "Unknown"
                  const due = Number(b.balance_due)
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        {name}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                          style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                        >
                          {b.person_type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium">
                        ${Number(b.total_expected).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 font-medium" style={{ color: "#16a34a" }}>
                        ${Number(b.total_paid).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 font-bold"
                        style={{ color: due > 0 ? "#dc2626" : "#16a34a" }}
                      >
                        ${due.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={
                            due === 0
                              ? { backgroundColor: "#dcfce7", color: "#166534" }
                              : { backgroundColor: "#fef3c7", color: "#92400e" }
                          }
                        >
                          {due === 0 ? "✓ Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTx && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-screen">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Add Transaction
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Record a payment received or expense paid.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Person Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Person Type
                </label>
                <div className="flex gap-3">
                  {["student", "volunteer"].map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setTxForm({ ...txForm, person_type: pt, person_id: "" })}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 capitalize transition-all"
                      style={
                        txForm.person_type === pt
                          ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Person */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Select Person *
                </label>
                <select
                  value={txForm.person_id}
                  onChange={(e) => setTxForm({ ...txForm, person_id: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white"
                >
                  <option value="">Select a {txForm.person_type}</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Direction
                </label>
                <div className="flex gap-3">
                  {[
                    { val: "in", label: "↑ Money In" },
                    { val: "out", label: "↓ Money Out" },
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => setTxForm({ ...txForm, direction: d.val })}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                      style={
                        txForm.direction === d.val
                          ? {
                              backgroundColor: d.val === "in" ? "#16a34a" : "#dc2626",
                              borderColor: d.val === "in" ? "#16a34a" : "#dc2626",
                              color: "#fff",
                            }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Program fee payment"
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Payment Method
                </label>
                <div className="flex flex-wrap gap-2">
                  {["cash", "bank transfer", "card"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTxForm({ ...txForm, payment_method: m })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2 capitalize transition-all"
                      style={
                        txForm.payment_method === m
                          ? { backgroundColor: "#1a1a2e", borderColor: "#1a1a2e", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receipt + Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Receipt ID
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={txForm.receipt_id}
                    onChange={(e) => setTxForm({ ...txForm, receipt_id: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={txForm.notes}
                    onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddTx(false); setError("") }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTx}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {loading ? "Saving..." : "Add Transaction"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}