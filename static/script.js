let map
let currentMarker
let infoWindow
let autocomplete
import {
    smoothZoom,
    smoothPan,
    smoothFitBounds,
    smoothTransition
} from './smoothTransitions.js'

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        styles: [
            {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#ffffff" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#e9e9e9" }],
            },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{ color: "#cccccc" }],
            },
        ],
        disableDefaultUI: true,
        mapTypeId: "roadmap",
        minZoom: 2,
        maxZoom: 15,
        restriction: {
            latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
            },
            strictBounds: true,
        },
    })

    infoWindow = new google.maps.InfoWindow()

    const input = document.getElementById("location-search")
    autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["(regions)"],
    })

    autocomplete.bindTo("bounds", map)
    populateCountryFilter()

    autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace()

        if (!place.geometry || !place.geometry.location) {
            console.log("No location found for input: " + place.name)
            return
        }

        if (place.geometry.viewport) {
            await smoothFitBounds(map, place.geometry.viewport, 0)
        } else {
            await smoothPan(map, place.geometry.location.lat(), place.geometry.location.lng())
            await smoothZoom(map, 8)
        }

        fetchNearbyPlaces(place.geometry.location.lat(), place.geometry.location.lng())
    })

    map.addListener("click", onMapClick)

    setupEventListeners()
}

function populateCountryFilter() {
    const countryFilter = document.getElementById("country-filter")
    countryFilter.innerHTML = '<option value="">Select Country</option>'

    countries.sort((a, b) => a.name.localeCompare(b.name)).forEach((country) => {
        const option = document.createElement("option")
        option.value = country.name
        option.textContent = country.name
        countryFilter.appendChild(option)
    })
}

function setupEventListeners() {
    document.getElementById("continent-filter").addEventListener("change", onContinentChange)
    document.getElementById("country-filter").addEventListener("change", onCountryChange)
    document.getElementById("place-type").addEventListener("change", onPlaceTypeChange)
    document.getElementById("random").addEventListener("click", getRandomPlace)
    document.getElementById("reset").addEventListener("click", resetView)
}

function onContinentChange() {
    const continentFilter = document.getElementById("continent-filter")
    const countryFilter = document.getElementById("country-filter")
    const searchInput = document.getElementById("location-search")
    const selectedContinent = continentFilter.value

    if (selectedContinent) {
        searchInput.value = selectedContinent
        searchLocation(selectedContinent)
    }

    countryFilter.innerHTML = '<option value="">Select Country</option>'
    countryFilter.disabled = !selectedContinent

    if (selectedContinent) {
        countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((country) => {
                const option = document.createElement("option")
                option.value = country.name
                option.textContent = country.name
                countryFilter.appendChild(option)
            })
    }
}

function onCountryChange() {
    const countryFilter = document.getElementById("country-filter")
    const searchInput = document.getElementById("location-search")
    const selectedCountry = countryFilter.value

    if (selectedCountry) {
        const country = countries.find(c => c.name === selectedCountry)
        if (country && country.capital) {
            searchInput.value = country.capital
            searchLocation(country.capital)
        } else {
            searchInput.value = selectedCountry
            searchLocation(selectedCountry)
        }
    }
}

async function searchLocation(query) {
    const geocoder = new google.maps.Geocoder()

    const currentCenter = map.getCenter()
    const fromLat = currentCenter.lat()
    const fromLng = currentCenter.lng()

    geocoder.geocode({ address: query }, async (results, status) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location
            const toLat = location.lat()
            const toLng = location.lng()

            await smoothTransition(fromLat, fromLng, toLat, toLng)

            fetchNearbyPlaces(toLat, toLng)
        } else {
            console.error("Geocoding failed: " + status)
        }
    })
}

function onPlaceTypeChange() {
    if (currentMarker) {
        const position = currentMarker.getPosition()
        fetchNearbyPlaces(position.lat(), position.lng())
    }
}

async function onMapClick(e) {
    const currentCenter = map.getCenter()
    const fromLat = currentCenter.lat()
    const fromLng = currentCenter.lng()

    const toLat = e.latLng.lat()
    const toLng = e.latLng.lng()

    await smoothTransition(fromLat, fromLng, toLat, toLng)
    fetchNearbyPlaces(toLat, toLng)
}

async function fetchNearbyPlaces(lat, lng) {
    const placeType = document.getElementById("place-type").value
    let url = `/places?lat=${lat}&lng=${lng}`
    if (placeType) {
        url += `&place_type=${placeType}`
    }
    const response = await fetch(url)
    const data = await response.json()
    displayPlaces(data, lat, lng)
}

let polylines = []

