import React from "react";

/**
 * Reusable footer component with automatic current year and optional extra content.
 *
 * Usage:
 * <Footer>
 *   <div className="flex gap-6 mt-4 sm:mt-0">
 *     <span>Total Dokumen: {files.length}</span>
 *   </div>
 * </Footer>
 */
export default function Footer({ children }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
        <p>© {year} Management System v2.0</p>
        {children && <div className="flex gap-6 mt-4 sm:mt-0">{children}</div>}
      </div>
    </footer>
  );
}
