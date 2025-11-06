document.addEventListener('DOMContentLoaded', function() {
    const datos = {
        "favoritos": [
            {"tipo": "Favoritos", "cantidad": 6}, 
            {"tipo": "No Favoritos", "cantidad": 4} 
        ]
    };

    const tipos = datos.favoritos.map(item => item.tipo);
    const cantidades = datos.favoritos.map(item => item.cantidad);
    
    const dataConfig = {
        labels: tipos,
        datasets: [{
            label: 'Contactos Favoritos vs No Favoritos',
            data: cantidades,
            backgroundColor: [
                'gold',
                '#294973'
            ]
        }]
    };

    const config = {
        type: 'doughnut',
        data: dataConfig,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#294973' 
                    }
                },
                title: {
                    display: true,
                    text: 'Contactos Favoritos vs No Favoritos',
                    color: '#294973', 
                    font: {
                        color: 'white' 
                    }
                }
            }
        },
    };

    var graficoContactos = new Chart(
        document.getElementById('graficoContactos'),
        config
    );
});
