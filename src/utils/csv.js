// Build a CSV string from rows (array of objects) and explicit headers order.
function toCsv(rows, headers) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return headers.join(",") + "\n";
  }

  const escape = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const lines = [];
  lines.push(headers.join(","));
  for (const row of rows) {
    const line = headers.map((h) => escape(row[h])).join(",");
    lines.push(line);
  }
  return lines.join("\n") + "\n";
}

module.exports = { toCsv };
