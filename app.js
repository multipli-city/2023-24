let map;
let imgGroup;
let imageOverlays = {};
document.addEventListener("DOMContentLoaded", function () {
    map = L.map("map", {
        zoomControl: false,
        attributionControl: false,
    });

    imgGroup = L.featureGroup();

    // var basemap = L.tileLayer(
    //     "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    //     {
    //         maxZoom: 19,
    //         attribution:
    //             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     }
    // );
    const basemap = L.tileLayer("./public/tiles/{z}/{x}/{y}.png", {
        maxZoom: 14,
        minZoom: 8,
    });

    map.addLayer(basemap);
    // imgGroup = L.featureGroup().addTo(map);
    imgGroup = L.featureGroup();

    fetch("./public/data.json")
        .then((response) => response.json())
        .then((data) => {
            data.posts.forEach((entry, i) => {
                const imageUrl = entry.image;
                const extent = entry.extent;

                const imageOverlay = L.imageOverlay(imageUrl, [
                    [extent.southwest[0], extent.southwest[1]],
                    [extent.northeast[0], extent.northeast[1]],
                ]);

                const uniqueId = L.stamp(imageOverlay);
                imageOverlays[uniqueId] = imageOverlay;

                imageOverlay.addTo(imgGroup);
            });

            map.fitBounds(imgGroup.getBounds());
        })
        .catch((error) => console.error("Error loading JSON:", error));
});

document.addEventListener("alpine:init", () => {
    async function initData() {
        try {
            const response = await fetch("public/data.json");
            const data = await response.json();
            posts = data.posts;
            Alpine.data("x-data").$data.posts = posts;
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }

    function zoomToImage(index) {
        const uniqueId = Object.keys(imageOverlays)[index];
        const imageOverlay = imageOverlays[uniqueId];
        map.flyToBounds(imageOverlay.getBounds(), {});
    }

    Alpine.bind("chapterTitle", (index) => ({
        type: "div",
        "@click"() {
            zoomToImage(index);
        },
    }));
});
