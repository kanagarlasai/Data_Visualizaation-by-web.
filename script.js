document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
document.getElementById("chartType").addEventListener("change", renderChart);

let parsedData = [];

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        parsedData = results.data;
        displayDataTable(parsedData);
        renderChart();
      },
    });
  }
}

function displayDataTable(data) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  if (data.length === 0) return;

  const headers = Object.keys(data[0]);

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const rowsToDisplay = data.slice(0, 20); // Limit to 21 rows
  rowsToDisplay.forEach((row) => {
    const tr = document.createElement("tr");
    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = row[header];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function renderChart() {
  const chartType = document.getElementById("chartType").value;
  const ctx = document.getElementById("chartCanvas").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy();
  }

  const labels = [...new Set(parsedData.map((item) => item.Year))];
  const products = [...new Set(parsedData.map((item) => item.Languages))];

  const datasets = products.map((Languages) => {
    return {
      label: Languages,
      data: labels.map((Year) => {
        const item = parsedData.find(
          (d) => d.Year === Year && d.Languages === Languages
        );
        return item ? item.Demand : 0;
      }),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    };
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  window.myChart = new Chart(ctx, {
    type: chartType,
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
