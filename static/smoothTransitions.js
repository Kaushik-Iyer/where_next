// smoothTransitions.js
export async function smoothZoom(map, targetZoom, duration = 1000) {
    const startZoom = map.getZoom()
    const steps = 20
    const stepDuration = duration / steps

    for (let i = 0; i <= steps; i++) {
        const progress = i / steps
        const currentZoom = startZoom + (targetZoom - startZoom) * progress
        await new Promise((resolve) => {
            setTimeout(() => {
                map.setZoom(currentZoom)
                resolve()
            }, stepDuration)
        })
    }
}

export async function smoothPan(map, targetLat, targetLng, duration = 1000) {
    const startLat = map.getCenter().lat()
    const startLng = map.getCenter().lng()
    const steps = 20
    const stepDuration = duration / steps

    for (let i = 0; i <= steps; i++) {
        const progress = i / steps
        const currentLat = startLat + (targetLat - startLat) * progress
        const currentLng = startLng + (targetLng - startLng) * progress
        await new Promise((resolve) => {
            setTimeout(() => {
                map.panTo({ lat: currentLat, lng: currentLng })
                resolve()
            }, stepDuration)
        })
    }
}

export async function smoothFitBounds(map, bounds, padding, duration = 1000) {
    const startCenter = map.getCenter()
    const startZoom = map.getZoom()
    map.fitBounds(bounds, padding)
    const endCenter = map.getCenter()
    const endZoom = map.getZoom()
    map.setCenter(startCenter)
    map.setZoom(startZoom)

    await Promise.all([
        smoothPan(map, endCenter.lat(), endCenter.lng(), duration),
        smoothZoom(map, endZoom, duration)
    ])
}

export async function smoothTransition(fromLat, fromLng, toLat, toLng) {
    const bounds = new google.maps.LatLngBounds()
    bounds.extend(new google.maps.LatLng(fromLat, fromLng))
    bounds.extend(new google.maps.LatLng(toLat, toLng))

    await smoothZoom(map, 2, 500)

    await smoothFitBounds(map, bounds, 0, 1000)

    await smoothPan(map, toLat, toLng, 500)
    await smoothZoom(map, 6, 500)
}