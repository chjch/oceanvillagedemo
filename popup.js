export function popup(map, layer) {

    // When a click event occurs on a feature in the states layer,
    // open a popup at the location of the click, with description
    // HTML from the click event's properties.
    map.on('click', layer, (e) => {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
            `<table> 
                <tr>
                    <td><strong>Parcel ID</strong></td>
                    <td>${e.features[0].properties.CamaPID}</td>
                </tr>
                <tr>
                    <td><strong>Market Value</strong></td>
                    <td>${e.features[0].properties.marketval.toLocaleString()}</td>
                </tr>
                <tr>
                    <td><strong>Building Type</strong></td>
                    <td>${e.features[0].properties.bldg_cat}</td>
                </tr>
                <tr>
                    <td><strong>Number Story</strong></td>
                    <td>${e.features[0].properties.NumStory}</td>
                </tr>
            </table>`
        )
        .addTo(map);
        });
        
        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        map.on('mouseenter', 'states-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change the cursor back to a pointer
        // when it leaves the states layer.
        map.on('mouseleave', 'states-layer', () => {
        map.getCanvas().style.cursor = '';
    });
}
// <td>&nbsp&nbsp&nbsp</td>