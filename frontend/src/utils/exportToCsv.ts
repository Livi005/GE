export const exportToCsv = (filename: string, rows: any[]) => {
  if (!rows || rows.length === 0) return;
  
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent = 
    keys.join(separator) + 
    '\n' + 
    rows.map(row => keys.map(k => `"${row[k] || ''}"`).join(separator)).join('\n');
    
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};