export default function StatusBar({ dark = false }) {
  return (
    <div className={`status-bar ${dark ? "text-white" : "text-gray-900"}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 10.5C9 10.5 9.8 10.2 10.4 9.6L8 7L5.6 9.6C6.2 10.2 7 10.5 8 10.5Z"
            fill="currentColor"
          />
          <path
            d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.7 5.9C12.2 4.4 10.2 3.5 8 3.5C5.8 3.5 3.8 4.4 2.3 5.9L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z"
            fill="currentColor"
          />
          <path
            d="M8 0.5C11.1 0.5 13.9 1.7 16 3.7L14.6 5.1C12.8 3.4 10.5 2.5 8 2.5C5.5 2.5 3.2 3.4 1.4 5.1L0 3.7C2.1 1.7 4.9 0.5 8 0.5Z"
            fill="currentColor"
          />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <rect x="21.5" y="4" width="1.5" height="4" rx="0.7" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
