import { useState, useEffect } from "react";
import { 
  X, Plus, Edit2, Trash2, ShieldCheck, Mail, Lock, User, 
  Check, CheckSquare, Square, AlertCircle, LayoutDashboard, 
  UserPlus, Target, MessagesSquare, UserCircle, UserX, UserMinus, 
  Key, RefreshCw
} from "lucide-react";
import { apiRequest } from "../../../utils/api";

export interface StaffPermission {
  id: string;
  label: string;
  description: string;
  icon: any;
}

export const BOTTOM_BAR_FEATURES: StaffPermission[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    description: "Analytics, summary cards, fees & performance graph", 
    icon: LayoutDashboard 
  },
  { 
    id: "add-student", 
    label: "Add Student", 
    description: "Register new students and record fee payments", 
    icon: UserPlus 
  },
  { 
    id: "student-crm", 
    label: "Student Leads CRM", 
    description: "Manage leads, calling responses, followups & directory", 
    icon: Target 
  },
  { 
    id: "inquiry", 
    label: "Inquiries", 
    description: "View and manage student inquiries and contact requests", 
    icon: MessagesSquare 
  },
  { 
    id: "referred-by", 
    label: "Referred By", 
    description: "Manage referral partners and calculate referral earnings", 
    icon: UserCircle 
  },
  { 
    id: "deleted-referrers", 
    label: "Deleted Referrers", 
    description: "View and restore deleted referral partners", 
    icon: UserX 
  },
  { 
    id: "deleted-students", 
    label: "Deleted Students", 
    description: "View and restore soft-deleted student records", 
    icon: UserMinus 
  },
];

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "staff";
  permissions: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface StaffManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffUpdated?: () => void;
}

