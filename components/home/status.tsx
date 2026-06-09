const STATUS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  online: {
    text: "text-active-status",
    bg: "bg-active-status/10",
    border: "border border-active-status",
  },
  acquired: {
    text: "text-[#4E326C]",
    bg: "bg-[#4E326C]/10",
    border: "border border-[#4E326C]",
  },
  "in progress": {
    text: "text-[#6C5A32]",
    bg: "bg-[#6C5A32]/10",
    border: "border border-[#6C5A32]",
  },

  offline: {
    text: "text-[#D1C5AD]",
    bg: "bg-[#D1C5AD]/10",
    border: "border-[#D1C5AD]",
  },
};

export default function Status({ status }: { status?: string }) {
  const colors = status ? STATUS_COLORS[status] : null;

  return (
    <div
      className={`text-[8px] ${colors?.text} ${colors?.bg} ${colors?.border} rounded-sm font-semibold px-1 uppercase py-0.5 leading-none whitespace-nowrap`}
    >
      {status}
    </div>
  );
}
