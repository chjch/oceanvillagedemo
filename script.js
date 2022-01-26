mapboxgl.accessToken = 'pk.eyJ1IjoiY2hqY2giLCJhIjoiY2t2NzdyZnJtOWgwZjJ3cTZ2MXo2cXRteCJ9.Ydav8LPbBg9UaPamgXiHJA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [-80.2840917, 27.4400739],
    pitch: 50,
    bearing: 50,
    zoom: 17,
    antialias:true
});

map.on('load', function () {
    
    globalThis.scenarios_dict = {
        'slr_1ft': '1 foot Scenario',
        'slr_2ft': '2 feet Scenario',
        'slr_3ft': '3 feet Scenario',
        'slr_4ft': '4 feet Scenario',
        "slr_5ft": '5 feet Scenario'
    };
    
    function noaa_wtms_url(lyr_name) {
        const baseurl = 'https://www.coast.noaa.gov:443/arcgis/rest/services/dc_slr';
        const infix = 'MapServer/WMTS/tile/1.0.0/dc_slr_';
        const suffix = 'default/GoogleMapsCompatible/{z}/{y}/{x}';
        return `${baseurl}/${lyr_name}/${infix}${lyr_name}/${suffix}`;         
    };

    for (var key in scenarios_dict) {
        map.addSource(key, {
            'type': 'raster',
            'tiles': [
                noaa_wtms_url(key)
            ],
            'tileSize': 256
        });
        const visibility = key == 'slr_3ft' ? 'visible' : 'none';
        map.addLayer({
            'id': key,
            'type': 'raster',
            'source': key,
            'paint': {
                'raster-opacity': 0.7
            },
            'layout': {'visibility': visibility},
        });
    };

    map.addSource('ov-bldgs', {
        type: 'geojson',
        data: './data/building/ov_bldg.geojson'
    });
    
    map.addLayer(
        {
            'id': 'bldgs-extrusion',
            'source': 'ov-bldgs',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#fff',
                                    
                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': 
                    ["*", ["get", "NumStory"], 5],
            
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 0.8
            }
        },
    );
});

// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {
            
    // Enumerate ids of the layers.
    const toggleableLayerIds = Object.keys(scenarios_dict);

    // If these five layers were not added to the map, abort
    for (const id of toggleableLayerIds) {
        if (!map.getLayer(id)) {
            return;
        }
    }
    
    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }
    
        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = scenarios_dict[id];
        link.className = '';
        
        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.id;
            e.preventDefault();
            e.stopPropagation();
            
            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );
            
            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            };
            for (const id of toggleableLayerIds) {
                if (id !== clickedLayer) {
                    map.setLayoutProperty(id, 'visibility', 'none');
                    document.getElementById(id).className = ''
                }
            }
        };
        
        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});