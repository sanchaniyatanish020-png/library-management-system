const Topbar = ({ title, children }) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shadow-sm">
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  )
}

export default Topbar