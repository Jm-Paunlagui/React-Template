/**
 * @fileoverview System tab — heap usage, event-loop lag, handles, and GC stats.
 */

import Card from "../../../../components/ui/Card";
import Progress from "../../../../components/ui/Progress";
import Skeleton from "../../../../components/ui/Skeleton";
import {
  ANIMATE_ENTER_UP,
  staggerDelay,
  ANIM_DELAY_0,
} from "../../../../assets/styles/pre-set-styles";
import {
  PILL_BASE,
  getCpuStyle,
  getHandlesStyle,
  getHeapPctStyle,
  getLagStyle,
  textCls,
} from "../metricsStyles";

/**
 * @param {{ hook: import('../metrics.hook').MetricsHook }} props
 */
export default function SystemTab({ hook }) {
  const { snapshot, snapshotLoading, snapshotError, formatBytes } = hook;

  if (snapshotLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  if (snapshotError || !snapshot) {
    return (
      <div className="mt-6 p-4 rounded-xl bg-danger-400/10 border border-danger-400/30 text-danger-400 text-sm">
        System metrics unavailable. Ensure you have the required access level.
      </div>
    );
  }

  const { system } = snapshot;
  const heapUsed  = system.memory.heapUsed;
  const heapTotal = system.memory.heapTotal;
  const heapPct   = heapTotal > 0 ? Math.round((heapUsed / heapTotal) * 100) : 0;

  // Progress variant is coarser — only three states
  const heapProgressVariant = heapPct >= 80 ? 'danger' : heapPct >= 60 ? 'warning' : 'success';

  const lagStyle     = getLagStyle(system.eventLoopLag);
  const lagLabel     = system.eventLoopLag >= 100 ? 'Elevated' : system.eventLoopLag >= 10 ? 'Moderate' : 'Normal';

  const statCards = [
    {
      title: 'Heap Memory',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-grey-600 dark:text-grey-400">Used / Total</span>
            <span className={`font-semibold ${textCls(getHeapPctStyle(heapPct))}`}>
              {formatBytes(heapUsed)} / {formatBytes(heapTotal)}
            </span>
          </div>
          <Progress
            value={heapPct}
            max={100}
            variant={heapProgressVariant}
            size="md"
            label={`${heapPct}%`}
          />
          <p className="text-xs text-grey-400 dark:text-grey-500">
            RSS: {formatBytes(system.memory.rss)} &bull; External: {formatBytes(system.memory.external)}
          </p>
        </div>
      ),
    },
    {
      title: 'Event-Loop Lag',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold ${textCls(lagStyle)}`}>
              {system.eventLoopLag}ms
            </span>
            <span className={`${PILL_BASE} ${lagStyle}`}>
              {lagLabel}
            </span>
          </div>
          <p className="text-xs text-grey-400 dark:text-grey-500">
            Measured via setImmediate probe (EMA smoothed). Elevated lag (&gt;100ms)
            indicates blocking synchronous work on the main thread.
          </p>
        </div>
      ),
    },
    {
      title: 'Active Handles & Requests',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">
              Handles
            </p>
            <p className={`text-2xl font-bold mt-1 ${textCls(getHandlesStyle(system.handles))}`}>
              {system.handles >= 0 ? system.handles : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">
              Requests
            </p>
            <p className={`text-2xl font-bold mt-1 ${textCls(getHandlesStyle(system.requests))}`}>
              {system.requests >= 0 ? system.requests : 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'CPU Usage (last 10s)',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">
              User
            </p>
            <p className={`text-2xl font-bold mt-1 ${textCls(getCpuStyle(system.cpu.user))}`}>
              {system.cpu.user}ms
            </p>
          </div>
          <div>
            <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">
              System
            </p>
            <p className={`text-2xl font-bold mt-1 ${textCls(getCpuStyle(system.cpu.system))}`}>
              {system.cpu.system}ms
            </p>
          </div>
          <p className="col-span-2 text-xs text-grey-400 dark:text-grey-500">
            Delta since previous 10s polling interval.
          </p>
        </div>
      ),
    },
  ];

  const gcCollections = system.gc?.collections ?? 0;
  const gcPauseMs     = system.gc?.pauseMs     ?? 0;

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCards.map((card, i) => (
          <Card
            key={card.title}
            className={`h-full bg-white dark:bg-[#1a1030] border border-grey-100 dark:border-white/10 rounded-2xl ${ANIMATE_ENTER_UP} ${staggerDelay(i)}`}
          >
            <h3 className="text-sm font-semibold text-grey-600 dark:text-grey-400 mb-3">
              {card.title}
            </h3>
            {card.content}
          </Card>
        ))}
      </div>

      {/* GC stats — supplementary row */}
      {gcCollections > 0 && (
        <Card
          className={`h-full bg-white dark:bg-[#1a1030] border border-grey-100 dark:border-white/10 rounded-2xl ${ANIMATE_ENTER_UP} ${staggerDelay(4)}`}
        >
          <h3 className="text-sm font-semibold text-grey-600 dark:text-grey-400 mb-3">
            Garbage Collection (perf_hooks)
          </h3>
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">Collections</p>
              <p className="text-2xl font-bold text-grey-800 dark:text-white mt-1">{gcCollections}</p>
            </div>
            <div>
              <p className="text-xs text-grey-500 dark:text-grey-400 uppercase tracking-wide">Total Pause</p>
              <p className="text-2xl font-bold text-grey-800 dark:text-white mt-1">{gcPauseMs}ms</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
