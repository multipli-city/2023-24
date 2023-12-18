let map;
let imgGroup;
let imageOverlays = {};
document.addEventListener("DOMContentLoaded", function () {
    map = L.map("map", {
        zoomControl: false,
        attributionControl: false,
    });

    // add tiles
    const basemap = L.tileLayer("./public/tiles/{z}/{x}/{y}.png", {
        maxZoom: 14,
        minZoom: 8,
    });
    map.addLayer(basemap);

    // load logo
    const logoUrl = "./public/logo.png";
    const extent = {
        southwest: [0.368963, 0.442059],
        northeast: [0.489495, 0.658653],
    };
    const logoImg = L.imageOverlay(logoUrl, [
        [extent.southwest[0], extent.southwest[1]],
        [extent.northeast[0], extent.northeast[1]],
    ]);

    // fit to logo
    logoImg.addTo(map);
    map.fitBounds(logoImg.getBounds());
});

document.addEventListener("alpine:init", () => {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function zoomToImage(index) {
        const extent = data.posts[index].extent;
        map.flyToBounds(
            [
                [extent.southwest[0], extent.southwest[1]],
                [extent.northeast[0], extent.northeast[1]],
            ],
            {}
        );
    }

    Alpine.bind("chapterTitle", (index) => ({
        type: "div",
        "@click"() {
            zoomToImage(index);
        },
    }));
});
