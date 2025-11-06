document.addEventListener('DOMContentLoaded', function () {
    // === Datos ===
    var datos = {
      "Murcia": 1,
      "Oviedo": 3,
      "Avilés": 2,
      "Gijón": 3,
      "Luarca": 1,
      "Madrid": 1
    };
  
    var ciudades = Object.keys(datos);
    var cantidades = Object.values(datos);
  
    // === Utilidades de color  ===
    function getVar(name, fallback) {
      try {
        var css = getComputedStyle(document.documentElement);
        var v = css.getPropertyValue(name);
        v = v ? v.trim() : "";
        return v || fallback;  
      } catch (e) {
        return fallback;
      }
    }
  
    function hexToRgba(hex, a) {
      if (!hex) return 'rgba(0,0,0,' + (a == null ? 1 : a) + ')';
      hex = hex.replace('#', '').trim();
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      var r = parseInt(hex.slice(0, 2), 16);
      var g = parseInt(hex.slice(2, 4), 16);
      var b = parseInt(hex.slice(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return 'rgba(0,0,0,' + (a == null ? 1 : a) + ')';
      }
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (a == null ? 1 : a) + ')';
    }
  
    // === Colores ===
    var C_ACCENT  = getVar('--accent',          '#C58B67');
    var C_BRAND   = getVar('--brand-contrast',  '#A8784D');
    var C_BORDER  = getVar('--border',          '#887668');
    var C_INK     = getVar('--ink',             '#2B2A24');
    var C_INK_MUT = getVar('--ink-muted',       '#6E655C');
  
    // Alterna acentos para las barras
    var base = [C_ACCENT, C_BRAND];
    var bgBars = ciudades.map(function (_, i) {
      return hexToRgba(base[i % base.length], 0.35);
    });
    var borderBars = ciudades.map(function (_, i) {
      return base[i % base.length];
    });
  
    var dataConfig = {
      labels: ciudades,
      datasets: [{
        label: 'Cantidad de Contactos por Ciudad',
        data: cantidades,
        backgroundColor: bgBars,
        borderColor: borderBars,
        borderWidth: 1.5,
        borderRadius: 8,
        maxBarThickness: 48
      }]
    };
  
    var config = {
      type: 'bar',
      data: dataConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: C_INK_MUT }
          },
          y: {
            beginAtZero: true,
            grid: { color: hexToRgba(C_BORDER, 0.35) },
            ticks: { color: C_INK_MUT, precision: 0 }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: C_INK,
              font: { family: 'Lato, sans-serif', weight: '700' }
            }
          },
          title: {
            display: true,
            text: 'Cantidad de Contactos por Ciudad',
            color: C_INK,
            font: { family: 'Lato, sans-serif', weight: '800', size: 16 }
          },
          tooltip: {
            backgroundColor: hexToRgba(C_INK, 0.92),
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: hexToRgba(C_BORDER, 0.6),
            borderWidth: 1
          }
        }
      }
    };
  
    
    var canvas = document.getElementById('graficoCiudades');
    if (!canvas || typeof Chart === 'undefined') {
      console.error('No se encontró el canvas #graficoCiudades o Chart.js no está cargado.');
      return;
    }
  
    new Chart(canvas, config);
  });
  