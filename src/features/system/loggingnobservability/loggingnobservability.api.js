import httpClient from "../../../middleware/HttpClient";

export const auditLogApi = {
  list:         (params)           => httpClient.get("audit-logs", { params }).then(r => r.data),
  stats:        (params)           => httpClient.get("audit-logs/stats", { params }).then(r => r.data),
  requestLogs:  (requestId, date)  => httpClient.get(`audit-logs/${requestId}/logs`, { params: { date } }).then(r => r.data),
  traceExcel:   (requestId, date)  => httpClient.get(`audit-logs/${requestId}/export/trace`, { params: { date }, responseType: "arraybuffer" }).then(r => r.data),
  exportExcel:  (params)           => httpClient.get("audit-logs/export/excel", { params, responseType: "arraybuffer" }).then(r => r.data),
  exportLogs:   (params)           => httpClient.get("audit-logs/export/logs",  { params, responseType: "arraybuffer" }).then(r => r.data),
  deleteRange:  (params)           => httpClient.delete("audit-logs", { params }).then(r => r.data),
};
