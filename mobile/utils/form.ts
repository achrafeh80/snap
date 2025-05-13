export function createFormData(data: Record<string, any>): FormData {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined || v === null) continue;
      if (v instanceof File || (v as any).uri) fd.append(k, v as any);
      else if (typeof v === 'object') fd.append(k, JSON.stringify(v));
      else fd.append(k, v as any);
    }
    return fd;
  }