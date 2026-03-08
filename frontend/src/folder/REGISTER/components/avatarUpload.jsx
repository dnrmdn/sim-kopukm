import { useState, useRef } from "react";

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ACCEPTED_EXTENSIONS = ".png, .jpg, .jpeg, .webp";

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const UserPlaceholder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.65 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * AvatarUpload
 * Props:
 *  - value: { file: File, url: string } | null
 *  - onChange: (val: { file: File, url: string } | null) => void
 *  - disabled: boolean
 */
export default function AvatarUpload({ value, onChange, disabled = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const validate = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Format tidak didukung. Gunakan PNG, JPG, atau WEBP.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    setError("");
    if (!validate(file)) return;
    const url = URL.createObjectURL(file);
    onChange({ file, url });
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setError("");
    onChange(null);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-slate-600 font-medium">
        Foto Profil
        <span className="text-slate-400 text-xs ml-1">(opsional)</span>
      </label>

      <div className="flex items-center gap-5">
        {/* Avatar Preview Circle */}
        <div
          className={`relative shrink-0 w-20 h-20 rounded-full border-2 overflow-hidden transition-all duration-200
            ${dragging ? "border-sky-400 bg-sky-50 scale-105" : value ? "border-sky-300 bg-slate-100" : "border-dashed border-slate-300 bg-slate-50"}
            ${!disabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
          `}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          title={disabled ? "Verifikasi NIP terlebih dahulu" : "Klik atau seret foto ke sini"}
        >
          {value ? (
            <>
              <img
                src={value.url}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              {!disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <EditIcon />
                  <span className="text-white text-xs ml-1 font-medium">Ganti</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-1">
              {dragging ? (
                <UploadIcon />
              ) : (
                <UserPlaceholder />
              )}
            </div>
          )}
        </div>

        {/* Right side: instructions + actions */}
        <div className="flex flex-col gap-2 flex-1">
          {value ? (
            <>
              {/* File info */}
              <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium truncate">
                  ✓ {value.file.name}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {(value.file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => !disabled && inputRef.current?.click()}
                  disabled={disabled}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <EditIcon />
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon />
                  Hapus
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Upload prompt */}
              <button
                type="button"
                onClick={() => !disabled && inputRef.current?.click()}
                disabled={disabled}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadIcon />
                <span>Klik atau seret foto ke sini</span>
              </button>
              <p className="text-xs text-slate-400 leading-relaxed">
                PNG, JPG, WEBP · Maks. {MAX_SIZE_MB}MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-1 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">✗ {error}</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleInputChange}
        className="hidden"
        aria-label="upload-avatar"
      />
    </div>
  );
}