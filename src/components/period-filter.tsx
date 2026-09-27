import { PERIODS, type PeriodId } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function PeriodFilter() {
  const period = useAppStore((s) => s.period);
  const customFrom = useAppStore((s) => s.customFrom);
  const customTo = useAppStore((s) => s.customTo);
  const setPeriod = useAppStore((s) => s.setPeriod);
  const setCustom = useAppStore((s) => s.setCustom);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-48 flex-1">
        <Label htmlFor="period">Período</Label>
        <Select value={period} onValueChange={(v) => setPeriod(v as PeriodId)}>
          <SelectTrigger id="period" className="mt-1.5" aria-label="Selecionar período">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {period === "custom" ? (
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div>
            <Label htmlFor="from">De</Label>
            <Input
              id="from"
              type="date"
              className="mt-1.5"
              value={customFrom}
              onChange={(e) => setCustom(e.target.value, customTo)}
            />
          </div>
          <div>
            <Label htmlFor="to">Até</Label>
            <Input
              id="to"
              type="date"
              className="mt-1.5"
              value={customTo}
              onChange={(e) => setCustom(customFrom, e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