export default function StaffManagementModal({
  isOpen,
  onClose,
  onStaffUpdated,
}: StaffManagementModalProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form mode: "list" | "create" | "edit"
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Fetch staff list on open
  useEffect(() => {
    if (isOpen) {
      fetchStaffList();
      resetForm();
      setViewMode("list");
    }
  }, [isOpen]);

  const fetchStaffList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("/admin/staff");
      const data = await res.json();
      if (res.ok && data.success) {
        setStaffList(data.staff || []);
      } else {
        setError(data.message || "Failed to load staff list");
      }
    } catch (err: any) {
      setError(err?.message || "Network error loading staff list");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingStaffId(null);
    setName("");
    setEmail("");
    setPassword("");
    setSelectedPermissions([]);
    setIsActive(true);
    setError(null);
    setSuccess(null);
  };

  const openCreateForm = () => {
    resetForm();
    // Default: select student-crm as common starting point
    setSelectedPermissions(["student-crm"]);
    setViewMode("form");
  };

  const openEditForm = (staff: StaffMember) => {
    resetForm();
    setEditingStaffId(staff._id);
    setName(staff.name || "");
    setEmail(staff.email || "");
    setPassword(""); // Leave blank to preserve
    setSelectedPermissions(staff.permissions || []);
    setIsActive(staff.is_active !== false);
    setViewMode("form");
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissions(BOTTOM_BAR_FEATURES.map((f) => f.id));
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!editingStaffId && (!password || password.trim().length < 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (editingStaffId && password && password.trim().length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setError("Please grant access to at least one bottom bar feature.");
      return;
    }

    setSaving(true);
    try {
      if (editingStaffId) {
        // Update existing staff member
        const payload: any = {
          name: name.trim(),
          permissions: selectedPermissions,
          is_active: isActive,
        };
        if (password.trim()) {
          payload.password = password.trim();
        }

        const res = await apiRequest(`/admin/staff/${editingStaffId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess("Staff member updated successfully!");
          await fetchStaffList();
          setTimeout(() => {
            setViewMode("list");
            setSuccess(null);
          }, 800);
          if (onStaffUpdated) onStaffUpdated();
        } else {
          setError(data.message || "Failed to update staff member");
        }
      } else {
        // Create new staff member
        const payload = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          permissions: selectedPermissions,
        };

        const res = await apiRequest("/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess("Staff member created successfully!");
          await fetchStaffList();
          setTimeout(() => {
            setViewMode("list");
            setSuccess(null);
          }, 800);
          if (onStaffUpdated) onStaffUpdated();
        } else {
          setError(data.message || "Failed to create staff member");
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove access for "${staffName || "this staff member"}"? They will no longer be able to log in.`
      )
    ) {
      return;
    }

    setDeletingId(staffId);
    setError(null);
    try {
      const res = await apiRequest(`/admin/staff/${staffId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStaffList((prev) => prev.filter((s) => s._id !== staffId));
        if (onStaffUpdated) onStaffUpdated();
      } else {
        setError(data.message || "Failed to delete staff member");
      }
    } catch (err: any) {
      setError(err?.message || "Network error deleting staff");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-neutral-200/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-10 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-linear-to-r from-neutral-50 via-white to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Key size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
                  Staff Access Management
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 tracking-wide">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Create user accounts and assign granular permissions for features in the bottom navigation bar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* View Mode Switcher / Banner Alerts */}
        <div className="px-6 pt-4 pb-2 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => { resetForm(); setViewMode("list"); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              All Staff Accounts ({staffList.length})
            </button>
            <button
              type="button"
              onClick={openCreateForm}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "form" && !editingStaffId
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Plus size={14} />
              <span>Add New Staff</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchStaffList}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all cursor-pointer border border-neutral-200"
              title="Refresh staff list"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Notifications / Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 text-xs font-bold">Dismiss</button>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <Check size={16} className="shrink-0 text-emerald-600" />
            <span className="flex-1">{success}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {viewMode === "list" ? (
            /* =================== STAFF LIST VIEW =================== */
            <div className="space-y-4">
              {loading && staffList.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 text-sm font-medium">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-500" />
                  Loading staff accounts...
                </div>
              ) : staffList.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <User size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800 mb-1">No Staff Accounts Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                    Create your first staff account and decide which bottom dock features they are allowed to access.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Create Staff Member</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {staffList.map((staff) => {
                    const initials = (staff.name || staff.email || "S")
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={staff._id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          staff.is_active
                            ? "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs"
                            : "bg-neutral-50/70 border-neutral-200 opacity-75"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: User Info */}
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-neutral-900 text-sm truncate">
                                  {staff.name || "Staff Member"}
                                </span>
                                {staff.is_active ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                                <Mail size={12} className="shrink-0 text-neutral-400" />
                                <span className="truncate">{staff.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditForm(staff)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all cursor-pointer"
                              title="Edit Permissions & Details"
                            >
                              <Edit2 size={13} />
                              <span>Edit Access</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(staff._id, staff.name || staff.email)}
                              disabled={deletingId === staff._id}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 size={15} className={deletingId === staff._id ? "animate-spin" : ""} />
                            </button>
                          </div>
                        </div>

                        {/* Granted Permissions Badges */}
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                            Assigned Bottom Bar Features ({staff.permissions?.length || 0}):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {BOTTOM_BAR_FEATURES.map((feature) => {
                              const hasPerm = (staff.permissions || []).includes(feature.id);
                              if (!hasPerm) return null;
                              const Icon = feature.icon;
                              return (
                                <span
                                  key={feature.id}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"
                                >
                                  <Icon size={12} className="stroke-[2.2]" />
                                  <span>{feature.label}</span>
                                </span>
                              );
                            })}
                            {(!staff.permissions || staff.permissions.length === 0) && (
                              <span className="text-xs text-amber-600 italic font-medium">
                                No bottom bar features permitted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* =================== ADD / EDIT FORM =================== */
            <form id="staff-form" onSubmit={handleSaveStaff} className="space-y-6">
              <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-600" />
                  <span>{editingStaffId ? "Edit Staff Account" : "New Staff Account Credentials"}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                      Staff Member Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kajol Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                      />
                      <User size={15} className="absolute left-3 top-3 text-neutral-400" />
                    </div>
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={!!editingStaffId} // Email immutable once created
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. kajol@rizeworld.com"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                          editingStaffId ? "bg-neutral-100 cursor-not-allowed text-neutral-500" : "bg-white"
                        }`}
                      />
                      <Mail size={15} className="absolute left-3 top-3 text-neutral-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                      {editingStaffId ? "Reset Password (Optional)" : "Login Password"} <span className="text-red-500">{editingStaffId ? "" : "*"}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!editingStaffId}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={editingStaffId ? "Leave blank to keep current password" : "At least 6 characters"}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-mono"
                      />
                      <Lock size={15} className="absolute left-3 top-3 text-neutral-400" />
                    </div>
                    {editingStaffId && (
                      <p className="text-[10px] text-neutral-400 mt-1 italic">
                        Type a new password only if you want to overwrite their current password.
                      </p>
                    )}
                  </div>

                  {/* Account Status Toggle */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                      Account Status
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          isActive ? "bg-emerald-500" : "bg-neutral-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-xs font-bold text-neutral-700">
                        {isActive ? "Active (Can log in)" : "Deactivated (Blocked)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar Feature Access Selection */}
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-2">
                      <span>Bottom Bar Feature Permissions</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-700">
                        {selectedPermissions.length} / {BOTTOM_BAR_FEATURES.length} Selected
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Check each feature you want to show in this staff member's bottom navigation dock.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-all cursor-pointer"
                    >
                      <CheckSquare size={13} />
                      <span>Select All</span>
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPermissions}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-500 hover:bg-neutral-100 border border-neutral-200 transition-all cursor-pointer"
                    >
                      <Square size={13} />
                      <span>Deselect All</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BOTTOM_BAR_FEATURES.map((feature) => {
                    const isSelected = selectedPermissions.includes(feature.id);
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.id}
                        onClick={() => togglePermission(feature.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-600 shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            <Icon size={18} className="stroke-[2.2]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                                {feature.label}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-neutral-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check size={12} className="stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-1 leading-snug line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
          {viewMode === "list" ? (
            <>
              <p className="text-xs text-neutral-400 font-medium">
                Showing {staffList.length} staff member{staffList.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { resetForm(); setViewMode("list"); }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all cursor-pointer"
              >
                Back to Staff List
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { resetForm(); setViewMode("list"); }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-500 hover:text-neutral-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="staff-form"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving && <RefreshCw size={13} className="animate-spin" />}
                  <span>{editingStaffId ? "Save Changes" : "Create Staff Member"}</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