async function displayPlaces(data, lat, lng) {
    polylines.forEach((line) => line.setMap(null))
    polylines = []

    if (currentMarker) {
        currentMarker.setMap(null)
    }

    const existingPanel = document.querySelector(".places-panel")
    if (existingPanel) {
        existingPanel.remove()
    }

    const placesPanel = document.createElement("div")
    placesPanel.className = "places-panel"
    document.body.appendChild(placesPanel)

    placesPanel.innerHTML = `
        <div class="places-panel-header">
            <h3>Nearby Places</h3>
            <button class="places-panel-close">&times;</button>
        </div>
        <div class="place-cards-container"></div>
    `

    const closeButton = placesPanel.querySelector(".places-panel-close")
    closeButton.addEventListener("click", () => {
        placesPanel.classList.remove("active")
    })

    const bounds = new google.maps.LatLngBounds()
    bounds.extend(new google.maps.LatLng(lat, lng))

    currentMarker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#3498db",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
        },
    })

    const cardsContainer = placesPanel.querySelector(".place-cards-container")

    data.places.forEach((place, index) => {
        bounds.extend(new google.maps.LatLng(place.location.lat, place.location.lng))

        const marker = new google.maps.Marker({
            position: place.location,
            map: map,
            label: {
                text: (index + 1).toString(),
                color: "#3498db",
                fontSize: "14px",
                fontWeight: "500",
            },
        })

        const card = document.createElement("div")
        card.className = "place-card"
        card.innerHTML = `
            <div class="place-card-number">${index + 1}</div>
            ${place.photo_url
                ? `<img src="${place.photo_url}" alt="${place.name}">`
                : '<div class="photo-placeholder"></div>'
            }
            <div class="place-card-content">
                <h4>${place.name}</h4>
                <p>${place.description}</p>
            </div>
        `

        card.addEventListener("mouseenter", () => {
            marker.setAnimation(google.maps.Animation.BOUNCE)
            marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1)
        })

        card.addEventListener("mouseleave", () => {
            marker.setAnimation(null)
        })

        card.addEventListener("click", async () => {
            await smoothPan(map, place.location.lat, place.location.lng)
            await smoothZoom(map, 15)
        })

        cardsContainer.appendChild(card)

        const line = new google.maps.Polyline({
            path: [{ lat, lng }, place.location],
            geodesic: true,
            strokeColor: "#3498db",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            map: map,
        })
        polylines.push(line)
    })

    await smoothFitBounds(map, bounds, {
        top: 50,
        right: 450,
        bottom: 50,
        left: 50,
    })

    requestAnimationFrame(() => {
        placesPanel.classList.add("active")
    })

    const zoom = map.getZoom()
    if (zoom < 5) await smoothZoom(map, 5)
    if (zoom > 12) await smoothZoom(map, 12)
}

function showLoadingMessage(message) {
    const loadingDiv = document.getElementById('loading-message')
    loadingDiv.textContent = message
    loadingDiv.style.display = 'block'
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message')
    loadingDiv.style.display = 'none'
}


async function getRandomPlace() {
    const continentFilter = document.getElementById("continent-filter")
    const countryFilter = document.getElementById("country-filter")
    const selectedContinent = continentFilter.value
    const selectedCountry = countryFilter.value

    let loadingMessage = "Finding a surprise destination..."
    if (selectedCountry) {
        loadingMessage = `Finding an interesting place in ${selectedCountry}...`
    } else if (selectedContinent) {
        loadingMessage = `Finding an interesting place in ${selectedContinent}...`
    }
    showLoadingMessage(loadingMessage)
    try {
        let url = "/random"
        if (selectedCountry) {
            url += `?country=${encodeURIComponent(selectedCountry)}`
        } else if (selectedContinent) {
            url += `?continent=${encodeURIComponent(selectedContinent)}`
        }

        const response = await fetch(url)
        const place = await response.json()

        const currentCenter = map.getCenter()
        await smoothTransition(currentCenter.lat(), currentCenter.lng(), place.lat, place.lng)

        fetchNearbyPlaces(place.lat, place.lng)
    } finally {
        hideLoadingMessage()
    }
}

async function resetView() {
    await smoothPan(map, 20, 0)
    await smoothZoom(map, 2)
    if (currentMarker) {
        currentMarker.setMap(null)
    }
    if (infoWindow) {
        infoWindow.close()
    }
    document.getElementById("continent-filter").value = ""
    document.getElementById("country-filter").value = ""
    document.getElementById("place-type").value = ""
    document.getElementById("location-search").value = ""
    const placesPanel = document.querySelector(".places-panel")
    if (placesPanel) {
        placesPanel.remove()
    }
}

document.addEventListener("DOMContentLoaded", initMap)