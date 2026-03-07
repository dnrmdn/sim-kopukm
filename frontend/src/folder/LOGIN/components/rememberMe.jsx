
export default function RememberMeCheckbox({
  checked = false,
  onChange,
  label = 'Ingat saya'
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
      />
      <span className="text-sm text-slate-600 font-medium">{label}</span>
    </label>
  );
}